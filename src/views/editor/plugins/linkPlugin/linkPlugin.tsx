import { $createLinkNode, $isLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import {
  $getNodeByKey,
  $getPreviousSelection,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  TextNode
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { LinkEditor } from "@editor/components/link";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { urlRegExp, validateUrl } from "@utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { KEY_ENTER_CMD, KEY_SPACE_CMD, SELECTION_CHANGE_CMD } from "../commandsPlugin/editorCommands";
import { LINK_CONVERT_SELECTED_CMD } from "./linkCommands";
import { $openTab } from "@systems/environment/environment";

export default function LinkPlugin() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme }: MainTheme = useMainThemeContext();

  const linkEditorRef = useRef<HTMLDivElement>(null);
  const linkNodeRef = useRef<LinkNode | null>(null);
  const [linkURL, setLinkURL] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");

  const theme = useMemo(() => {
    return editorTheme.editorSeeThrough;
  }, [editorTheme.editorSeeThrough]);

  function TryCreateLink(lastNode: LexicalNode, lastNodeOffset: number) {
    let testString = "";
    let selectedNodes: TextNode[] = [];
    let includesSpaceIndex = -1;

    // Get all nodes and text to the left from space. Break on something that isn't text or on space
    // returns string sliced at the space
    {
      const nodes = lastNode.getPreviousSiblings();

      if ($isTextNode(lastNode)) {
        selectedNodes.push(lastNode);
        const nodeText = lastNode.getTextContent().slice(0, lastNodeOffset);
        includesSpaceIndex = nodeText.lastIndexOf(" ");
        if (includesSpaceIndex && includesSpaceIndex > -1) {
          testString = nodeText.slice(includesSpaceIndex);
        } else {
          testString = nodeText;
        }
      }

      if (testString != "") {
        for (let nID = nodes.length - 1; nID >= 0; --nID) {
          const node = nodes[nID];
          if ($isTextNode(node)) {
            selectedNodes = [node, ...selectedNodes];
            const nodeText = node.getTextContent();
            includesSpaceIndex = nodeText.lastIndexOf(" ");
            if (includesSpaceIndex && includesSpaceIndex > -1) {
              testString = nodeText.slice(includesSpaceIndex) + testString;
              break;
            }
            testString = nodeText + testString;
          } else {
            break;
          }
        }
      }
    }

    // Get regex matching nodes, cut first, cut last node, create link
    {
      const match = urlRegExp.exec(testString);
      if (match) {
        const matchingNodes: TextNode[] = [];
        let textLength = 0;
        const matchStart = Math.max(0, includesSpaceIndex) + match.index;
        let firstNodeOffset = 0;
        for (const node of selectedNodes) {
          const nodeTextLength = node.getTextContentSize();
          if (textLength + nodeTextLength > matchStart) {
            if (matchingNodes.length == 0) {
              firstNodeOffset = matchStart - textLength;
            }
            matchingNodes.push(node);
          }
          textLength += nodeTextLength;
        }
        const [, firstNode] = matchingNodes[0].splitText(firstNodeOffset);
        if (firstNode) {
          matchingNodes[0] = firstNode;
        }
        const [lastNode] =
          matchingNodes[matchingNodes.length - 1].splitText(lastNodeOffset);
        matchingNodes[matchingNodes.length - 1] = lastNode;

        const linkNode = $createLinkNode(match[0]);
        matchingNodes[0].insertBefore(linkNode);
        linkNode.append(...matchingNodes);
      }
    }
  }

  useEffect(() => {
    editor.update(() => {
      if (linkNodeRef.current) {
        const linkElement = editor.getElementByKey(
          linkNodeRef.current.getKey(),
        );
        if (linkElement) {
          const linkEditorObject = linkEditorRef.current;
          if (linkEditorObject != null) {
            const { left, width, bottom } = linkElement.getBoundingClientRect();
            const { width: listhWidth } =
              linkEditorObject.getBoundingClientRect();
            linkEditorObject.style.top = `${bottom}px`;
            linkEditorObject.style.left = `${left + width * 0.5 - listhWidth * 0.5}px`;
          }
        }
      }
    });
  }, [linkURL, linkText, editor]);

  useEffect(() => {
    if (!editor.hasNode(LinkNode)) {
      throw new Error("LinkPlugin: ListNode not registered on editor");
    }

    return mergeRegister(
      $registerCommandListener(
        SELECTION_CHANGE_CMD,
        () => {
          linkNodeRef.current = null;
          let currentLinkURL = "";
          let currentLinkText = "";
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            if (nodes.length == 1) {
              const parent = nodes[0].getParent();
              if ($isLinkNode(parent)) {
                const linkNode = parent as LinkNode;
                linkNodeRef.current = linkNode;
                currentLinkURL = linkNode.getURL();
                currentLinkText = linkNode.getTextContent();
              }
            }
          }
          setLinkURL(currentLinkURL);
          setLinkText(currentLinkText);
          return false;
        },
      ),

      $registerCommandListener(
        KEY_SPACE_CMD,
        () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const startEnd = selection.getStartEndPoints();
              if (startEnd) {
                const start = startEnd[0];
                TryCreateLink(selection.getNodes()[0], start.offset);
              }
            }
          });
          return false;
        },
      ),

      $registerCommandListener(
        KEY_ENTER_CMD,
        () => {
          editor.update(() => {
            const selection = $getPreviousSelection();
            if ($isRangeSelection(selection)) {
              const startEnd = selection.getStartEndPoints();
              if (startEnd) {
                const start = startEnd[0];
                const node = $getNodeByKey(start.key);
                if (node) TryCreateLink(node, start.offset);
              }
            }
          });
          return false;
        },
      ),
      $registerCommandListener(
        LINK_CONVERT_SELECTED_CMD,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
    
            let allText = true;
            let allLinkNode = true;
            const nodeParent = nodes[0].getParent();
            const isParentLinkNode = $isLinkNode(nodeParent);
            for (const node of nodes) {
              allText = allText && $isTextNode(node);
              allLinkNode = allLinkNode && isParentLinkNode && node.getParent() == nodeParent;
            }
    
            if (allLinkNode) {
              const linkNodes = nodeParent!.getChildren();
              for (const node of linkNodes) {
                nodeParent!.insertBefore(node);
              }
              nodeParent!.remove();
            } else {
              const startEnd = selection.getStartEndPoints();
              if (startEnd) {
                if (allText && !startEnd[0].is(startEnd[1])) {
                  const newNodes = selection.extract();
                  let nodesText = "";
                  for (const node of newNodes) {
                    nodesText += node.getTextContent();
                  }
                  const linkNode = $createLinkNode(
                    validateUrl(nodesText) ? nodesText : "",
                  );
                  newNodes[0].insertBefore(linkNode);
                  linkNode.append(...newNodes);
                }
              }
            }
          }
          return true;
        },
      ),
    );
  }, [editor]);

  function onTextChange(text: string) {
    editor.update(() => {
      if (linkNodeRef.current) {
        const textNode = linkNodeRef.current.getFirstChild();
        if (textNode && $isTextNode(textNode)) {
          textNode.setTextContent(text);
          setLinkText(text);
        }
      }
    });
  }

  function onURLChange(url: string) {
    editor.update(() => {
      if (linkNodeRef.current) {
        linkNodeRef.current.setURL(url);
        setLinkURL(url);
      }
    });
  }

  return (
    <>
      <NodeEventPlugin
        nodeType={LinkNode}
        eventType={"click"}
        eventListener={(e: Event, editor: LexicalEditor, nodeKey: NodeKey) => {
          const element = editor.getElementByKey(nodeKey) as HTMLLinkElement;
          if ((e as MouseEvent).ctrlKey && element) {
            const url = element.href;
            $openTab(url);
          }
        }}
      />
      <LexicalLinkPlugin validateUrl={validateUrl} />
      {linkNodeRef.current && (
        <div ref={linkEditorRef} className={theme}>
          <LinkEditor
            url={linkURL}
            text={linkText}
            onTextChange={onTextChange}
            onURLChange={onURLChange}
          />
        </div>
      )}
    </>
  );
}
