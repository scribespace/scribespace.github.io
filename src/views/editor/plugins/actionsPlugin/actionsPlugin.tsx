import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getActionScope } from "@systems/shortcutManager/action";
import { $packShortcut, $shortcutFromKeyboardEvent, INVALID_SHORTCUT } from "@systems/shortcutManager/shortcut";
import { variableExists } from "@utils";
import { useEffect } from "react";
import { KEY_DOWN_CMD } from "../commandsPlugin/editorCommands";
import { EDITOR_ACTION_SCOPE } from "./editorActions";

const editorActionScope = $getActionScope( EDITOR_ACTION_SCOPE );

export function ActionsPlugin(){
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => {
            return mergeRegister(
                $registerCommandListener(
                    KEY_DOWN_CMD,
                    (event: KeyboardEvent) => {
                        const shortcut = $shortcutFromKeyboardEvent(event);
                        const packedShortcut = $packShortcut(shortcut);
                        if ( packedShortcut === INVALID_SHORTCUT ) {
                            return false;
                        }
                        const cmd = editorActionScope.actions.get(packedShortcut);
                        if ( variableExists(cmd) ) {
                            return true;
                        }

                        return false;
                    }
                )
            );
        },
        [editor]
    );



    return null;
}