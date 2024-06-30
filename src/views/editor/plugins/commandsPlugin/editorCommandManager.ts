import { Command, CommandListener } from "@systems/commandsManager/command";
import { $callCommand, $createCommand } from "@systems/commandsManager/commandsManager";
import { Func } from "@utils";
import { LexicalCommand } from "lexical";

export const LISTENERS_TO_CALL_CMD = $createCommand<() => void>("LISTENERS_TO_CALL_CMD");
export const LEXICAL_DISPATCH_NATIVE_CMD = $createCommand<{ cmd: LexicalCommand<unknown>; payload: unknown; }>("LEXICAL_DISPATCH_NATIVE_CMD");
export const LEXICAL_REGISTER_NATIVE_CMD = $createCommand<LexicalCommandPayload>("LEXICAL_REGISTER_NATIVE_CMD");
export const LEXICAL_DELETE_NATIVE_CMD = $createCommand<LexicalCommandPayload>("LEXICAL_DELETE_NATIVE_CMD");

export type LexicalCommandListener<P> = (payload: P) => boolean;

export interface LexicalCommandPayload {
    cmd: LexicalCommand<unknown>;
    listener: LexicalCommandListener<unknown>;
}

export class EditorCommand<P> extends Command<P> {
    protected __lexicalCommand: LexicalCommand<P> | null;
    get lexicalCommand() { return this.__lexicalCommand; }

    constructor(name: string, lexicalCommand?: LexicalCommand<P>) {
        super(name);
        this.__lexicalCommand = lexicalCommand || null;
    }

    callCommand(payload: P, listeners: CommandListener<P>[]) {
        if (this.lexicalCommand) {
            $callCommand(LEXICAL_DISPATCH_NATIVE_CMD, { cmd: this.lexicalCommand, payload });
            return;
        }

        const callListeners = () => {
            for (const listener of listeners) {
                listener(payload);
            }
        };

        $callCommand(LISTENERS_TO_CALL_CMD, callListeners);
    }

    registerExternalCommandListener(listener: LexicalCommandListener<P>): null | Func {
        if (this.lexicalCommand) {
            const payload: LexicalCommandPayload = { cmd: this.lexicalCommand, listener: listener as LexicalCommandListener<unknown> };
            $callCommand(LEXICAL_REGISTER_NATIVE_CMD, payload);
            return () => {
                $callCommand(LEXICAL_DELETE_NATIVE_CMD, payload);
            };
        }

        return null;
    }
}

export function $createEditorCommand<P>(name: string, lexicalCommand?: LexicalCommand<P>): EditorCommand<P> {
  const cmd = new EditorCommand<P>(name, lexicalCommand);
  return cmd;
}
