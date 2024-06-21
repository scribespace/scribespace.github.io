import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { Command } from "@systems/commandsManager/command";
import { $createAction } from "@systems/shortcutManager/action";
import { Shortcut, SpecialKey } from "@systems/shortcutManager/shortcut";
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
  UNDO_COMMAND
} from "lexical";
import { EDITOR_ACTION_SCOPE } from "../actionsPlugin/editorActions";
import { $createEditorCommand } from "./editorCommandManager";

export const DRAG_DROP_PASTE_CMD: Command<File[]> = $createEditorCommand("DRAG_DROP_PASTE", DRAG_DROP_PASTE);

export const INSERT_HORIZONTAL_RULE_CMD: Command<void> = $createEditorCommand("INSERT_HORIZONTAL_RULE_COMMAND", INSERT_HORIZONTAL_RULE_COMMAND);
export const INSERT_ORDERED_LIST_CMD: Command<void> = $createEditorCommand("INSERT_ORDERED_LIST_COMMAND", INSERT_ORDERED_LIST_COMMAND);
export const INSERT_UNORDERED_LIST_CMD: Command<void> = $createEditorCommand("INSERT_UNORDERED_LIST_COMMAND", INSERT_UNORDERED_LIST_COMMAND);

export const SELECTION_CHANGE_CMD: Command<void> = $createEditorCommand("SELECTION_CHANGE_COMMAND", SELECTION_CHANGE_COMMAND);
export const SELECTION_INSERT_CLIPBOARD_NODES_CMD: Command<{ nodes: Array<LexicalNode>; selection: BaseSelection; }> = $createEditorCommand("SELECTION_INSERT_CLIPBOARD_NODES_COMMAND", SELECTION_INSERT_CLIPBOARD_NODES_COMMAND);
export const CLICK_CMD: Command<MouseEvent> = $createEditorCommand("CLICK_COMMAND", CLICK_COMMAND);
export const DELETE_CHARACTER_CMD: Command<boolean> = $createEditorCommand("DELETE_CHARACTER_COMMAND", DELETE_CHARACTER_COMMAND);
export const INSERT_LINE_BREAK_CMD: Command<boolean> = $createEditorCommand("INSERT_LINE_BREAK_COMMAND", INSERT_LINE_BREAK_COMMAND);
export const INSERT_PARAGRAPH_CMD: Command<void> = $createEditorCommand("INSERT_PARAGRAPH_COMMAND", INSERT_PARAGRAPH_COMMAND);
export const CONTROLLED_TEXT_INSERTION_CMD: Command<InputEvent | string> = $createEditorCommand("CONTROLLED_TEXT_INSERTION_COMMAND", CONTROLLED_TEXT_INSERTION_COMMAND);
export const PASTE_CMD: Command<PasteCommandType> = $createEditorCommand("PASTE_COMMAND", PASTE_COMMAND);
export const REMOVE_TEXT_CMD: Command<InputEvent | null> = $createEditorCommand("REMOVE_TEXT_COMMAND", REMOVE_TEXT_COMMAND);
export const DELETE_WORD_CMD: Command<boolean> = $createEditorCommand("DELETE_WORD_COMMAND", DELETE_WORD_COMMAND);
export const DELETE_LINE_CMD: Command<boolean> = $createEditorCommand("DELETE_LINE_COMMAND", DELETE_LINE_COMMAND);
export const FORMAT_TEXT_CMD: Command<TextFormatType> = $createEditorCommand("FORMAT_TEXT_COMMAND", FORMAT_TEXT_COMMAND);
export const UNDO_CMD: Command<void> = $createEditorCommand("UNDO_COMMAND", UNDO_COMMAND);
export const REDO_CMD: Command<void> = $createEditorCommand("REDO_COMMAND", REDO_COMMAND);
export const KEY_DOWN_CMD: Command<KeyboardEvent> = $createEditorCommand("KEYDOWN_COMMAND", KEY_DOWN_COMMAND);
export const KEY_ARROW_RIGHT_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_ARROW_RIGHT_COMMAND", KEY_ARROW_RIGHT_COMMAND);
export const MOVE_TO_END_CMD: Command<KeyboardEvent> = $createEditorCommand("MOVE_TO_END", MOVE_TO_END);
export const KEY_ARROW_LEFT_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_ARROW_LEFT_COMMAND", KEY_ARROW_LEFT_COMMAND);
export const MOVE_TO_START_CMD: Command<KeyboardEvent> = $createEditorCommand("MOVE_TO_START", MOVE_TO_START);
export const KEY_ARROW_UP_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_ARROW_UP_COMMAND", KEY_ARROW_UP_COMMAND);
export const KEY_ARROW_DOWN_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_ARROW_DOWN_COMMAND", KEY_ARROW_DOWN_COMMAND);
export const KEY_ENTER_CMD: Command<KeyboardEvent | null> = $createEditorCommand("KEY_ENTER_COMMAND", KEY_ENTER_COMMAND);
export const KEY_SPACE_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_SPACE_COMMAND", KEY_SPACE_COMMAND);
export const KEY_BACKSPACE_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_BACKSPACE_COMMAND", KEY_BACKSPACE_COMMAND);
export const KEY_ESCAPE_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_ESCAPE_COMMAND", KEY_ESCAPE_COMMAND);
export const KEY_DELETE_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_DELETE_COMMAND", KEY_DELETE_COMMAND);
export const KEY_TAB_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_TAB_COMMAND", KEY_TAB_COMMAND);
export const INSERT_TAB_CMD: Command<void> = $createEditorCommand("INSERT_TAB_COMMAND", INSERT_TAB_COMMAND);
export const INDENT_CONTENT_CMD: Command<void> = $createEditorCommand("INDENT_CONTENT_COMMAND", INDENT_CONTENT_COMMAND);
export const OUTDENT_CONTENT_CMD: Command<void> = $createEditorCommand("OUTDENT_CONTENT_COMMAND", OUTDENT_CONTENT_COMMAND);
export const DROP_CMD: Command<DragEvent> = $createEditorCommand("DROP_COMMAND", DROP_COMMAND);
export const FORMAT_ELEMENT_CMD: Command<ElementFormatType> = $createEditorCommand("FORMAT_ELEMENT_COMMAND", FORMAT_ELEMENT_COMMAND);
export const DRAGSTART_CMD: Command<DragEvent> = $createEditorCommand("DRAGSTART_COMMAND", DRAGSTART_COMMAND);
export const DRAGOVER_CMD: Command<DragEvent> = $createEditorCommand("DRAGOVER_COMMAND", DRAGOVER_COMMAND);
export const DRAGEND_CMD: Command<DragEvent> = $createEditorCommand("DRAGEND_COMMAND", DRAGEND_COMMAND);
export const COPY_CMD: Command<ClipboardEvent | KeyboardEvent | null> = $createEditorCommand("COPY_COMMAND", COPY_COMMAND);
export const CUT_CMD: Command<ClipboardEvent | KeyboardEvent | null> = $createEditorCommand("CUT_COMMAND", CUT_COMMAND);
export const SELECT_ALL_CMD: Command<KeyboardEvent> = $createEditorCommand("SELECT_ALL_COMMAND", SELECT_ALL_COMMAND);
export const CLEAR_EDITOR_CMD: Command<void> = $createEditorCommand("CLEAR_EDITOR_COMMAND", CLEAR_EDITOR_COMMAND);
export const CLEAR_HISTORY_CMD: Command<void> = $createEditorCommand("CLEAR_HISTORY_COMMAND", CLEAR_HISTORY_COMMAND);
export const CAN_REDO_CMD: Command<boolean> = $createEditorCommand("CAN_REDO_COMMAND", CAN_REDO_COMMAND);
export const CAN_UNDO_CMD: Command<boolean> = $createEditorCommand("CAN_UNDO_COMMAND", CAN_UNDO_COMMAND);
export const FOCUS_CMD: Command<FocusEvent> = $createEditorCommand("FOCUS_COMMAND", FOCUS_COMMAND);
export const BLUR_CMD: Command<FocusEvent> = $createEditorCommand("BLUR_COMMAND", BLUR_COMMAND);
export const KEY_MODIFIER_CMD: Command<KeyboardEvent> = $createEditorCommand("KEY_MODIFIER_COMMAND", KEY_MODIFIER_COMMAND);

export const SELECT_ALL_ACTION = $createAction<KeyboardEvent>( "SELECT_ALL_ACTION", EDITOR_ACTION_SCOPE, SELECT_ALL_CMD, new KeyboardEvent("keydown"), new Shortcut('a', SpecialKey.Ctrl, SpecialKey.Meta), "Select All");

export const ALIGN_LEFT_ACTION = $createAction<ElementFormatType>( "ALIGN_LEFT_ACTION", EDITOR_ACTION_SCOPE, FORMAT_ELEMENT_CMD, "left", new Shortcut('a', SpecialKey.Alt), "Align Left");
export const ALIGN_CENTER_ACTION = $createAction<ElementFormatType>( "ALIGN_CENTER_ACTION", EDITOR_ACTION_SCOPE, FORMAT_ELEMENT_CMD, "center", new Shortcut('s', SpecialKey.Alt), "Align Center");
export const ALIGN_RIGHT_ACTION = $createAction<ElementFormatType>( "ALIGN_RIGHT_ACTION", EDITOR_ACTION_SCOPE, FORMAT_ELEMENT_CMD, "right", new Shortcut('d', SpecialKey.Alt), "Align Right");
export const ALIGN_JUSTIFY_ACTION = $createAction<ElementFormatType>( "ALIGN_JUSTIFY_ACTION", EDITOR_ACTION_SCOPE, FORMAT_ELEMENT_CMD, "justify", new Shortcut('f', SpecialKey.Alt), "Align Justify");

export const INSERT_UNORDERED_LIST_ACTION = $createAction<void>( "INSERT_UNORDERED_LIST_ACTION", EDITOR_ACTION_SCOPE, INSERT_UNORDERED_LIST_CMD, undefined, new Shortcut('i', SpecialKey.Ctrl | SpecialKey.Shift, SpecialKey.Meta | SpecialKey.Shift), "Insert Inordered List");
export const INSERT_ORDERED_LIST_ACTION = $createAction<void>( "INSERT_ORDERED_LIST_ACTION", EDITOR_ACTION_SCOPE, INSERT_ORDERED_LIST_CMD, undefined, new Shortcut('o', SpecialKey.Ctrl | SpecialKey.Shift, SpecialKey.Meta | SpecialKey.Shift), "Insert Ordered List");

export const INSERT_HORIZONTAL_RULE_ACTION = $createAction<void>( "INSERT_HORIZONTAL_RULE_ACTION", EDITOR_ACTION_SCOPE, INSERT_HORIZONTAL_RULE_CMD, undefined, new Shortcut('h', SpecialKey.Ctrl, SpecialKey.Meta), "Horizontal Line");

