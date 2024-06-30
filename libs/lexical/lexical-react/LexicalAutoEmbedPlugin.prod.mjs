/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{$isLinkNode as e,LinkNode as t,AutoLinkNode as n}from"@lexical/link";import{useLexicalComposerContext as o}from"@lexical/react/LexicalComposerContext";import{MenuOption as r,LexicalNodeMenuPlugin as l}from"@lexical/react/LexicalNodeMenuPlugin";import{mergeRegister as i}from"@lexical/utils";import{createCommand as s,$getNodeByKey as a,COMMAND_PRIORITY_EDITOR as c,$getSelection as u,COMMAND_PRIORITY_LOW as m}from"lexical";import{useState as d,useCallback as p,useEffect as f,useMemo as g}from"react";import{jsx as x}from"react/jsx-runtime";const w=/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,y=s("INSERT_EMBED_COMMAND");class C extends r{constructor(e,t){super(e),this.title=e,this.onSelect=t.onSelect.bind(this)}}function _({embedConfigs:r,onOpenEmbedModalForConfig:s,getMenuOptions:w,menuRenderFn:C,menuCommandPriority:_=m}){const[h]=o(),[E,M]=d(null),[S,A]=d(null),P=p((()=>{M(null),A(null)}),[]),b=p((t=>{h.getEditorState().read((async function(){const n=a(t);if(e(n))for(let e=0;e<r.length;e++){const t=r[e];null!=await Promise.resolve(t.parseUrl(n.__url))&&(A(t),M(n.getKey()))}}))}),[h,r]);f((()=>i(...[t,n].map((e=>h.registerMutationListener(e,((...e)=>((e,{updateTags:t,dirtyLeaves:n})=>{for(const[o,r]of e)"created"===r&&t.has("paste")&&n.size<=3?b(o):o===E&&P()})(...e))))))),[b,h,r,E,P]),f((()=>h.registerCommand(y,(e=>{const t=r.find((({type:t})=>t===e));return!!t&&(s(t),!0)}),c)),[h,r,s]);const v=p((async function(){if(null!=S&&null!=E){const t=h.getEditorState().read((()=>{const t=a(E);return e(t)?t:null}));if(e(t)){const e=await Promise.resolve(S.parseUrl(t.__url));null!=e&&h.update((()=>{u()||t.selectEnd(),S.insertNode(h,e),t.isAttached()&&t.remove()}))}}}),[S,h,E]),z=g((()=>null!=S&&null!=E?w(S,v,P):[]),[S,v,w,E,P]),L=p(((e,t,n)=>{h.update((()=>{e.onSelect(t),n()}))}),[h]);return null!=E?x(l,{nodeKey:E,onClose:P,onSelectOption:L,options:z,menuRenderFn:C,commandPriority:_}):null}export{C as AutoEmbedOption,y as INSERT_EMBED_COMMAND,_ as LexicalAutoEmbedPlugin,w as URL_MATCHER};
