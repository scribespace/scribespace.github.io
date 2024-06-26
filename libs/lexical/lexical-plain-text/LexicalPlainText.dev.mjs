/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $insertDataTransferForPlainText, $getHtmlContent } from '@lexical/clipboard';
import { $shouldOverrideDefaultCharacterSelection, $moveCharacter } from '@lexical/selection';
import { mergeRegister, objectKlassEquals } from '@lexical/utils';
import { DELETE_CHARACTER_COMMAND, $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, DELETE_WORD_COMMAND, DELETE_LINE_COMMAND, CONTROLLED_TEXT_INSERTION_COMMAND, REMOVE_TEXT_COMMAND, INSERT_LINE_BREAK_COMMAND, INSERT_PARAGRAPH_COMMAND, KEY_ARROW_LEFT_COMMAND, KEY_ARROW_RIGHT_COMMAND, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND, KEY_ENTER_COMMAND, SELECT_ALL_COMMAND, $selectAll, COPY_COMMAND, CUT_COMMAND, PASTE_COMMAND, DROP_COMMAND, DRAGSTART_COMMAND } from 'lexical';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const CAN_USE_DOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const documentMode = CAN_USE_DOM && 'documentMode' in document ? document.documentMode : null;
const CAN_USE_BEFORE_INPUT = CAN_USE_DOM && 'InputEvent' in window && !documentMode ? 'getTargetRanges' in new window.InputEvent('input') : false;
const IS_SAFARI = CAN_USE_DOM && /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
const IS_IOS = CAN_USE_DOM && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Keep these in case we need to use them in the future.
// export const IS_WINDOWS: boolean = CAN_USE_DOM && /Win/.test(navigator.platform);
const IS_CHROME = CAN_USE_DOM && /^(?=.*Chrome).*/i.test(navigator.userAgent);
const IS_APPLE_WEBKIT = CAN_USE_DOM && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !IS_CHROME;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function onCopyForPlainText(event, editor) {
  editor.update(() => {
    if (event !== null) {
      const clipboardData = objectKlassEquals(event, KeyboardEvent) ? null : event.clipboardData;
      const selection = $getSelection();
      if (selection !== null && clipboardData != null) {
        event.preventDefault();
        const htmlString = $getHtmlContent(editor);
        if (htmlString !== null) {
          clipboardData.setData('text/html', htmlString);
        }
        clipboardData.setData('text/plain', selection.getTextContent());
      }
    }
  });
}
function onPasteForPlainText(event, editor) {
  event.preventDefault();
  editor.update(() => {
    const selection = $getSelection();
    const {
      clipboardData
    } = event;
    if (clipboardData != null && $isRangeSelection(selection)) {
      $insertDataTransferForPlainText(clipboardData, selection);
    }
  }, {
    tag: 'paste'
  });
}
function onCutForPlainText(event, editor) {
  onCopyForPlainText(event, editor);
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.removeText();
    }
  });
}
function registerPlainText(editor) {
  const removeListener = mergeRegister(editor.registerCommand(DELETE_CHARACTER_COMMAND, isBackward => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    selection.deleteCharacter(isBackward);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(DELETE_WORD_COMMAND, isBackward => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    selection.deleteWord(isBackward);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(DELETE_LINE_COMMAND, isBackward => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    selection.deleteLine(isBackward);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(CONTROLLED_TEXT_INSERTION_COMMAND, eventOrText => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    if (typeof eventOrText === 'string') {
      selection.insertText(eventOrText);
    } else {
      const dataTransfer = eventOrText.dataTransfer;
      if (dataTransfer != null) {
        $insertDataTransferForPlainText(dataTransfer, selection);
      } else {
        const data = eventOrText.data;
        if (data) {
          selection.insertText(data);
        }
      }
    }
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(REMOVE_TEXT_COMMAND, () => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    selection.removeText();
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(INSERT_LINE_BREAK_COMMAND, selectStart => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    selection.insertLineBreak(selectStart);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(INSERT_PARAGRAPH_COMMAND, () => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    selection.insertLineBreak();
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(KEY_ARROW_LEFT_COMMAND, payload => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    const event = payload;
    const isHoldingShift = event.shiftKey;
    if ($shouldOverrideDefaultCharacterSelection(selection, true)) {
      event.preventDefault();
      $moveCharacter(selection, isHoldingShift, true);
      return true;
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, payload => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    const event = payload;
    const isHoldingShift = event.shiftKey;
    if ($shouldOverrideDefaultCharacterSelection(selection, false)) {
      event.preventDefault();
      $moveCharacter(selection, isHoldingShift, false);
      return true;
    }
    return false;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(KEY_BACKSPACE_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    event.preventDefault();
    return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true);
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(KEY_DELETE_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    event.preventDefault();
    return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, false);
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(KEY_ENTER_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    if (event !== null) {
      // If we have beforeinput, then we can avoid blocking
      // the default behavior. This ensures that the iOS can
      // intercept that we're actually inserting a paragraph,
      // and autocomplete, autocapitalize etc work as intended.
      // This can also cause a strange performance issue in
      // Safari, where there is a noticeable pause due to
      // preventing the key down of enter.
      if ((IS_IOS || IS_SAFARI || IS_APPLE_WEBKIT) && CAN_USE_BEFORE_INPUT) {
        return false;
      }
      event.preventDefault();
    }
    return editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(SELECT_ALL_COMMAND, () => {
    $selectAll();
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(COPY_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    onCopyForPlainText(event, editor);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(CUT_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    onCutForPlainText(event, editor);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(PASTE_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    onPasteForPlainText(event, editor);
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(DROP_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }

    // TODO: Make drag and drop work at some point.
    event.preventDefault();
    return true;
  }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(DRAGSTART_COMMAND, event => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }

    // TODO: Make drag and drop work at some point.
    event.preventDefault();
    return true;
  }, COMMAND_PRIORITY_EDITOR));
  return removeListener;
}

export { registerPlainText };
