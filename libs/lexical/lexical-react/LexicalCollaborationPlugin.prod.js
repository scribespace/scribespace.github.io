/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var e=require("@lexical/react/LexicalCollaborationContext"),g=require("@lexical/react/LexicalComposerContext"),k=require("react"),B=require("@lexical/utils"),C=require("@lexical/yjs"),D=require("lexical"),L=require("react-dom"),M=require("yjs"),N=require("react/jsx-runtime"),O=Object.create(null);if(k)for(var P in k)O[P]=k[P];O.default=k;
function Q(b,c,a,d,f,z,A,v,w,n,t){let q=k.useRef(!1),[x,r]=k.useState(d.get(c)),h=k.useMemo(()=>C.createBinding(b,a,c,x,d,n),[b,a,c,d,x,n]),p=k.useCallback(()=>{a.connect()},[a]),y=k.useCallback(()=>{try{a.disconnect()}catch(m){}},[a]);k.useEffect(()=>{let {root:m}=h,{awareness:E}=a,F=({status:l})=>{b.dispatchCommand(C.CONNECTED_COMMAND,"connected"===l)},G=l=>{A&&l&&m.isEmpty()&&0===m._xmlText._length&&!1===q.current&&R(b,w);q.current=!1},H=()=>{C.syncCursorPositions(h,a)},I=(l,u)=>{u=u.origin;u!==
h&&C.syncYjsChangesToLexical(h,a,l,u instanceof M.UndoManager)};C.initLocalState(a,f,z,document.activeElement===b.getRootElement(),t||{});let J=l=>{S(b,h);r(l);d.set(c,l);q.current=!0};a.on("reload",J);a.on("status",F);a.on("sync",G);E.on("update",H);m.getSharedType().observeDeep(I);let W=b.registerUpdateListener(({prevEditorState:l,editorState:u,dirtyLeaves:T,dirtyElements:U,normalizedNodes:V,tags:K})=>{!1===K.has("skip-collab")&&C.syncLexicalUpdateToYjs(h,a,l,u,U,T,V,K)});p();return()=>{!1===q.current&&
y();a.off("sync",G);a.off("status",F);a.off("reload",J);E.off("update",H);m.getSharedType().unobserveDeep(I);d.delete(c);W()}},[h,z,p,y,d,b,c,w,f,a,A,t]);let X=k.useMemo(()=>L.createPortal(N.jsx("div",{ref:m=>{h.cursorsContainer=m}}),v&&v.current||document.body),[h,v]);k.useEffect(()=>b.registerCommand(C.TOGGLE_CONNECT_COMMAND,m=>{void 0!==p&&void 0!==y&&(m?(console.log("Collaboration connected!"),p()):(console.log("Collaboration disconnected!"),y()));return!0},D.COMMAND_PRIORITY_EDITOR),[p,y,b]);
return[X,h]}function Y(b,c,a,d,f){k.useEffect(()=>B.mergeRegister(b.registerCommand(D.FOCUS_COMMAND,()=>{C.setLocalStateFocus(c,a,d,!0,f||{});return!1},D.COMMAND_PRIORITY_EDITOR),b.registerCommand(D.BLUR_COMMAND,()=>{C.setLocalStateFocus(c,a,d,!1,f||{});return!1},D.COMMAND_PRIORITY_EDITOR)),[d,b,a,c,f])}
function Z(b,c){let a=k.useMemo(()=>C.createUndoManager(c,c.root.getSharedType()),[c]);k.useEffect(()=>B.mergeRegister(b.registerCommand(D.UNDO_COMMAND,()=>{a.undo();return!0},D.COMMAND_PRIORITY_EDITOR),b.registerCommand(D.REDO_COMMAND,()=>{a.redo();return!0},D.COMMAND_PRIORITY_EDITOR)));let d=k.useCallback(()=>{a.clear()},[a]);O.useEffect(()=>{let f=()=>{b.dispatchCommand(D.CAN_UNDO_COMMAND,0<a.undoStack.length);b.dispatchCommand(D.CAN_REDO_COMMAND,0<a.redoStack.length)};a.on("stack-item-added",
f);a.on("stack-item-popped",f);a.on("stack-cleared",f);return()=>{a.off("stack-item-added",f);a.off("stack-item-popped",f);a.off("stack-cleared",f)}},[b,a]);return d}
function R(b,c){b.update(()=>{var a=D.$getRoot();if(a.isEmpty())if(c)switch(typeof c){case "string":var d=b.parseEditorState(c);b.setEditorState(d,{tag:"history-merge"});break;case "object":b.setEditorState(c,{tag:"history-merge"});break;case "function":b.update(()=>{D.$getRoot().isEmpty()&&c(b)},{tag:"history-merge"})}else d=D.$createParagraphNode(),a.append(d),{activeElement:a}=document,(null!==D.$getSelection()||null!==a&&a===b.getRootElement())&&d.select()},{tag:"history-merge"})}
function S(b,c){b.update(()=>{let d=D.$getRoot();d.clear();d.select()},{tag:"skip-collab"});if(null!=c.cursors&&(b=c.cursors,null!=b&&(c=c.cursorsContainer,null!=c))){b=Array.from(b.values());for(let d=0;d<b.length;d++){var a=b[d].selection;if(a&&null!=a.selections){a=a.selections;for(let f=0;f<a.length;f++)c.removeChild(a[d])}}}}
exports.CollaborationPlugin=function({id:b,providerFactory:c,shouldBootstrap:a,username:d,cursorColor:f,cursorsContainerRef:z,initialEditorState:A,excludedProperties:v,awarenessData:w}){let n=e.useCollaborationContext(d,f),{yjsDocMap:t,name:q,color:x}=n,[r]=g.useLexicalComposerContext();k.useEffect(()=>{n.isCollabActive=!0;return()=>{null==r._parentEditor&&(n.isCollabActive=!1)}},[n,r]);d=k.useMemo(()=>c(b,t),[b,c,t]);let [h,p]=Q(r,b,d,t,q,x,a,z,A,v,w);n.clientID=p.clientID;Z(r,p);Y(r,d,q,x,w);return h}