/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import"prismjs";import"prismjs/components/prism-clike.js";import"prismjs/components/prism-javascript.js";import"prismjs/components/prism-markup.js";import"prismjs/components/prism-markdown.js";import"prismjs/components/prism-c.js";import"prismjs/components/prism-css.js";import"prismjs/components/prism-objectivec.js";import"prismjs/components/prism-sql.js";import"prismjs/components/prism-powershell.js";import"prismjs/components/prism-python.js";import"prismjs/components/prism-rust.js";import"prismjs/components/prism-swift.js";import"prismjs/components/prism-typescript.js";import"prismjs/components/prism-java.js";import"prismjs/components/prism-cpp.js";import{isHTMLElement as e,addClassNamesToElement as t,removeClassNamesFromElement as n,mergeRegister as r}from"@lexical/utils";import{ElementNode as o,$createParagraphNode as i,$isTextNode as s,$isTabNode as l,$createTabNode as u,$createLineBreakNode as c,$applyNodeReplacement as a,TextNode as g,$isLineBreakNode as f,$createTextNode as p,$getNodeByKey as h,$getSelection as d,$isRangeSelection as m,INDENT_CONTENT_COMMAND as y,OUTDENT_CONTENT_COMMAND as x,INSERT_TAB_COMMAND as v,KEY_ARROW_UP_COMMAND as _,MOVE_TO_START as C,KEY_TAB_COMMAND as T,COMMAND_PRIORITY_LOW as j,$insertNodes as N,KEY_ARROW_DOWN_COMMAND as S,MOVE_TO_END as b}from"lexical";"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function w(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var P=w((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const k=e=>null!=e&&window.Prism.languages.hasOwnProperty(e)?e:void 0;function L(t,n){for(const r of t.childNodes){if(e(r)&&r.tagName===n)return!0;L(r,n)}return!1}const O="data-highlight-language";class A extends o{static getType(){return"code"}static clone(e){return new A(e.__language,e.__key)}constructor(e,t){super(t),this.__language=k(e)}createDOM(e){const n=document.createElement("code");t(n,e.theme.code),n.setAttribute("spellcheck","false");const r=this.getLanguage();return r&&n.setAttribute(O,r),n}updateDOM(e,t,n){const r=this.__language,o=e.__language;return r?r!==o&&t.setAttribute(O,r):o&&t.removeAttribute(O),!1}exportDOM(e){const n=document.createElement("pre");t(n,e._config.theme.code),n.setAttribute("spellcheck","false");const r=this.getLanguage();return r&&n.setAttribute(O,r),{element:n}}static importDOM(){return{code:e=>null!=e.textContent&&(/\r?\n/.test(e.textContent)||L(e,"BR"))?{conversion:z,priority:1}:null,div:()=>({conversion:E,priority:1}),pre:()=>({conversion:z,priority:0}),table:e=>R(e)?{conversion:B,priority:3}:null,td:e=>{const t=e,n=t.closest("table");return t.classList.contains("js-file-line")||n&&R(n)?{conversion:H,priority:3}:null},tr:e=>{const t=e.closest("table");return t&&R(t)?{conversion:H,priority:3}:null}}}static importJSON(e){const t=M(e.language);return t.setFormat(e.format),t.setIndent(e.indent),t.setDirection(e.direction),t}exportJSON(){return{...super.exportJSON(),language:this.getLanguage(),type:"code",version:1}}insertNewAfter(e,t=!0){const n=this.getChildren(),r=n.length;if(r>=2&&"\n"===n[r-1].getTextContent()&&"\n"===n[r-2].getTextContent()&&e.isCollapsed()&&e.anchor.key===this.__key&&e.anchor.offset===r){n[r-1].remove(),n[r-2].remove();const e=i();return this.insertAfter(e,t),e}const{anchor:o,focus:a}=e,g=(o.isBefore(a)?o:a).getNode();if(s(g)){let e=Y(g);const t=[];for(;;)if(l(e))t.push(u()),e=e.getNextSibling();else{if(!V(e))break;{let n=0;const r=e.getTextContent(),o=e.getTextContentSize();for(;n<o&&" "===r[n];)n++;if(0!==n&&t.push(G(" ".repeat(n))),n!==o)break;e=e.getNextSibling()}}const n=g.splitText(o.offset)[0],r=0===o.offset?0:1,i=n.getIndexWithinParent()+r,s=g.getParentOrThrow(),a=[c(),...t];s.splice(i,0,a);const f=t[t.length-1];f?f.select():0===o.offset?n.selectPrevious():n.getNextSibling().selectNext(0,0)}if(D(g)){const{offset:t}=e.anchor;g.splice(t,0,[c()]),g.select(t+1,t+1)}return null}canIndent(){return!1}collapseAtStart(){const e=i();return this.getChildren().forEach((t=>e.append(t))),this.replace(e),!0}setLanguage(e){this.getWritable().__language=k(e)}getLanguage(){return this.getLatest().__language}}function M(e){return a(new A(e))}function D(e){return e instanceof A}function z(e){return{node:M(e.getAttribute(O))}}function E(e){const t=e,n=J(t);return n||function(e){let t=e.parentElement;for(;null!==t;){if(J(t))return!0;t=t.parentElement}return!1}(t)?{node:n?M():null}:{node:null}}function B(){return{node:M()}}function H(){return{node:null}}function J(e){return null!==e.style.fontFamily.match("monospace")}function R(e){return e.classList.contains("js-file-line-container")}const F="javascript",K={c:"C",clike:"C-like",cpp:"C++",css:"CSS",html:"HTML",java:"Java",js:"JavaScript",markdown:"Markdown",objc:"Objective-C",plain:"Plain Text",powershell:"PowerShell",py:"Python",rust:"Rust",sql:"SQL",swift:"Swift",typescript:"TypeScript",xml:"XML"},I={cpp:"cpp",java:"java",javascript:"js",md:"markdown",plaintext:"plain",python:"py",text:"plain",ts:"typescript"};function q(e){return I[e]||e}function U(e){const t=q(e);return K[t]||t}const W=()=>F,$=()=>Object.keys(window.Prism.languages).filter((e=>"function"!=typeof window.Prism.languages[e])).sort();class Q extends g{constructor(e,t,n){super(e,n),this.__highlightType=t}static getType(){return"code-highlight"}static clone(e){return new Q(e.__text,e.__highlightType||void 0,e.__key)}getHighlightType(){return this.getLatest().__highlightType}canHaveFormat(){return!1}createDOM(e){const n=super.createDOM(e),r=X(e.theme,this.__highlightType);return t(n,r),n}updateDOM(e,r,o){const i=super.updateDOM(e,r,o),s=X(o.theme,e.__highlightType),l=X(o.theme,this.__highlightType);return s!==l&&(s&&n(r,s),l&&t(r,l)),i}static importJSON(e){const t=G(e.text,e.highlightType);return t.setFormat(e.format),t.setDetail(e.detail),t.setMode(e.mode),t.setStyle(e.style),t}exportJSON(){return{...super.exportJSON(),highlightType:this.getHighlightType(),type:"code-highlight",version:1}}setFormat(e){return this}isParentRequired(){return!0}createParentElementNode(){return M()}}function X(e,t){return t&&e&&e.codeHighlight&&e.codeHighlight[t]}function G(e,t){return a(new Q(e,t))}function V(e){return e instanceof Q}function Y(e){let t=e,n=e;for(;V(n)||l(n);)t=n,n=n.getPreviousSibling();return t}function Z(e){let t=e,n=e;for(;V(n)||l(n);)t=n,n=n.getNextSibling();return t}const ee={defaultLanguage:F,tokenize(e,t){return window.Prism.tokenize(e,window.Prism.languages[t||""]||window.Prism.languages[this.defaultLanguage])}};function te(e,t){let n=null,r=null,o=e,i=t,s=e.getTextContent();for(;;){if(0===i){if(o=o.getPreviousSibling(),null===o)break;if(V(o)||l(o)||f(o)||P(76),f(o)){n={node:o,offset:1};break}i=Math.max(0,o.getTextContentSize()-1),s=o.getTextContent()}else i--;const e=s[i];V(o)&&" "!==e&&(r={node:o,offset:i})}if(null!==r)return r;let u=null;if(t<e.getTextContentSize())V(e)&&(u=e.getTextContent()[t]);else{const t=e.getNextSibling();V(t)&&(u=t.getTextContent()[0])}if(null!==u&&" "!==u)return n;{const r=function(e,t){let n=e,r=t,o=e.getTextContent(),i=e.getTextContentSize();for(;;){if(!V(n)||r===i){if(n=n.getNextSibling(),null===n||f(n))return null;V(n)&&(r=0,o=n.getTextContent(),i=n.getTextContentSize())}if(V(n)){if(" "!==o[r])return{node:n,offset:r};r++}}}(e,t);return null!==r?r:n}}function ne(e){const t=Z(e);return f(t)&&P(77),t}function re(e,t,n){const r=e.getParent();D(r)?se(r,t,n):V(e)&&e.replace(p(e.__text))}function oe(e,t){const n=t.getElementByKey(e.getKey());if(null===n)return;const r=e.getChildren(),o=r.length;if(o===n.__cachedChildrenLength)return;n.__cachedChildrenLength=o;let i="1",s=1;for(let e=0;e<o;e++)f(r[e])&&(i+="\n"+ ++s);n.setAttribute("data-gutter",i)}const ie=new Set;function se(e,t,n){const r=e.getKey();ie.has(r)||(ie.add(r),void 0===e.getLanguage()&&e.setLanguage(n.defaultLanguage),t.update((()=>{!function(e,t){const n=h(e);if(!D(n)||!n.isAttached())return;const r=d();if(!m(r))return void t();const o=r.anchor,i=o.offset,l="element"===o.type&&f(n.getChildAtIndex(o.offset-1));let u=0;if(!l){const e=o.getNode();u=i+e.getPreviousSiblings().reduce(((e,t)=>e+t.getTextContentSize()),0)}if(!t())return;if(l)return void o.getNode().select(i,i);n.getChildren().some((e=>{const t=s(e);if(t||f(e)){const n=e.getTextContentSize();if(t&&n>=u)return e.select(u,u),!0;u-=n}return!1}))}(r,(()=>{const t=h(r);if(!D(t)||!t.isAttached())return!1;const o=t.getTextContent(),i=le(n.tokenize(o,t.getLanguage()||n.defaultLanguage)),s=function(e,t){let n=0;for(;n<e.length&&ue(e[n],t[n]);)n++;const r=e.length,o=t.length,i=Math.min(r,o)-n;let s=0;for(;s<i;)if(s++,!ue(e[r-s],t[o-s])){s--;break}const l=n,u=r-s,c=t.slice(n,o-s);return{from:l,nodesForReplacement:c,to:u}}(t.getChildren(),i),{from:l,to:u,nodesForReplacement:c}=s;return!(l===u&&!c.length)&&(e.splice(l,u-l,c),!0)}))}),{onUpdate:()=>{ie.delete(r)},skipTransforms:!0}))}function le(e,t){const n=[];for(const r of e)if("string"==typeof r){const e=r.split(/(\n|\t)/),o=e.length;for(let r=0;r<o;r++){const o=e[r];"\n"===o||"\r\n"===o?n.push(c()):"\t"===o?n.push(u()):o.length>0&&n.push(G(o,t))}}else{const{content:e}=r;"string"==typeof e?n.push(...le([e],r.type)):Array.isArray(e)&&n.push(...le(e,r.type))}return n}function ue(e,t){return V(e)&&V(t)&&e.__text===t.__text&&e.__highlightType===t.__highlightType||l(e)&&l(t)||f(e)&&f(t)}function ce(e){if(!m(e))return!1;const t=e.anchor.getNode(),n=e.focus.getNode();if(t.is(n)&&D(t))return!0;const r=t.getParent();return D(r)&&r.is(n.getParent())}function ae(e){const t=e.getNodes(),n=[[]];if(1===t.length&&D(t[0]))return n;let r=n[0];for(let e=0;e<t.length;e++){const o=t[e];V(o)||l(o)||f(o)||P(78),f(o)?0!==e&&r.length>0&&(r=[],n.push(r)):r.push(o)}return n}function ge(e){const t=d();if(!m(t)||!ce(t))return!1;const n=ae(t),r=n.length;if(n.length>1){for(let t=0;t<r;t++){const r=n[t];if(r.length>0){let n=r[0];0===t&&(n=Y(n)),null!==n&&(e===y?n.insertBefore(u()):l(n)&&n.remove())}}return!0}const o=t.getNodes()[0];if(D(o)||V(o)||l(o)||f(o)||P(80),D(o))return e===y&&t.insertNodes([u()]),!0;const i=Y(o);return null===i&&P(81),e===y?f(i)?i.insertAfter(u()):i.insertBefore(u()):l(i)&&i.remove(),!0}function fe(e,t){const n=d();if(!m(n))return!1;const{anchor:r,focus:o}=n,i=r.offset,s=o.offset,u=r.getNode(),c=o.getNode(),a=e===_;if(!ce(n)||!V(u)&&!l(u)||!V(c)&&!l(c))return!1;if(!t.altKey){if(n.isCollapsed()){const e=u.getParentOrThrow();if(a&&0===i&&null===u.getPreviousSibling()){if(null===e.getPreviousSibling())return e.selectPrevious(),t.preventDefault(),!0}else if(!a&&i===u.getTextContentSize()&&null===u.getNextSibling()){if(null===e.getNextSibling())return e.selectNext(),t.preventDefault(),!0}}return!1}let g,p;if(u.isBefore(c)?(g=Y(u),p=Z(c)):(g=Y(c),p=Z(u)),null==g||null==p)return!1;const h=g.getNodesBetween(p);for(let e=0;e<h.length;e++){const t=h[e];if(!V(t)&&!l(t)&&!f(t))return!1}t.preventDefault(),t.stopPropagation();const y=a?g.getPreviousSibling():p.getNextSibling();if(!f(y))return!0;const x=a?y.getPreviousSibling():y.getNextSibling();if(null==x)return!0;const v=V(x)||l(x)||f(x)?a?Y(x):Z(x):null;let C=null!=v?v:x;return y.remove(),h.forEach((e=>e.remove())),e===_?(h.forEach((e=>C.insertBefore(e))),C.insertBefore(y)):(C.insertAfter(y),C=y,h.forEach((e=>{C.insertAfter(e),C=e}))),n.setTextNodeRange(u,i,c,s),!0}function pe(e,t){const n=d();if(!m(n))return!1;const{anchor:r,focus:o}=n,i=r.getNode(),s=o.getNode(),u=e===C;if(!V(i)&&!l(i)||!V(s)&&!l(s))return!1;if(u){const e=te(s,o.offset);if(null!==e){const{node:t,offset:r}=e;f(t)?t.selectNext(0,0):n.setTextNodeRange(t,r,t,r)}else s.getParentOrThrow().selectStart()}else{ne(s).select()}return t.preventDefault(),t.stopPropagation(),!0}function he(e,t){if(!e.hasNodes([A,Q]))throw new Error("CodeHighlightPlugin: CodeNode or CodeHighlightNode not registered on editor");return null==t&&(t=ee),r(e.registerMutationListener(A,(t=>{e.update((()=>{for(const[n,r]of t)if("destroyed"!==r){const t=h(n);null!==t&&oe(t,e)}}))})),e.registerNodeTransform(A,(n=>se(n,e,t))),e.registerNodeTransform(g,(n=>re(n,e,t))),e.registerNodeTransform(Q,(n=>re(n,e,t))),e.registerCommand(T,(t=>{const n=function(e){const t=d();if(!m(t)||!ce(t))return null;const n=e?x:y,r=e?x:v;if(ae(t).length>1)return n;const o=t.getNodes()[0];if(D(o)||V(o)||l(o)||f(o)||P(79),D(o))return n;const i=Y(o),s=Z(o),u=t.anchor,c=t.focus;let a,g;return c.isBefore(u)?(a=c,g=u):(a=u,g=c),null!==i&&null!==s&&a.key===i.getKey()&&0===a.offset&&g.key===s.getKey()&&g.offset===s.getTextContentSize()?n:r}(t.shiftKey);return null!==n&&(t.preventDefault(),e.dispatchCommand(n,void 0),!0)}),j),e.registerCommand(v,(()=>!!ce(d())&&(N([u()]),!0)),j),e.registerCommand(y,(e=>ge(y)),j),e.registerCommand(x,(e=>ge(x)),j),e.registerCommand(_,(e=>fe(_,e)),j),e.registerCommand(S,(e=>fe(S,e)),j),e.registerCommand(b,(e=>pe(b,e)),j),e.registerCommand(C,(e=>pe(C,e)),j))}export{G as $createCodeHighlightNode,M as $createCodeNode,V as $isCodeHighlightNode,D as $isCodeNode,K as CODE_LANGUAGE_FRIENDLY_NAME_MAP,I as CODE_LANGUAGE_MAP,Q as CodeHighlightNode,A as CodeNode,F as DEFAULT_CODE_LANGUAGE,ee as PrismTokenizer,$ as getCodeLanguages,W as getDefaultCodeLanguage,ne as getEndOfCodeInLine,Y as getFirstCodeNodeOfLine,U as getLanguageFriendlyName,Z as getLastCodeNodeOfLine,te as getStartOfCodeInLine,q as normalizeCodeLang,he as registerCodeHighlighting};
