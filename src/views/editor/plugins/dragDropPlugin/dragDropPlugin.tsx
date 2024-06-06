import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";
import {
  DRAG_DROP_ADD_TYPES_LISTENER_COMMAND,
  DragDropListener,
} from "./dragDropCommands";
import { assert } from "@/utils";

export function DragDropPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const dragDropListeners = new Map<string, DragDropListener>();

    const registeredCommands = mergeRegister(
      editor.registerCommand(
        DRAG_DROP_ADD_TYPES_LISTENER_COMMAND,
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
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        DRAG_DROP_PASTE,
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
        COMMAND_PRIORITY_LOW,
      ),
    );

    return () => {
      registeredCommands();
      dragDropListeners.clear();
    };
  }, [editor]);

  return null;
}
