/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{useCollaborationContext as t}from"@lexical/react/LexicalCollaborationContext";import{useLexicalComposerContext as e}from"@lexical/react/LexicalComposerContext";import*as o from"react";import{useRef as r,useState as n,useMemo as s,useCallback as c,useEffect as a}from"react";import{mergeRegister as i}from"@lexical/utils";import{createBinding as l,initLocalState as d,syncLexicalUpdateToYjs as m,TOGGLE_CONNECT_COMMAND as u,setLocalStateFocus as f,createUndoManager as p,CONNECTED_COMMAND as g,syncCursorPositions as y,syncYjsChangesToLexical as C}from"@lexical/yjs";import{COMMAND_PRIORITY_EDITOR as h,FOCUS_COMMAND as E,BLUR_COMMAND as v,UNDO_COMMAND as x,REDO_COMMAND as b,CAN_UNDO_COMMAND as k,CAN_REDO_COMMAND as S,$getRoot as D,$createParagraphNode as j,$getSelection as L}from"lexical";import{createPortal as T}from"react-dom";import{UndoManager as w}from"yjs";import{jsx as A}from"react/jsx-runtime";function R(t,e,o,i,f,p,E,v,x,b,k){const S=r(!1),[R,_]=n(i.get(e)),I=s((()=>l(t,o,e,R,i,b)),[t,o,e,i,R,b]),z=c((()=>{o.connect()}),[o]),B=c((()=>{try{o.disconnect()}catch(t){}}),[o]);a((()=>{const{root:r}=I,{awareness:n}=o,s=({status:e})=>{t.dispatchCommand(g,"connected"===e)},c=e=>{E&&e&&r.isEmpty()&&0===r._xmlText._length&&!1===S.current&&function(t,e){t.update((()=>{const o=D();if(o.isEmpty())if(e)switch(typeof e){case"string":{const o=t.parseEditorState(e);t.setEditorState(o,{tag:"history-merge"});break}case"object":t.setEditorState(e,{tag:"history-merge"});break;case"function":t.update((()=>{D().isEmpty()&&e(t)}),{tag:"history-merge"})}else{const e=j();o.append(e);const{activeElement:r}=document;(null!==L()||null!==r&&r===t.getRootElement())&&e.select()}}),{tag:"history-merge"})}(t,x),S.current=!1},a=()=>{y(I,o)},l=(t,e)=>{const r=e.origin;if(r!==I){C(I,o,t,r instanceof w)}};d(o,f,p,document.activeElement===t.getRootElement(),k||{});const u=o=>{!function(t,e){if(t.update((()=>{const t=D();t.clear(),t.select()}),{tag:"skip-collab"}),null==e.cursors)return;const o=e.cursors;if(null==o)return;const r=e.cursorsContainer;if(null==r)return;const n=Array.from(o.values());for(let t=0;t<n.length;t++){const e=n[t].selection;if(e&&null!=e.selections){const o=e.selections;for(let e=0;e<o.length;e++)r.removeChild(o[t])}}}(t,I),_(o),i.set(e,o),S.current=!0};o.on("reload",u),o.on("status",s),o.on("sync",c),n.on("update",a),r.getSharedType().observeDeep(l);const h=t.registerUpdateListener((({prevEditorState:t,editorState:e,dirtyLeaves:r,dirtyElements:n,normalizedNodes:s,tags:c})=>{!1===c.has("skip-collab")&&m(I,o,t,e,n,r,s,c)}));return z(),()=>{!1===S.current&&B(),o.off("sync",c),o.off("status",s),o.off("reload",u),n.off("update",a),r.getSharedType().unobserveDeep(l),i.delete(e),h()}}),[I,p,z,B,i,t,e,x,f,o,E,k]);const F=s((()=>T(A("div",{ref:t=>{I.cursorsContainer=t}}),v&&v.current||document.body)),[I,v]);return a((()=>t.registerCommand(u,(t=>{if(void 0!==z&&void 0!==B){t?(console.log("Collaboration connected!"),z()):(console.log("Collaboration disconnected!"),B())}return!0}),h)),[z,B,t]),[F,I]}function _(t,e){const r=s((()=>p(e,e.root.getSharedType())),[e]);a((()=>i(t.registerCommand(x,(()=>(r.undo(),!0)),h),t.registerCommand(b,(()=>(r.redo(),!0)),h))));const n=c((()=>{r.clear()}),[r]);return o.useEffect((()=>{const e=()=>{t.dispatchCommand(k,r.undoStack.length>0),t.dispatchCommand(S,r.redoStack.length>0)};return r.on("stack-item-added",e),r.on("stack-item-popped",e),r.on("stack-cleared",e),()=>{r.off("stack-item-added",e),r.off("stack-item-popped",e),r.off("stack-cleared",e)}}),[t,r]),n}function I({id:o,providerFactory:r,shouldBootstrap:n,username:c,cursorColor:l,cursorsContainerRef:d,initialEditorState:m,excludedProperties:u,awarenessData:p}){const g=t(c,l),{yjsDocMap:y,name:C,color:x}=g,[b]=e();a((()=>(g.isCollabActive=!0,()=>{null==b._parentEditor&&(g.isCollabActive=!1)})),[g,b]);const k=s((()=>r(o,y)),[o,r,y]),[S,D]=R(b,o,k,y,C,x,n,d,m,u,p);return g.clientID=D.clientID,_(b,D),function(t,e,o,r,n){a((()=>i(t.registerCommand(E,(()=>(f(e,o,r,!0,n||{}),!1)),h),t.registerCommand(v,(()=>(f(e,o,r,!1,n||{}),!1)),h))),[r,t,o,e,n])}(b,k,C,x,p),S}export{I as CollaborationPlugin};
