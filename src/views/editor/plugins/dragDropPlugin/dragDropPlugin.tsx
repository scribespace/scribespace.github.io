import { assert } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { useEffect, useMemo } from "react";
import { DRAG_DROP_PASTE_CMD } from "../commandsPlugin/editorCommands";
import {
  EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD,
  DragDropListener,
} from "./dragDropCommands";

export function DragDropPlugin() {
  const [editor] = useLexicalComposerContext();

  const dragDropListeners = useMemo(
    () => {
      return new Map<string, DragDropListener>();
    },
    []
  ) ;

  useEffect(() => {
    const registeredCommands = mergeRegister(
      $registerCommandListener(
        EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD,
        (payloud) => {
          for (const fileType of payloud.types) {
            assert(
              !dragDropListeners.has(fileType),
              "DragDrop: type already regitered",
            );
            dragDropListeners.set(fileType, payloud.listener);
          }
          return true;
        },
      ),

      $registerCommandListener(
        DRAG_DROP_PASTE_CMD,
        (payloads) => {
          const listenersPayloads = new Map<DragDropListener, File[]>();
          
          for (const payload of payloads) {
            const listener = dragDropListeners.get(payload.type);
            if (listener) {
              if (!listenersPayloads.has(listener))
                listenersPayloads.set(listener, []);

              listenersPayloads.get(listener)!.push(payload);
            }
          }
          for (const listener of listenersPayloads) {
            listener[0](listener[1]);
          }

          return true;
        },
      ),
    );

    return () => {
      registeredCommands();
      dragDropListeners.clear();
    };
  }, [dragDropListeners, editor]);

  return null;
}
