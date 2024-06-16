import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { $callCommand, $registerCommand, Command, CommandListener } from "@systems/commandsManager/commandsManager";
import { NO_SHORTCUT, Shortcut, $shortcutToDebugString, $packShortcut } from "@systems/commandsManager/shortcut";
import { Func, assert, variableExists } from "@utils";
import {
  BLUR_COMMAND,
  BaseSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND,
  CLEAR_HISTORY_COMMAND,
  CLICK_COMMAND,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  COPY_COMMAND,
  CUT_COMMAND,
  DELETE_CHARACTER_COMMAND,
  DELETE_LINE_COMMAND,
  DELETE_WORD_COMMAND,
  DRAGEND_COMMAND,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  ElementFormatType,
  FOCUS_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  INSERT_TAB_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_DOWN_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_MODIFIER_COMMAND,
  KEY_SPACE_COMMAND,
  KEY_TAB_COMMAND,
  LexicalCommand,
  LexicalNode,
  MOVE_TO_END,
  MOVE_TO_START,
  OUTDENT_CONTENT_COMMAND,
  PASTE_COMMAND,
  PasteCommandType,
  REDO_COMMAND,
  REMOVE_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,
  SELECT_ALL_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
} from "lexical";

export type LexicalCommandListener<P> = (payload: P) => boolean;

export interface LexicalCommandPayload {
  cmd: LexicalCommand<unknown>;
  listener: LexicalCommandListener<unknown>;
}

export const LISTENERS_TO_CALL_CMD = $registerCommand<()=>void>( NO_SHORTCUT, undefined, "LISTENERS_TO_CALL_CMD");
export const LEXICAL_DISPATCH_NATIVE_CMD = $registerCommand<{cmd: LexicalCommand<unknown>, payload: unknown}>( NO_SHORTCUT, undefined, "LEXICAL_DISPATCH_NATIVE_CMD");
export const LEXICAL_REGISTER_NATIVE_CMD = $registerCommand<LexicalCommandPayload>( NO_SHORTCUT, undefined, "LEXICAL_REGISTER_NATIVE_CMD");
export const LEXICAL_DELETE_NATIVE_CMD = $registerCommand<LexicalCommandPayload>( NO_SHORTCUT, undefined, "LEXICAL_DELETE_NATIVE_CMD");

class EditorCommand<P> extends Command<P> {
  __lexicalCommand: LexicalCommand<P> | null;
  get lexicalCommand() {return this.__lexicalCommand;}

  constructor( shortcut: Shortcut, defaultPayload: P | undefined, name: string, lexicalCommand: LexicalCommand<P> | null ) {
    super(shortcut, defaultPayload, name);
    this.__lexicalCommand = lexicalCommand;
  }

  callCommand(payload: P, listeners: CommandListener<P>[]) {
    if ( this.lexicalCommand ) {
      $callCommand( LEXICAL_DISPATCH_NATIVE_CMD, {cmd: this.lexicalCommand, payload} );
      return;
    } 

    const callListeners = () => {
      for ( const listener of listeners ) {
        listener(payload);
      } 
    };

    $callCommand( LISTENERS_TO_CALL_CMD, callListeners );
  }

  registerExternalCommandListener( listener: LexicalCommandListener<P> ): null | Func {
    if ( this.lexicalCommand ) {
      const payload: LexicalCommandPayload = {cmd: this.lexicalCommand, listener: listener as LexicalCommandListener<unknown>};
      $callCommand( LEXICAL_REGISTER_NATIVE_CMD, payload );
      return () => {
        $callCommand( LEXICAL_DELETE_NATIVE_CMD, payload );
      };
    }

    return null;
  }
}

const shortcutsMap = new Map<number, EditorCommand<unknown>>();

export function $getEditorShortcutsMap(): Readonly<Map<number, EditorCommand<unknown>>> {
  return shortcutsMap;
}

export function $registerEditorCommand<P>( name: string, lexicalCommand?: LexicalCommand<P>, shortcut?: Shortcut, defaultPayload?: P ): EditorCommand<P> {
    const cmd = new EditorCommand( shortcut || NO_SHORTCUT, defaultPayload, name, lexicalCommand || null );
    if ( variableExists(shortcut) ) {
      const packedShortcut = $packShortcut(shortcut);
      assert(!shortcutsMap.has(packedShortcut), `${name}: shortcut ${$shortcutToDebugString(shortcut)} taken by: ${shortcutsMap.get(packedShortcut)?.name}`);

      shortcutsMap.set( packedShortcut, cmd );
    }

    return cmd;
}

export const DRAG_DROP_PASTE_CMD: Command<File[]> = $registerEditorCommand("DRAG_DROP_PASTE", DRAG_DROP_PASTE);

export const INSERT_HORIZONTAL_RULE_CMD: Command<void> = $registerEditorCommand("INSERT_HORIZONTAL_RULE_COMMAND", INSERT_HORIZONTAL_RULE_COMMAND);
export const INSERT_ORDERED_LIST_CMD: Command<void> = $registerEditorCommand("INSERT_ORDERED_LIST_COMMAND", INSERT_ORDERED_LIST_COMMAND);
export const INSERT_UNORDERED_LIST_CMD: Command<void> = $registerEditorCommand("INSERT_UNORDERED_LIST_COMMAND", INSERT_UNORDERED_LIST_COMMAND);

export const SELECTION_CHANGE_CMD: Command<void> = $registerEditorCommand("SELECTION_CHANGE_COMMAND", SELECTION_CHANGE_COMMAND);
export const SELECTION_INSERT_CLIPBOARD_NODES_CMD: Command<{ nodes: Array<LexicalNode>; selection: BaseSelection; }> = $registerEditorCommand("SELECTION_INSERT_CLIPBOARD_NODES_COMMAND", SELECTION_INSERT_CLIPBOARD_NODES_COMMAND);
export const CLICK_CMD: Command<MouseEvent> = $registerEditorCommand("CLICK_COMMAND", CLICK_COMMAND);
export const DELETE_CHARACTER_CMD: Command<boolean> = $registerEditorCommand("DELETE_CHARACTER_COMMAND", DELETE_CHARACTER_COMMAND);
export const INSERT_LINE_BREAK_CMD: Command<boolean> = $registerEditorCommand("INSERT_LINE_BREAK_COMMAND", INSERT_LINE_BREAK_COMMAND);
export const INSERT_PARAGRAPH_CMD: Command<void> = $registerEditorCommand("INSERT_PARAGRAPH_COMMAND", INSERT_PARAGRAPH_COMMAND);
export const CONTROLLED_TEXT_INSERTION_CMD: Command<InputEvent | string> = $registerEditorCommand("CONTROLLED_TEXT_INSERTION_COMMAND", CONTROLLED_TEXT_INSERTION_COMMAND);
export const PASTE_CMD: Command<PasteCommandType> = $registerEditorCommand("PASTE_COMMAND", PASTE_COMMAND);
export const REMOVE_TEXT_CMD: Command<InputEvent | null> = $registerEditorCommand("REMOVE_TEXT_COMMAND", REMOVE_TEXT_COMMAND);
export const DELETE_WORD_CMD: Command<boolean> = $registerEditorCommand("DELETE_WORD_COMMAND", DELETE_WORD_COMMAND);
export const DELETE_LINE_CMD: Command<boolean> = $registerEditorCommand("DELETE_LINE_COMMAND", DELETE_LINE_COMMAND);
export const FORMAT_TEXT_CMD: Command<TextFormatType> = $registerEditorCommand("FORMAT_TEXT_COMMAND", FORMAT_TEXT_COMMAND);
export const UNDO_CMD: Command<void> = $registerEditorCommand("UNDO_COMMAND", UNDO_COMMAND);
export const REDO_CMD: Command<void> = $registerEditorCommand("REDO_COMMAND", REDO_COMMAND);
export const KEY_DOWN_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEYDOWN_COMMAND", KEY_DOWN_COMMAND);
export const KEY_ARROW_RIGHT_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_ARROW_RIGHT_COMMAND", KEY_ARROW_RIGHT_COMMAND);
export const MOVE_TO_END_CMD: Command<KeyboardEvent> = $registerEditorCommand("MOVE_TO_END", MOVE_TO_END);
export const KEY_ARROW_LEFT_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_ARROW_LEFT_COMMAND", KEY_ARROW_LEFT_COMMAND);
export const MOVE_TO_START_CMD: Command<KeyboardEvent> = $registerEditorCommand("MOVE_TO_START", MOVE_TO_START);
export const KEY_ARROW_UP_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_ARROW_UP_COMMAND", KEY_ARROW_UP_COMMAND);
export const KEY_ARROW_DOWN_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_ARROW_DOWN_COMMAND", KEY_ARROW_DOWN_COMMAND);
export const KEY_ENTER_CMD: Command<KeyboardEvent | null> = $registerEditorCommand("KEY_ENTER_COMMAND", KEY_ENTER_COMMAND);
export const KEY_SPACE_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_SPACE_COMMAND", KEY_SPACE_COMMAND);
export const KEY_BACKSPACE_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_BACKSPACE_COMMAND", KEY_BACKSPACE_COMMAND);
export const KEY_ESCAPE_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_ESCAPE_COMMAND", KEY_ESCAPE_COMMAND);
export const KEY_DELETE_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_DELETE_COMMAND", KEY_DELETE_COMMAND);
export const KEY_TAB_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_TAB_COMMAND", KEY_TAB_COMMAND);
export const INSERT_TAB_CMD: Command<void> = $registerEditorCommand("INSERT_TAB_COMMAND", INSERT_TAB_COMMAND);
export const INDENT_CONTENT_CMD: Command<void> = $registerEditorCommand("INDENT_CONTENT_COMMAND", INDENT_CONTENT_COMMAND);
export const OUTDENT_CONTENT_CMD: Command<void> = $registerEditorCommand("OUTDENT_CONTENT_COMMAND", OUTDENT_CONTENT_COMMAND);
export const DROP_CMD: Command<DragEvent> = $registerEditorCommand("DROP_COMMAND", DROP_COMMAND);
export const FORMAT_ELEMENT_CMD: Command<ElementFormatType> = $registerEditorCommand("FORMAT_ELEMENT_COMMAND", FORMAT_ELEMENT_COMMAND);
export const DRAGSTART_CMD: Command<DragEvent> = $registerEditorCommand("DRAGSTART_COMMAND", DRAGSTART_COMMAND);
export const DRAGOVER_CMD: Command<DragEvent> = $registerEditorCommand("DRAGOVER_COMMAND", DRAGOVER_COMMAND);
export const DRAGEND_CMD: Command<DragEvent> = $registerEditorCommand("DRAGEND_COMMAND", DRAGEND_COMMAND);
export const COPY_CMD: Command<ClipboardEvent | KeyboardEvent | null> = $registerEditorCommand("COPY_COMMAND", COPY_COMMAND);
export const CUT_CMD: Command<ClipboardEvent | KeyboardEvent | null> = $registerEditorCommand("CUT_COMMAND", CUT_COMMAND);
export const SELECT_ALL_CMD: Command<KeyboardEvent> = $registerEditorCommand("SELECT_ALL_COMMAND", SELECT_ALL_COMMAND);
export const CLEAR_EDITOR_CMD: Command<void> = $registerEditorCommand("CLEAR_EDITOR_COMMAND", CLEAR_EDITOR_COMMAND);
export const CLEAR_HISTORY_CMD: Command<void> = $registerEditorCommand("CLEAR_HISTORY_COMMAND", CLEAR_HISTORY_COMMAND);
export const CAN_REDO_CMD: Command<boolean> = $registerEditorCommand("CAN_REDO_COMMAND", CAN_REDO_COMMAND);
export const CAN_UNDO_CMD: Command<boolean> = $registerEditorCommand("CAN_UNDO_COMMAND", CAN_UNDO_COMMAND);
export const FOCUS_CMD: Command<FocusEvent> = $registerEditorCommand("FOCUS_COMMAND", FOCUS_COMMAND);
export const BLUR_CMD: Command<FocusEvent> = $registerEditorCommand("BLUR_COMMAND", BLUR_COMMAND);
export const KEY_MODIFIER_CMD: Command<KeyboardEvent> = $registerEditorCommand("KEY_MODIFIER_COMMAND", KEY_MODIFIER_COMMAND);