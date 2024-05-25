import { $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import { $isLinkNode, $createLinkNode} from '@lexical/link';
import { useEffect, useState } from "react";
import { validateUrl } from "@utils";
import { useMainThemeContext } from "@/mainThemeContext";
import { useToolbarContext } from "../../plugins/toolbarPlugin/context";
import { MenuItem } from "../menu";
import { $menuItemParent } from "../menu/theme";

export function LinkToolbar() {
    const {editor, theme: {itemSelected}} = useToolbarContext();
    const {editorTheme: {linkTheme: {LinkIcon}} } = useMainThemeContext();
    const [isLinkSelected, setIsLinkSelected] = useState<boolean>(false);

    function onClick(e: React.MouseEvent) {
        editor.update(()=>{
            const selection = $getSelection();
            if ( $isRangeSelection(selection)) {
                const nodes = selection.getNodes();

                let allText = true;
                let allLinkNode = true;
                const nodeParent = nodes[0].getParent();
                const isParentLinkNode= $isLinkNode(nodeParent);
                for ( const node of nodes ) {
                    allText = allText && $isTextNode(node);
                    allLinkNode = allLinkNode && isParentLinkNode && (node.getParent() == nodeParent);
                }

                if ( allLinkNode ) {
                    const linkNodes = nodeParent!.getChildren();
                    for ( const node of linkNodes ) {
                        nodeParent!.insertBefore(node);
                    }
                    nodeParent!.remove();
                } else {
                    const startEnd = selection.getStartEndPoints();
                    if ( startEnd ) {
                        if ( allText && !startEnd[0].is(startEnd[1]) ) {
                            const newNodes = selection.extract();
                            let nodesText = '';
                            for (const node of newNodes) {
                                nodesText += node.getTextContent();
                            }
                            const linkNode = $createLinkNode(validateUrl(nodesText) ? nodesText : '');
                            newNodes[0].insertBefore(linkNode);
                            linkNode.append(...newNodes);
                        }
                    }
                }
            }
        });

        e.preventDefault();
    }

    useEffect(()=>{
        function updateState() {
            editor.update(()=>{
                const selection = $getSelection();
                if ( $isRangeSelection(selection)) {
                    const nodes = selection.getNodes();
    
                    let allLinkNode = true;
                    const nodeParent = nodes[0].getParent();
                    const isParentLinkNode= $isLinkNode(nodeParent);
                    for ( const node of nodes ) {
                        allLinkNode = allLinkNode && isParentLinkNode && (node.getParent() == nodeParent);
                    }
    
                    setIsLinkSelected(allLinkNode);
                }
            });
        }

        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateState();
              return false;
            },
            COMMAND_PRIORITY_LOW
          );
    },[editor]);

    return (
        <div className={isLinkSelected ? itemSelected : ''} style={$menuItemParent}>
            <MenuItem onClick={onClick}>
                <LinkIcon/>
            </MenuItem>
        </div>
    );
}