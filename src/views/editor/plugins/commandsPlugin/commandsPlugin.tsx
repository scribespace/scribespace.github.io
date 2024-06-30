import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { Func, assert } from "@utils";
import { COMMAND_PRIORITY_NORMAL } from "lexical";
import { useEffect, useRef } from "react";
import { LEXICAL_DELETE_NATIVE_CMD, LEXICAL_DISPATCH_NATIVE_CMD, LEXICAL_REGISTER_NATIVE_CMD, LISTENERS_TO_CALL_CMD, LexicalCommandPayload } from "./editorCommandManager";

export function CommandsPlugin(){
    const [editor] = useLexicalComposerContext();
    const nativeListeners = useRef<Map<LexicalCommandPayload, Func>>(new Map());

    useEffect(
        () => {
            return mergeRegister(
                $registerCommandListener(
                    LISTENERS_TO_CALL_CMD,
                    (listenersCall) => {
                        editor.update(
                            listenersCall
                        );
                    }
                ),
                $registerCommandListener(
                    LEXICAL_DISPATCH_NATIVE_CMD,
                    (payload) => {
                        editor.dispatchCommand(payload.cmd, payload.payload);
                    }
                ),
                $registerCommandListener(
                    LEXICAL_REGISTER_NATIVE_CMD,
                    (payload) => {
                        assert( !nativeListeners.current.has(payload), `Listener already registered for: ${payload.cmd.type}` );
                        const deleteRegister = editor.registerCommand(
                            payload.cmd,
                            (p) => {
                                return payload.listener(p);
                            },
                            COMMAND_PRIORITY_NORMAL
                        );

                        nativeListeners.current.set( payload, deleteRegister );
                    }
                ),
                $registerCommandListener(
                    LEXICAL_DELETE_NATIVE_CMD,
                    (payload) => {
                        assert( nativeListeners.current.has(payload), `Listener already deleted: ${payload.cmd.type}` );
                        const deleteRegister = nativeListeners.current.get(payload)!;
                        deleteRegister();
                        nativeListeners.current.delete(payload);
                    }
                ),
            );
        },
        [editor]
    );



    return null;
}