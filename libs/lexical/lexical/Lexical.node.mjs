/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (process.env.NODE_ENV === 'development' ? import('./Lexical.dev.mjs') : import('./Lexical.prod.mjs'));
export const $addUpdateTag = mod.$addUpdateTag;
export const $applyNodeReplacement = mod.$applyNodeReplacement;
export const $copyNode = mod.$copyNode;
export const $createLineBreakNode = mod.$createLineBreakNode;
export const $createNodeSelection = mod.$createNodeSelection;
export const $createParagraphNode = mod.$createParagraphNode;
export const $createPoint = mod.$createPoint;
export const $createRangeSelection = mod.$createRangeSelection;
export const $createRangeSelectionFromDom = mod.$createRangeSelectionFromDom;
export const $createTabNode = mod.$createTabNode;
export const $createTextNode = mod.$createTextNode;
export const $getAdjacentNode = mod.$getAdjacentNode;
export const $getCharacterOffsets = mod.$getCharacterOffsets;
export const $getEditor = mod.$getEditor;
export const $getNearestNodeFromDOMNode = mod.$getNearestNodeFromDOMNode;
export const $getNearestRootOrShadowRoot = mod.$getNearestRootOrShadowRoot;
export const $getNodeByKey = mod.$getNodeByKey;
export const $getNodeByKeyOrThrow = mod.$getNodeByKeyOrThrow;
export const $getPreviousSelection = mod.$getPreviousSelection;
export const $getRoot = mod.$getRoot;
export const $getSelection = mod.$getSelection;
export const $getTextContent = mod.$getTextContent;
export const $hasAncestor = mod.$hasAncestor;
export const $hasUpdateTag = mod.$hasUpdateTag;
export const $insertNodes = mod.$insertNodes;
export const $isBlockElementNode = mod.$isBlockElementNode;
export const $isDecoratorNode = mod.$isDecoratorNode;
export const $isElementNode = mod.$isElementNode;
export const $isInlineElementOrDecoratorNode = mod.$isInlineElementOrDecoratorNode;
export const $isLeafNode = mod.$isLeafNode;
export const $isLineBreakNode = mod.$isLineBreakNode;
export const $isNodeSelection = mod.$isNodeSelection;
export const $isParagraphNode = mod.$isParagraphNode;
export const $isRangeSelection = mod.$isRangeSelection;
export const $isRootNode = mod.$isRootNode;
export const $isRootOrShadowRoot = mod.$isRootOrShadowRoot;
export const $isTabNode = mod.$isTabNode;
export const $isTextNode = mod.$isTextNode;
export const $nodesOfType = mod.$nodesOfType;
export const $normalizeSelection__EXPERIMENTAL = mod.$normalizeSelection__EXPERIMENTAL;
export const $parseSerializedNode = mod.$parseSerializedNode;
export const $selectAll = mod.$selectAll;
export const $setCompositionKey = mod.$setCompositionKey;
export const $setSelection = mod.$setSelection;
export const $splitNode = mod.$splitNode;
export const ArtificialNode__DO_NOT_USE = mod.ArtificialNode__DO_NOT_USE;
export const BLUR_COMMAND = mod.BLUR_COMMAND;
export const CAN_REDO_COMMAND = mod.CAN_REDO_COMMAND;
export const CAN_UNDO_COMMAND = mod.CAN_UNDO_COMMAND;
export const CLEAR_EDITOR_COMMAND = mod.CLEAR_EDITOR_COMMAND;
export const CLEAR_HISTORY_COMMAND = mod.CLEAR_HISTORY_COMMAND;
export const CLICK_COMMAND = mod.CLICK_COMMAND;
export const COMMAND_PRIORITY_CRITICAL = mod.COMMAND_PRIORITY_CRITICAL;
export const COMMAND_PRIORITY_EDITOR = mod.COMMAND_PRIORITY_EDITOR;
export const COMMAND_PRIORITY_HIGH = mod.COMMAND_PRIORITY_HIGH;
export const COMMAND_PRIORITY_LOW = mod.COMMAND_PRIORITY_LOW;
export const COMMAND_PRIORITY_NORMAL = mod.COMMAND_PRIORITY_NORMAL;
export const CONTROLLED_TEXT_INSERTION_COMMAND = mod.CONTROLLED_TEXT_INSERTION_COMMAND;
export const COPY_COMMAND = mod.COPY_COMMAND;
export const CUT_COMMAND = mod.CUT_COMMAND;
export const DELETE_CHARACTER_COMMAND = mod.DELETE_CHARACTER_COMMAND;
export const DELETE_LINE_COMMAND = mod.DELETE_LINE_COMMAND;
export const DELETE_WORD_COMMAND = mod.DELETE_WORD_COMMAND;
export const DRAGEND_COMMAND = mod.DRAGEND_COMMAND;
export const DRAGOVER_COMMAND = mod.DRAGOVER_COMMAND;
export const DRAGSTART_COMMAND = mod.DRAGSTART_COMMAND;
export const DROP_COMMAND = mod.DROP_COMMAND;
export const DecoratorNode = mod.DecoratorNode;
export const ElementNode = mod.ElementNode;
export const FOCUS_COMMAND = mod.FOCUS_COMMAND;
export const FORMAT_ELEMENT_COMMAND = mod.FORMAT_ELEMENT_COMMAND;
export const FORMAT_TEXT_COMMAND = mod.FORMAT_TEXT_COMMAND;
export const INDENT_CONTENT_COMMAND = mod.INDENT_CONTENT_COMMAND;
export const INSERT_LINE_BREAK_COMMAND = mod.INSERT_LINE_BREAK_COMMAND;
export const INSERT_PARAGRAPH_COMMAND = mod.INSERT_PARAGRAPH_COMMAND;
export const INSERT_TAB_COMMAND = mod.INSERT_TAB_COMMAND;
export const IS_ALL_FORMATTING = mod.IS_ALL_FORMATTING;
export const IS_BOLD = mod.IS_BOLD;
export const IS_CODE = mod.IS_CODE;
export const IS_HIGHLIGHT = mod.IS_HIGHLIGHT;
export const IS_ITALIC = mod.IS_ITALIC;
export const IS_STRIKETHROUGH = mod.IS_STRIKETHROUGH;
export const IS_SUBSCRIPT = mod.IS_SUBSCRIPT;
export const IS_SUPERSCRIPT = mod.IS_SUPERSCRIPT;
export const IS_UNDERLINE = mod.IS_UNDERLINE;
export const KEY_ARROW_DOWN_COMMAND = mod.KEY_ARROW_DOWN_COMMAND;
export const KEY_ARROW_LEFT_COMMAND = mod.KEY_ARROW_LEFT_COMMAND;
export const KEY_ARROW_RIGHT_COMMAND = mod.KEY_ARROW_RIGHT_COMMAND;
export const KEY_ARROW_UP_COMMAND = mod.KEY_ARROW_UP_COMMAND;
export const KEY_BACKSPACE_COMMAND = mod.KEY_BACKSPACE_COMMAND;
export const KEY_DELETE_COMMAND = mod.KEY_DELETE_COMMAND;
export const KEY_DOWN_COMMAND = mod.KEY_DOWN_COMMAND;
export const KEY_ENTER_COMMAND = mod.KEY_ENTER_COMMAND;
export const KEY_ESCAPE_COMMAND = mod.KEY_ESCAPE_COMMAND;
export const KEY_MODIFIER_COMMAND = mod.KEY_MODIFIER_COMMAND;
export const KEY_SPACE_COMMAND = mod.KEY_SPACE_COMMAND;
export const KEY_TAB_COMMAND = mod.KEY_TAB_COMMAND;
export const LineBreakNode = mod.LineBreakNode;
export const MOVE_TO_END = mod.MOVE_TO_END;
export const MOVE_TO_START = mod.MOVE_TO_START;
export const OUTDENT_CONTENT_COMMAND = mod.OUTDENT_CONTENT_COMMAND;
export const PASTE_COMMAND = mod.PASTE_COMMAND;
export const ParagraphNode = mod.ParagraphNode;
export const REDO_COMMAND = mod.REDO_COMMAND;
export const REMOVE_TEXT_COMMAND = mod.REMOVE_TEXT_COMMAND;
export const RootNode = mod.RootNode;
export const SELECTION_CHANGE_COMMAND = mod.SELECTION_CHANGE_COMMAND;
export const SELECTION_INSERT_CLIPBOARD_NODES_COMMAND = mod.SELECTION_INSERT_CLIPBOARD_NODES_COMMAND;
export const SELECT_ALL_COMMAND = mod.SELECT_ALL_COMMAND;
export const TEXT_TYPE_TO_FORMAT = mod.TEXT_TYPE_TO_FORMAT;
export const TabNode = mod.TabNode;
export const TextNode = mod.TextNode;
export const UNDO_COMMAND = mod.UNDO_COMMAND;
export const createCommand = mod.createCommand;
export const createEditor = mod.createEditor;
export const getNearestEditorFromDOMNode = mod.getNearestEditorFromDOMNode;
export const isBlockDomNode = mod.isBlockDomNode;
export const isCurrentlyReadOnlyMode = mod.isCurrentlyReadOnlyMode;
export const isHTMLAnchorElement = mod.isHTMLAnchorElement;
export const isHTMLElement = mod.isHTMLElement;
export const isInlineDomNode = mod.isInlineDomNode;
export const isSelectionCapturedInDecoratorInput = mod.isSelectionCapturedInDecoratorInput;
export const isSelectionWithinEditor = mod.isSelectionWithinEditor;
export const resetRandomKey = mod.resetRandomKey;