/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{useLexicalCommandsLog as e,TreeView as t,generateContent as a}from"@lexical/devtools-core";import{mergeRegister as r}from"@lexical/utils";import*as l from"react";import{useState as i,useEffect as s}from"react";import{jsx as o}from"react/jsx-runtime";function n({treeTypeButtonClassName:n,timeTravelButtonClassName:m,timeTravelPanelSliderClassName:u,timeTravelPanelButtonClassName:c,viewClassName:d,timeTravelPanelClassName:C,editor:N,customPrintNode:f}){const v=l.createRef(),[T,E]=i(N.getEditorState()),p=e(N);s((()=>r(N.registerUpdateListener((({editorState:e})=>{E(e)})),N.registerEditableListener((()=>{E(N.getEditorState())})))),[N]),s((()=>{const e=v.current;if(null!==e)return e.__lexicalEditor=N,()=>{e.__lexicalEditor=null}}),[N,v]);return o(t,{treeTypeButtonClassName:n,timeTravelButtonClassName:m,timeTravelPanelSliderClassName:u,timeTravelPanelButtonClassName:c,viewClassName:d,timeTravelPanelClassName:C,setEditorReadOnly:e=>{const t=N.getRootElement();null!=t&&(t.contentEditable=e?"false":"true")},editorState:T,setEditorState:e=>N.setEditorState(e),generateContent:async function(e){return a(N,p,e,f)},ref:v})}export{n as TreeView};
