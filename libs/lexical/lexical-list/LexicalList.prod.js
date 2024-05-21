/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var g=require("lexical"),h=require("@lexical/utils"),l;function n(a){let b=new URLSearchParams;b.append("code",a);for(let c=1;c<arguments.length;c++)b.append("v",arguments[c]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${b} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}l=n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n["default"]:n;
function p(a){let b=1;for(a=a.getParent();null!=a;){if(q(a)){a=a.getParent();if(r(a)){b++;a=a.getParent();continue}l(86)}break}return b}function t(a){a=a.getParent();r(a)||l(86);let b=a;for(;null!==b;)b=b.getParent(),r(b)&&(a=b);return a}function u(a){let b=[];a=a.getChildren().filter(q);for(let c=0;c<a.length;c++){let d=a[c],e=d.getFirstChild();r(e)?b=b.concat(u(e)):b.push(d)}return b}function v(a){return q(a)&&r(a.getFirstChild())}
function w(a){for(;null==a.getNextSibling()&&null==a.getPreviousSibling();){let b=a.getParent();if(null==b||!q(a)&&!r(a))break;a=b}a.remove()}function x(a){return y().append(a)}function z(a,b){return q(a)&&(0===b.length||1===b.length&&a.is(b[0])&&0===a.getChildrenSize())}function A(a,b){a.splice(a.getChildrenSize(),0,b)}
function D(a,b){if(r(a))return a;let c=a.getPreviousSibling(),d=a.getNextSibling(),e=y();e.setFormat(a.getFormatType());e.setIndent(a.getIndent());A(e,a.getChildren());if(r(c)&&b===c.getListType())return c.append(e),a.remove(),r(d)&&b===d.getListType()&&(A(c,d.getChildren()),d.remove()),c;if(r(d)&&b===d.getListType())return d.getFirstChildOrThrow().insertBefore(e),a.remove(),d;b=E(b);b.append(e);a.replace(b);return b}
function F(a,b){var c=a.getLastChild();let d=b.getFirstChild();c&&d&&v(c)&&v(d)&&(F(c.getFirstChild(),d.getFirstChild()),d.remove());c=b.getChildren();0<c.length&&a.append(...c);b.remove()}
function G(a){if(!v(a)){var b=a.getParent(),c=b?b.getParent():void 0,d=c?c.getParent():void 0;if(r(d)&&q(c)&&r(b)){d=b?b.getFirstChild():void 0;var e=b?b.getLastChild():void 0;if(a.is(d))c.insertBefore(a),b.isEmpty()&&c.remove();else if(a.is(e))c.insertAfter(a),b.isEmpty()&&c.remove();else{e=b.getListType();b=y();let f=E(e);b.append(f);a.getPreviousSiblings().forEach(k=>f.append(k));d=y();e=E(e);d.append(e);A(e,a.getNextSiblings());c.insertBefore(b);c.insertAfter(d);c.replace(a)}}}}
function H(...a){let b=[];for(let c of a)if(c&&"string"===typeof c)for(let [d]of c.matchAll(/\S+/g))b.push(d);return b}
class I extends g.ElementNode{static getType(){return"listitem"}static clone(a){return new I(a.__value,a.__checked,a.__key)}constructor(a,b,c){super(c);this.__value=void 0===a?1:a;this.__checked=b}createDOM(a){let b=document.createElement("li"),c=this.getParent();r(c)&&"check"===c.getListType()&&J(b,this,null);b.value=this.__value;K(b,a.theme,this);return b}updateDOM(a,b,c){let d=this.getParent();r(d)&&"check"===d.getListType()&&J(b,this,a);b.value=this.__value;K(b,c.theme,this);return!1}static transform(){return a=>
{q(a)||l(83);if(null!=a.__checked){var b=a.getParent();r(b)&&"check"!==b.getListType()&&null!=a.getChecked()&&a.setChecked(void 0)}}}static importDOM(){return{li:()=>({conversion:L,priority:0})}}static importJSON(a){let b=y();b.setChecked(a.checked);b.setValue(a.value);b.setFormat(a.format);b.setDirection(a.direction);return b}exportDOM(a){a=this.createDOM(a._config);a.style.textAlign=this.getFormatType();return{element:a}}exportJSON(){return{...super.exportJSON(),checked:this.getChecked(),type:"listitem",
value:this.getValue(),version:1}}append(...a){for(let b=0;b<a.length;b++){let c=a[b];if(g.$isElementNode(c)&&this.canMergeWith(c)){let d=c.getChildren();this.append(...d);c.remove()}else super.append(c)}return this}replace(a,b){if(q(a))return super.replace(a);this.setIndent(0);let c=this.getParentOrThrow();if(!r(c))return a;if(c.__first===this.getKey())c.insertBefore(a);else if(c.__last===this.getKey())c.insertAfter(a);else{let d=E(c.getListType()),e=this.getNextSibling();for(;e;){let f=e;e=e.getNextSibling();
d.append(f)}c.insertAfter(a);a.insertAfter(d)}b&&(g.$isElementNode(a)||l(65),this.getChildren().forEach(d=>{a.append(d)}));this.remove();0===c.getChildrenSize()&&c.remove();return a}insertAfter(a,b=!0){let c=this.getParentOrThrow();r(c)||l(84);if(q(a))return super.insertAfter(a,b);let d=this.getNextSiblings();c.insertAfter(a,b);if(0!==d.length){let e=E(c.getListType());d.forEach(f=>e.append(f));a.insertAfter(e,b)}return a}remove(a){let b=this.getPreviousSibling(),c=this.getNextSibling();super.remove(a);
b&&c&&v(b)&&v(c)&&(F(b.getFirstChild(),c.getFirstChild()),c.remove())}insertNewAfter(a,b=!0){a=y(null==this.__checked?void 0:!1);this.insertAfter(a,b);return a}collapseAtStart(a){let b=g.$createParagraphNode();this.getChildren().forEach(f=>b.append(f));var c=this.getParentOrThrow(),d=c.getParentOrThrow();let e=q(d);1===c.getChildrenSize()?e?(c.remove(),d.select()):(c.insertBefore(b),c.remove(),c=a.anchor,a=a.focus,d=b.getKey(),"element"===c.type&&c.getNode().is(this)&&c.set(d,c.offset,"element"),
"element"===a.type&&a.getNode().is(this)&&a.set(d,a.offset,"element")):(c.insertBefore(b),this.remove());return!0}getValue(){return this.getLatest().__value}setValue(a){this.getWritable().__value=a}getChecked(){return this.getLatest().__checked}setChecked(a){this.getWritable().__checked=a}toggleChecked(){this.setChecked(!this.__checked)}getIndent(){var a=this.getParent();if(null===a)return this.getLatest().__indent;a=a.getParentOrThrow();let b=0;for(;q(a);)a=a.getParentOrThrow().getParentOrThrow(),
b++;return b}setIndent(a){"number"===typeof a&&-1<a||l(85);let b=this.getIndent();for(;b!==a;)if(b<a){var c=new Set;if(!v(this)&&!c.has(this.getKey())){var d=this.getParent(),e=this.getNextSibling(),f=this.getPreviousSibling();if(v(e)&&v(f))d=f.getFirstChild(),r(d)&&(d.append(this),f=e.getFirstChild(),r(f)&&(f=f.getChildren(),A(d,f),e.remove(),c.add(e.getKey())));else if(v(e))e=e.getFirstChild(),r(e)&&(e=e.getFirstChild(),null!==e&&e.insertBefore(this));else if(v(f))e=f.getFirstChild(),r(e)&&e.append(this);
else if(r(d)){c=y();let k=E(d.getListType());c.append(k);k.append(this);f?f.insertAfter(c):e?e.insertBefore(c):d.append(c)}}b++}else G(this),b--;return this}canInsertAfter(a){return q(a)}canReplaceWith(a){return q(a)}canMergeWith(a){return g.$isParagraphNode(a)||q(a)}extractWithChild(a,b){if(!g.$isRangeSelection(b))return!1;a=b.anchor.getNode();let c=b.focus.getNode();return this.isParentOf(a)&&this.isParentOf(c)&&this.getTextContent().length===b.getTextContent().length}isParentRequired(){return!0}createParentElementNode(){return E("bullet")}}
function K(a,b,c){let d=[],e=[];var f=(b=b.list)?b.listitem:void 0;if(b&&b.nested)var k=b.nested.listitem;void 0!==f&&d.push(...H(f));if(b){f=c.getParent();f=r(f)&&"check"===f.getListType();let m=c.getChecked();f&&!m||e.push(b.listitemUnchecked);f&&m||e.push(b.listitemChecked);f&&d.push(m?b.listitemChecked:b.listitemUnchecked)}void 0!==k&&(k=H(k),c.getChildren().some(m=>r(m))?d.push(...k):e.push(...k));0<e.length&&h.removeClassNamesFromElement(a,...e);0<d.length&&h.addClassNamesToElement(a,...d)}
function J(a,b,c){r(b.getFirstChild())?(a.removeAttribute("role"),a.removeAttribute("tabIndex"),a.removeAttribute("aria-checked")):(a.setAttribute("role","checkbox"),a.setAttribute("tabIndex","-1"),c&&b.__checked===c.__checked||a.setAttribute("aria-checked",b.getChecked()?"true":"false"))}function L(a){a=h.isHTMLElement(a)&&"true"===a.getAttribute("aria-checked");return{node:y(a)}}function y(a){return g.$applyNodeReplacement(new I(void 0,a))}function q(a){return a instanceof I}
class M extends g.ElementNode{static getType(){return"list"}static clone(a){return new M(a.__listType||P[a.__tag],a.__start,a.__key)}constructor(a,b,c){super(c);this.__listType=a=P[a]||a;this.__tag="number"===a?"ol":"ul";this.__start=b}getTag(){return this.__tag}setListType(a){let b=this.getWritable();b.__listType=a;b.__tag="number"===a?"ol":"ul"}getListType(){return this.__listType}getStart(){return this.__start}createDOM(a){let b=document.createElement(this.__tag);1!==this.__start&&b.setAttribute("start",
String(this.__start));b.__lexicalListType=this.__listType;Q(b,a.theme,this);return b}updateDOM(a,b,c){if(a.__tag!==this.__tag)return!0;Q(b,c.theme,this);return!1}static transform(){return a=>{r(a)||l(88);var b=a.getNextSibling();r(b)&&a.getListType()===b.getListType()&&F(a,b);b="check"!==a.getListType();let c=a.getStart();for(let d of a.getChildren())q(d)&&(d.getValue()!==c&&d.setValue(c),b&&null!=d.getChecked()&&d.setChecked(void 0),r(d.getFirstChild())||c++)}}static importDOM(){return{ol:()=>({conversion:R,
priority:0}),ul:()=>({conversion:R,priority:0})}}static importJSON(a){let b=E(a.listType,a.start);b.setFormat(a.format);b.setIndent(a.indent);b.setDirection(a.direction);return b}exportDOM(a){({element:a}=super.exportDOM(a));a&&h.isHTMLElement(a)&&(1!==this.__start&&a.setAttribute("start",String(this.__start)),"check"===this.__listType&&a.setAttribute("__lexicalListType","check"));return{element:a}}exportJSON(){return{...super.exportJSON(),listType:this.getListType(),start:this.getStart(),tag:this.getTag(),
type:"list",version:1}}canBeEmpty(){return!1}canIndent(){return!1}append(...a){for(let c=0;c<a.length;c++){var b=a[c];if(q(b))super.append(b);else{let d=y();r(b)?d.append(b):g.$isElementNode(b)?(b=g.$createTextNode(b.getTextContent()),d.append(b)):d.append(b);super.append(d)}}return this}extractWithChild(a){return q(a)}}
function Q(a,b,c){let d=[],e=[];var f=b.list;if(void 0!==f){let m=f[`${c.__tag}Depth`]||[];b=p(c)-1;let N=b%m.length;var k=m[N];let O=f[c.__tag],B,C=f.nested;f=f.checklist;void 0!==C&&C.list&&(B=C.list);void 0!==O&&d.push(O);void 0!==f&&"check"===c.__listType&&d.push(f);if(void 0!==k)for(d.push(...H(k)),k=0;k<m.length;k++)k!==N&&e.push(c.__tag+k);void 0!==B&&(c=H(B),1<b?d.push(...c):e.push(...c))}0<e.length&&h.removeClassNamesFromElement(a,...e);0<d.length&&h.addClassNamesToElement(a,...d)}
function S(a){let b=[];for(let d=0;d<a.length;d++){var c=a[d];q(c)?(b.push(c),c=c.getChildren(),1<c.length&&c.forEach(e=>{r(e)&&b.push(x(e))})):b.push(x(c))}return b}function R(a){let b=a.nodeName.toLowerCase(),c=null;"ol"===b?c=E("number",a.start):"ul"===b&&(c=h.isHTMLElement(a)&&"check"===a.getAttribute("__lexicallisttype")?E("check"):E("bullet"));return{after:S,node:c}}let P={ol:"number",ul:"bullet"};function E(a,b=1){return g.$applyNodeReplacement(new M(a,b))}
function r(a){return a instanceof M}let T=g.createCommand("INSERT_UNORDERED_LIST_COMMAND"),U=g.createCommand("INSERT_ORDERED_LIST_COMMAND"),V=g.createCommand("INSERT_CHECK_LIST_COMMAND"),W=g.createCommand("REMOVE_LIST_COMMAND");exports.$createListItemNode=y;exports.$createListNode=E;exports.$getListDepth=p;
exports.$handleListInsertParagraph=function(){var a=g.$getSelection();if(!g.$isRangeSelection(a)||!a.isCollapsed())return!1;a=a.anchor.getNode();if(!q(a)||0!==a.getChildrenSize())return!1;var b=t(a),c=a.getParent();r(c)||l(86);let d=c.getParent(),e;if(g.$isRootOrShadowRoot(d))e=g.$createParagraphNode(),b.insertAfter(e);else if(q(d))e=y(),d.insertAfter(e);else return!1;e.select();b=a.getNextSiblings();if(0<b.length){let f=E(c.getListType());g.$isParagraphNode(e)?e.insertAfter(f):(c=y(),c.append(f),
e.insertAfter(c));b.forEach(k=>{k.remove();f.append(k)})}w(a);return!0};exports.$isListItemNode=q;exports.$isListNode=r;exports.INSERT_CHECK_LIST_COMMAND=V;exports.INSERT_ORDERED_LIST_COMMAND=U;exports.INSERT_UNORDERED_LIST_COMMAND=T;exports.ListItemNode=I;exports.ListNode=M;exports.REMOVE_LIST_COMMAND=W;
exports.insertList=function(a,b){a.update(()=>{var c=g.$getSelection();if(null!==c){var d=c.getNodes();if(g.$isRangeSelection(c)){c=c.getStartEndPoints();null===c&&l(87);[c]=c;c=c.getNode();var e=c.getParent();if(z(c,d)){d=E(b);g.$isRootOrShadowRoot(e)?(c.replace(d),e=y(),g.$isElementNode(c)&&(e.setFormat(c.getFormatType()),e.setIndent(c.getIndent())),d.append(e)):q(c)&&(c=c.getParentOrThrow(),A(d,c.getChildren()),c.replace(d));return}}c=new Set;for(e=0;e<d.length;e++){var f=d[e];if(g.$isElementNode(f)&&
f.isEmpty()&&!q(f)&&!c.has(f.getKey()))D(f,b);else if(g.$isLeafNode(f))for(f=f.getParent();null!=f;){let m=f.getKey();if(r(f)){if(!c.has(m)){var k=E(b);A(k,f.getChildren());f.replace(k);c.add(m)}break}else{k=f.getParent();if(g.$isRootOrShadowRoot(k)&&!c.has(m)){c.add(m);D(f,b);break}f=k}}}}})};
exports.removeList=function(a){a.update(()=>{let b=g.$getSelection();if(g.$isRangeSelection(b)){var c=new Set,d=b.getNodes(),e=b.anchor.getNode();if(z(e,d))c.add(t(e));else for(e=0;e<d.length;e++){var f=d[e];g.$isLeafNode(f)&&(f=h.$getNearestNodeOfType(f,I),null!=f&&c.add(t(f)))}for(let k of c){c=k;d=u(k);for(let m of d)d=g.$createParagraphNode(),A(d,m.getChildren()),c.insertAfter(d),c=d,m.__key===b.anchor.key&&b.anchor.set(d.getKey(),0,"element"),m.__key===b.focus.key&&b.focus.set(d.getKey(),0,"element"),
m.remove();k.remove()}}})}
