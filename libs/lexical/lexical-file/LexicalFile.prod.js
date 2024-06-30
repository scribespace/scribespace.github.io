/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var e=require("lexical");function f(a,b=Object.freeze({})){return{editorState:a.toJSON(),lastSaved:b.lastSaved||Date.now(),source:b.source||"Lexical",version:"0.16.0"}}function h(a,b){b="string"===typeof b?JSON.parse(b):b;return a.parseEditorState(b.editorState)}
function k(a){let b=document.createElement("input");b.type="file";b.accept=".lexical";b.addEventListener("change",c=>{c=c.target;if(c.files){c=c.files[0];let d=new FileReader;d.readAsText(c,"UTF-8");d.onload=g=>{g.target&&a(g.target.result)}}});b.click()}exports.editorStateFromSerializedDocument=h;
exports.exportFile=function(a,b=Object.freeze({})){var c=new Date;a=f(a.getEditorState(),{...b,lastSaved:c.getTime()});{b=`${b.fileName||c.toISOString()}.lexical`;c=document.createElement("a");let d=document.body;null!==d&&(d.appendChild(c),c.style.display="none",a=JSON.stringify(a),a=new Blob([a],{type:"octet/stream"}),a=window.URL.createObjectURL(a),c.href=a,c.download=b,c.click(),window.URL.revokeObjectURL(a),c.remove())}};
exports.importFile=function(a){k(b=>{a.setEditorState(h(a,b));a.dispatchCommand(e.CLEAR_HISTORY_COMMAND,void 0)})};exports.serializedDocumentFromEditorState=f
