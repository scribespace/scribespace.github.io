import { $packShortcut, $shortcutToDebugString, INVALID_SHORTCUT, NO_SHORTCUT, Shortcut } from "@systems/commandsManager/shortcut";
import { Func, assert, variableExists } from "@utils";
import { LexicalCommand } from "lexical";
import { Action } from "@systems/commandsManager/actionCommand";
import { Command, CommandListener } from "@systems/commandsManager/command";
import { $callCommand, $registerCommand } from "@systems/commandsManager/commandsManager";

export const LISTENERS_TO_CALL_CMD = $registerCommand<() => void>("LISTENERS_TO_CALL_CMD");
export const LEXICAL_DISPATCH_NATIVE_CMD = $registerCommand<{ cmd: LexicalCommand<unknown>; payload: unknown; }>("LEXICAL_DISPATCH_NATIVE_CMD");
export const LEXICAL_REGISTER_NATIVE_CMD = $registerCommand<LexicalCommandPayload>("LEXICAL_REGISTER_NATIVE_CMD");
export const LEXICAL_DELETE_NATIVE_CMD = $registerCommand<LexicalCommandPayload>("LEXICAL_DELETE_NATIVE_CMD");

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

export class EditorActionCommand<P> extends EditorCommand<P> implements Action<P> {
    readonly shortcut: Shortcut;
    readonly defaultPayload?: P | undefined;
    readonly description?: string | undefined;

    constructor(name: string, shortcut?: Shortcut, defaultPayload?: P, description?: string, lexicalCommand?: LexicalCommand<P>) {
        super(name, lexicalCommand);
        this.shortcut = shortcut || NO_SHORTCUT;
        this.defaultPayload = defaultPayload;
        this.description = description;
    }
}

const shortcutsMap = new Map<number, EditorActionCommand<unknown>>();

export function $getEditorShortcutsMap(): Readonly<Map<number, EditorActionCommand<unknown>>> {
  return shortcutsMap;
}

export function $registerEditorCommand<P>(name: string, lexicalCommand?: LexicalCommand<P>): EditorCommand<P> {
  const cmd = new EditorCommand<P>(name, lexicalCommand);
  return cmd;
}

export function $registerEditorActionCommand<P>(name: string, lexicalCommand?: LexicalCommand<P>, shortcut?: Shortcut, defaultPayload?: P, description?: string): EditorCommand<P> {
  const cmd = new EditorActionCommand(name, shortcut, defaultPayload, description, lexicalCommand);
  if (variableExists(shortcut)) {
    const packedShortcut = $packShortcut(shortcut);
    assert(packedShortcut != INVALID_SHORTCUT, `${name}: shortcut ${$shortcutToDebugString(shortcut)} not supported`);
    assert(!shortcutsMap.has(packedShortcut), `${name}: shortcut ${$shortcutToDebugString(shortcut)} taken by: ${shortcutsMap.get(packedShortcut)?.name}`);

    shortcutsMap.set(packedShortcut, cmd);
  }

  return cmd;
}

