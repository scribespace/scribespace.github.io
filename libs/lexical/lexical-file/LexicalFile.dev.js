/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var lexical = require('lexical');

var version = "0.15.0";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Generates a SerializedDocument from the given EditorState
 * @param editorState - the EditorState to serialize
 * @param config - An object that optionally contains source and lastSaved.
 * source defaults to Lexical and lastSaved defaults to the current time in
 * epoch milliseconds.
 */
function serializedDocumentFromEditorState(editorState, config = Object.freeze({})) {
  return {
    editorState: editorState.toJSON(),
    lastSaved: config.lastSaved || Date.now(),
    source: config.source || 'Lexical',
    version
  };
}

/**
 * Parse an EditorState from the given editor and document
 *
 * @param editor - The lexical editor
 * @param maybeStringifiedDocument - The contents of a .lexical file (as a JSON string, or already parsed)
 */
function editorStateFromSerializedDocument(editor, maybeStringifiedDocument) {
  const json = typeof maybeStringifiedDocument === 'string' ? JSON.parse(maybeStringifiedDocument) : maybeStringifiedDocument;
  return editor.parseEditorState(json.editorState);
}

/**
 * Takes a file and inputs its content into the editor state as an input field.
 * @param editor - The lexical editor.
 */
function importFile(editor) {
  readTextFileFromSystem(text => {
    editor.setEditorState(editorStateFromSerializedDocument(editor, text));
    editor.dispatchCommand(lexical.CLEAR_HISTORY_COMMAND, undefined);
  });
}
function readTextFileFromSystem(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.lexical';
  input.addEventListener('change', event => {
    const target = event.target;
    if (target.files) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        if (readerEvent.target) {
          const content = readerEvent.target.result;
          callback(content);
        }
      };
    }
  });
  input.click();
}

/**
 * Generates a .lexical file to be downloaded by the browser containing the current editor state.
 * @param editor - The lexical editor.
 * @param config - An object that optionally contains fileName and source. fileName defaults to
 * the current date (as a string) and source defaults to Lexical.
 */
function exportFile(editor, config = Object.freeze({})) {
  const now = new Date();
  const serializedDocument = serializedDocumentFromEditorState(editor.getEditorState(), {
    ...config,
    lastSaved: now.getTime()
  });
  const fileName = config.fileName || now.toISOString();
  exportBlob(serializedDocument, `${fileName}.lexical`);
}

// Adapted from https://stackoverflow.com/a/19328891/2013580
function exportBlob(data, fileName) {
  const a = document.createElement('a');
  const body = document.body;
  if (body === null) {
    return;
  }
  body.appendChild(a);
  a.style.display = 'none';
  const json = JSON.stringify(data);
  const blob = new Blob([json], {
    type: 'octet/stream'
  });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

exports.editorStateFromSerializedDocument = editorStateFromSerializedDocument;
exports.exportFile = exportFile;
exports.importFile = importFile;
exports.serializedDocumentFromEditorState = serializedDocumentFromEditorState;
