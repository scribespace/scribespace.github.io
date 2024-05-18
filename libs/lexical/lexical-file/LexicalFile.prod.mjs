/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{CLEAR_HISTORY_COMMAND as e}from"lexical";var t="0.15.0";function n(e,n=Object.freeze({})){return{editorState:e.toJSON(),lastSaved:n.lastSaved||Date.now(),source:n.source||"Lexical",version:t}}function o(e,t){const n="string"==typeof t?JSON.parse(t):t;return e.parseEditorState(n.editorState)}function a(t){!function(e){const t=document.createElement("input");t.type="file",t.accept=".lexical",t.addEventListener("change",(t=>{const n=t.target;if(n.files){const t=n.files[0],o=new FileReader;o.readAsText(t,"UTF-8"),o.onload=t=>{if(t.target){const n=t.target.result;e(n)}}}})),t.click()}((n=>{t.setEditorState(o(t,n)),t.dispatchCommand(e,void 0)}))}function i(e,t=Object.freeze({})){const o=new Date;!function(e,t){const n=document.createElement("a"),o=document.body;if(null===o)return;o.appendChild(n),n.style.display="none";const a=JSON.stringify(e),i=new Blob([a],{type:"octet/stream"}),c=window.URL.createObjectURL(i);n.href=c,n.download=t,n.click(),window.URL.revokeObjectURL(c),n.remove()}(n(e.getEditorState(),{...t,lastSaved:o.getTime()}),`${t.fileName||o.toISOString()}.lexical`)}export{o as editorStateFromSerializedDocument,i as exportFile,a as importFile,n as serializedDocumentFromEditorState};
