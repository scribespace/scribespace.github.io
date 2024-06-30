import { $createDateNode } from "@editor/nodes/date";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $createParagraphNode, $insertNodes } from "lexical";
import { useEffect } from "react";
import { DATE_INSERT_CMD } from "./dateCommands";

export function DatePlugin() {
    useEffect( 
        () => {
            return $registerCommandListener( DATE_INSERT_CMD,
                () => {
                    const textNode = $createDateNode();
                    const dateParagraphNode = $createParagraphNode();
                    const paragraphNode = $createParagraphNode();

                    dateParagraphNode.append(textNode);
                    $insertNodes([dateParagraphNode, paragraphNode]);
                }
             );
        },
        []
     );
    
    return null;
}