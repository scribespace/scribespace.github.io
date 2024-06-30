/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{useCollaborationContext as e}from"@lexical/react/LexicalCollaborationContext";import{LexicalComposerContext as t,createLexicalComposerContext as r}from"@lexical/react/LexicalComposerContext";import{useRef as o,useContext as n,useMemo as l,useEffect as i}from"react";import{jsx as a}from"react/jsx-runtime";function s(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var c=s((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function p(e){const t=e.transform();return null!==t?new Set([t]):new Set}function d({initialEditor:s,children:d,initialNodes:f,initialTheme:u,skipCollabChecks:m}){const h=o(!1),x=n(t);null==x&&c(94);const[_,{getTheme:g}]=x,v=l((()=>{const e=u||g()||void 0,t=r(x,e);if(void 0!==e&&(s._config.theme=e),s._parentEditor=_,f)for(let e of f){let t=null,r=null;if("function"!=typeof e){const o=e;e=o.replace,t=o.with,r=o.withKlass||null}const o=s._nodes.get(e.getType());s._nodes.set(e.getType(),{exportDOM:o?o.exportDOM:void 0,klass:e,replace:t,replaceWithKlass:r,transforms:p(e)})}else{const e=s._nodes=new Map(_._nodes);for(const[t,r]of e)s._nodes.set(t,{exportDOM:r.exportDOM,klass:r.klass,replace:r.replace,replaceWithKlass:r.replaceWithKlass,transforms:p(r.klass)})}return s._config.namespace=_._config.namespace,s._editable=_._editable,[s,t]}),[]),{isCollabActive:w,yjsDocMap:b}=e(),M=m||h.current||b.has(s.getKey());return i((()=>{M&&(h.current=!0)}),[M]),i((()=>_.registerEditableListener((e=>{s.setEditable(e)}))),[s,_]),a(t.Provider,{value:v,children:!w||M?d:null})}export{d as LexicalNestedComposer};
