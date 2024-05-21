/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{$generateHtmlFromNodes as t,$generateNodesFromDOM as e}from"@lexical/html";import{$addNodeStyle as n,$cloneWithProperties as o,$sliceSelectedTextNodeContent as l}from"@lexical/selection";import{objectKlassEquals as r}from"@lexical/utils";import{$getSelection as i,$isRangeSelection as s,$createTabNode as a,SELECTION_INSERT_CLIPBOARD_NODES_COMMAND as c,$getRoot as u,$parseSerializedNode as d,$isTextNode as f,COPY_COMMAND as p,COMMAND_PRIORITY_CRITICAL as m,isSelectionWithinEditor as h,$isElementNode as g}from"lexical";function x(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var w=x((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const y="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,v=t=>y?(t||window).getSelection():null;function D(e){const n=i();return null==n&&w(75),s(n)&&n.isCollapsed()||0===n.getNodes().length?"":t(e,n)}function C(t){const e=i();return null==e&&w(75),s(e)&&e.isCollapsed()||0===e.getNodes().length?null:JSON.stringify(A(t,e))}function N(t,e){const n=t.getData("text/plain")||t.getData("text/uri-list");null!=n&&e.insertRawText(n)}function _(t,n,o){const l=t.getData("application/x-lexical-editor");if(l)try{const t=JSON.parse(l);if(t.namespace===o._config.namespace&&Array.isArray(t.nodes)){return T(o,R(t.nodes),n)}}catch(t){}const r=t.getData("text/html");if(r)try{const t=(new DOMParser).parseFromString(r,"text/html");return T(o,e(o,t),n)}catch(t){}const c=t.getData("text/plain")||t.getData("text/uri-list");if(null!=c)if(s(n)){const t=c.split(/(\r?\n|\t)/);""===t[t.length-1]&&t.pop();for(let e=0;e<t.length;e++){const n=i();if(s(n)){const o=t[e];"\n"===o||"\r\n"===o?n.insertParagraph():"\t"===o?n.insertNodes([a()]):n.insertText(o)}}}else n.insertRawText(c)}function T(t,e,n){t.dispatchCommand(c,{nodes:e,selection:n})||n.insertNodes(e)}function S(t,e,n,r=[]){let i=null===e||n.isSelected(e);const s=g(n)&&n.excludeFromCopy("html");let a=n;if(null!==e){let t=o(n);t=f(t)&&null!==e?l(e,t):t,a=t}const c=g(a)?a.getChildren():[],u=function(t){const e=t.exportJSON(),n=t.constructor;if(e.type!==n.getType()&&w(76,n.name),g(t)){const t=e.children;Array.isArray(t)||w(70,n.name)}return e}(a);if(f(a)){const t=a.__text;t.length>0?u.text=t:i=!1}for(let o=0;o<c.length;o++){const l=c[o],r=S(t,e,l,u.children);!i&&g(n)&&r&&n.extractWithChild(l,e,"clone")&&(i=!0)}if(i&&!s)r.push(u);else if(Array.isArray(u.children))for(let t=0;t<u.children.length;t++){const e=u.children[t];r.push(e)}return i}function A(t,e){const n=[],o=u().getChildren();for(let l=0;l<o.length;l++){S(t,e,o[l],n)}return{namespace:t._config.namespace,nodes:n}}function R(t){const e=[];for(let o=0;o<t.length;o++){const l=t[o],r=d(l);f(r)&&n(r),e.push(r)}return e}let E=null;async function O(t,e){if(null!==E)return!1;if(null!==e)return new Promise(((n,o)=>{t.update((()=>{n(P(t,e))}))}));const n=t.getRootElement(),o=null==t._window?window.document:t._window.document,l=v(t._window);if(null===n||null===l)return!1;const i=o.createElement("span");i.style.cssText="position: fixed; top: -1000px;",i.append(o.createTextNode("#")),n.append(i);const s=new Range;return s.setStart(i,0),s.setEnd(i,1),l.removeAllRanges(),l.addRange(s),new Promise(((e,n)=>{const l=t.registerCommand(p,(n=>(r(n,ClipboardEvent)&&(l(),null!==E&&(window.clearTimeout(E),E=null),e(P(t,n))),!0)),m);E=window.setTimeout((()=>{l(),E=null,e(!1)}),50),o.execCommand("copy"),i.remove()}))}function P(t,e){const n=v(t._window);if(!n)return!1;const o=n.anchorNode,l=n.focusNode;if(null!==o&&null!==l&&!h(t,o,l))return!1;e.preventDefault();const r=e.clipboardData,s=i();if(null===r||null===s)return!1;const a=D(t),c=C(t);let u="";return null!==s&&(u=s.getTextContent()),null!==a&&r.setData("text/html",a),null!==c&&r.setData("application/x-lexical-editor",c),r.setData("text/plain",u),!0}export{A as $generateJSONFromSelectedNodes,R as $generateNodesFromSerializedNodes,D as $getHtmlContent,C as $getLexicalContent,N as $insertDataTransferForPlainText,_ as $insertDataTransferForRichText,T as $insertGeneratedNodes,O as copyToClipboard};
