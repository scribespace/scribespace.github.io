import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import {LinkNode, $isLinkNode, $createLinkNode} from '@lexical/link'
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import { $createTextNode, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, LexicalEditor, NodeKey, SELECTION_CHANGE_COMMAND, TextNode } from "lexical";

import './css/linkPluginDefault.css'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from '@lexical/utils'

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LinkEditor } from "./linkEditor";

const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.)[A-Za-z0-9-]+\.[A-Za-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
export function validateUrl(url: string): boolean {
  return url === 'https://' || urlRegExp.test(url);
}

export default function LinkPlugin() {
    const [editor, composerContext] = useLexicalComposerContext();
    const linkEditorRef = useRef<HTMLDivElement>(null)
    const linkNodeRef = useRef<LinkNode | null>(null)
    const [linkURL, setLinkURL] = useState<string>("")
    const [linkText, setLinkText] = useState<string>("")

    const theme = composerContext.getTheme();
    const editorEmbeddedClassName     = theme && theme.linkPlugin ? theme.linkPlugin.linkEditorEmbedded   : 'link-editor-embedded-default'

    const SPACE_SEPARATOR = /[\s]/;
    function StartsWithSeparator(text:string) {
      return SPACE_SEPARATOR.test(text[0])
    }

    function EndsWithSeparator(text:string) {
      return SPACE_SEPARATOR.test(text[text.length-1])
    }

    useEffect(()=> {
      editor.update( () => {
        if ( linkNodeRef.current ) {
          const linkElement = editor.getElementByKey(linkNodeRef.current.getKey());
          if ( linkElement ) {
            const linkEditorObject = linkEditorRef.current;
            if ( linkEditorObject != null ){
                const { top, left, width } = linkElement.getBoundingClientRect();
                const {width: listhWidth } = linkEditorObject.getBoundingClientRect();
                linkEditorObject.style.top = `${top + 20}px`;
                linkEditorObject.style.left = `${left + (width * 0.5) - (listhWidth * 0.5)}px`;
            }  
          }
        }
      })
    },[linkURL, linkText])

    useEffect(()=> {
      return mergeRegister(
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
              let element: HTMLElement | null = null
              linkNodeRef.current = null;
              let currentLinkURL ="";
              let currentLinkText ="";
              const selection = $getSelection();
              if ( $isRangeSelection(selection) ) {
                const nodes = selection.getNodes();
                if ( nodes.length == 1 ) {
                  const parent = nodes[0].getParent();
                  if ( $isLinkNode(parent)) {
                    const linkNode = (parent as LinkNode)
                    element = editor.getElementByKey(parent.getKey());
                    linkNodeRef.current = linkNode;
                    currentLinkURL = linkNode.getURL()
                    currentLinkText = linkNode.getTextContent()
                  }
                }
              }
              setLinkURL(currentLinkURL)
              setLinkText(currentLinkText)
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),

        editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
          const parent = textNode.getParentOrThrow();
          const previous = textNode.getPreviousSibling();

          const textContent = textNode.getTextContent()
          if (!$isLinkNode(parent) && textNode.isSimpleText()) {
            if ( $isLinkNode(previous) && !StartsWithSeparator(textContent) ) {
              const previousLinkNode = previous as LinkNode;
              let linkText = previousLinkNode.getTextContent();
              linkText = linkText + textContent
              previousLinkNode.append(textNode)
              setLinkText(linkText)
              if ( validateUrl(linkText)) {
                previousLinkNode.setURL(linkText)
                setLinkURL(linkText)
              }
            } else {
              const match = urlRegExp.exec(textContent);
              if ( match ) {
                if ( match.index > 0 ) {
                  textNode = textNode.splitText(match.index)[1]
                }

                const linkNode = $createLinkNode(match[0])
                const linkTextNode = $createTextNode(match[0]);
                linkTextNode.setFormat(textNode.getFormat());
                linkTextNode.setDetail(textNode.getDetail());
                linkNode.append(linkTextNode);
                textNode.replace(linkNode)
              }
            }
          }
        }),
      );
    },[editor])

    function onTextChange(text:string) {
      editor.update(() => {
        if ( linkNodeRef.current ) {
          const textNode = linkNodeRef.current.getFirstChild()
          if ( textNode && $isTextNode(textNode)) {
            textNode.setTextContent(text);
            setLinkText(text)
          }
        }
      })
    }

    function onURLChange(url:string) {
      editor.update(() => {
        if ( linkNodeRef.current ) {
          linkNodeRef.current.setURL(url);
          setLinkURL(url)
        }
      })
    }

    return (
        <div>
            <NodeEventPlugin
                nodeType={LinkNode}
                eventType={'click'}
                eventListener={(e: Event, editor: LexicalEditor, nodeKey: NodeKey) => {
                    const element = editor.getElementByKey(nodeKey) as HTMLLinkElement
                    if ( (e as MouseEvent).ctrlKey && element) {
                        const url = element.href;
                        window.open(url, '_blank')?.focus();
                    }                    
                }}/>
            <LexicalLinkPlugin validateUrl={validateUrl}/>
            {(linkURL != '') && createPortal(
              <div className={editorEmbeddedClassName}>
                <LinkEditor ref={linkEditorRef} editor={editor} composerContext={composerContext} url={linkURL} text={linkText} onTextChange={onTextChange} onURLChange={onURLChange}/>
              </div>
            , document.body)}
        </div>
    )
}
