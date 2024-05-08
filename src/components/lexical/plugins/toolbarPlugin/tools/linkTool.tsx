import { ImLink } from "react-icons/im";
import { LinkEditor } from "../../linkPlugin/linkEditor";
import { LexicalComposerContextType } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, LexicalEditor, SELECTION_CHANGE_COMMAND } from "lexical";
import {LinkNode, $isLinkNode, $createLinkNode} from '@lexical/link'
import { mergeRegister } from '@lexical/utils'
import { useEffect, useRef, useState } from "react";
import DropdownTool from "./dropdownTool";

interface LinkToolProps {
    editor: LexicalEditor;
    composerContext: LexicalComposerContextType;
}

export default function LinkTool({editor, composerContext} : LinkToolProps) {
    const linkEditorRef = useRef<HTMLDivElement>(null)
    const [linkText, setLinkText] = useState<string>('')
    const [linkURL, setLinkURL] = useState<string>('')

    useEffect(()=> {
        return mergeRegister(
          editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                let currentLinkText = ''
                let currentLinkURL = ''

                const selection = $getSelection();
                if ( $isRangeSelection(selection) ) {
                    const nodes = selection.getNodes();
                    const parent = nodes[0].getParent();
                    
                    let allLinkNode = true;
                    let allTextNode = true;
                    nodes.forEach((node)=>{
                        const nodeParent = node.getParent()
                        const sameParent = nodeParent == parent;
                        allLinkNode = allLinkNode && sameParent && $isLinkNode(nodeParent)
                        allTextNode = sameParent && $isTextNode(node)
                    })
                    if ( allLinkNode ) {
                        const linkNode = parent as LinkNode;
                        currentLinkURL = linkNode.getURL()
                        currentLinkText = linkNode.getTextContent()
                    } else if ( allTextNode ) {
                        currentLinkText = selection.getTextContent()
                    }
                }

                setLinkText(currentLinkText)
                setLinkURL(currentLinkURL)
              return false;
            },
            COMMAND_PRIORITY_LOW
          ),
        );
      },[editor])

    const Tool = () => {
        return <ImLink className='item'/>
    }
    return (
        <DropdownTool Tool={Tool}>
            <LinkEditor ref={linkEditorRef} editor={editor} composerContext={composerContext} text={linkText} url={linkURL}/>
        </DropdownTool>
    )
}