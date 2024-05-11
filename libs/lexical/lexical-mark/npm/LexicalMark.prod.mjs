/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{ElementNode as t,$isRangeSelection as e,$applyNodeReplacement as n,$isElementNode as r,$isTextNode as i}from"lexical";import{addClassNamesToElement as s,removeClassNamesFromElement as o}from"@lexical/utils";class l extends t{static getType(){return"mark"}static clone(t){return new l(Array.from(t.__ids),t.__key)}static importDOM(){return null}static importJSON(t){const e=c(t.ids);return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}exportJSON(){return{...super.exportJSON(),ids:this.getIDs(),type:"mark",version:1}}constructor(t,e){super(e),this.__ids=t||[]}createDOM(t){const e=document.createElement("mark");return s(e,t.theme.mark),this.__ids.length>1&&s(e,t.theme.markOverlap),e}updateDOM(t,e,n){const r=t.__ids,i=this.__ids,l=r.length,c=i.length,f=n.theme.markOverlap;return l!==c&&(1===l?2===c&&s(e,f):1===c&&o(e,f)),!1}hasID(t){const e=this.getIDs();for(let n=0;n<e.length;n++)if(t===e[n])return!0;return!1}getIDs(){const t=this.getLatest();return f(t)?t.__ids:[]}addID(t){const e=this.getWritable();if(f(e)){const n=e.__ids;e.__ids=n;for(let e=0;e<n.length;e++)if(t===n[e])return;n.push(t)}}deleteID(t){const e=this.getWritable();if(f(e)){const n=e.__ids;e.__ids=n;for(let e=0;e<n.length;e++)if(t===n[e])return void n.splice(e,1)}}insertNewAfter(t,e=!0){const n=c(this.__ids);return this.insertAfter(n,e),n}canInsertTextBefore(){return!1}canInsertTextAfter(){return!1}canBeEmpty(){return!1}isInline(){return!0}extractWithChild(t,n,r){if(!e(n)||"html"===r)return!1;const i=n.anchor,s=n.focus,o=i.getNode(),l=s.getNode(),c=n.isBackward()?i.offset-s.offset:s.offset-i.offset;return this.isParentOf(o)&&this.isParentOf(l)&&this.getTextContent().length===c}excludeFromCopy(t){return"clone"!==t}}function c(t){return n(new l(t))}function f(t){return t instanceof l}function u(t){const e=t.getChildren();let n=null;for(let r=0;r<e.length;r++){const i=e[r];null===n?t.insertBefore(i):n.insertAfter(i),n=i}t.remove()}function a(t,e,n,s){const o=t.getNodes(),l=t.anchor.offset,u=t.focus.offset,a=o.length,d=e?u:l,h=e?l:u;let g,m;for(let t=0;t<a;t++){const e=o[t];if(r(m)&&m.isParentOf(e))continue;const l=0===t,u=t===a-1;let _=null;if(i(e)){const t=e.getTextContentSize(),n=l?d:0,r=u?h:t;if(0===n&&0===r)continue;const i=e.splitText(n,r);_=i.length>1&&(3===i.length||l&&!u||r===t)?i[1]:i[0]}else{if(f(e))continue;r(e)&&e.isInline()&&(_=e)}if(null!==_){if(_&&_.is(g))continue;const t=_.getParent();if(null!=t&&t.is(g)||(m=void 0),g=t,void 0===m){m=(s||c)([n]),_.insertBefore(m)}m.append(_)}else g=void 0,m=void 0}r(m)&&(e?m.selectStart():m.selectEnd())}function d(t,e){let n=t;for(;null!==n;){if(f(n))return n.getIDs();if(i(n)&&e===n.getTextContentSize()){const t=n.getNextSibling();if(f(t))return t.getIDs()}n=n.getParent()}return null}export{c as $createMarkNode,d as $getMarkIDs,f as $isMarkNode,u as $unwrapMarkNode,a as $wrapSelectionInMarkNode,l as MarkNode};
