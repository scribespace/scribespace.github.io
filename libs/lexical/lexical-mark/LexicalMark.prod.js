/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var k=require("lexical"),m=require("@lexical/utils");
class p extends k.ElementNode{static getType(){return"mark"}static clone(a){return new p(Array.from(a.__ids),a.__key)}static importDOM(){return null}static importJSON(a){let b=q(a.ids);b.setFormat(a.format);b.setIndent(a.indent);b.setDirection(a.direction);return b}exportJSON(){return{...super.exportJSON(),ids:this.getIDs(),type:"mark",version:1}}constructor(a,b){super(b);this.__ids=a||[]}createDOM(a){let b=document.createElement("mark");m.addClassNamesToElement(b,a.theme.mark);1<this.__ids.length&&
m.addClassNamesToElement(b,a.theme.markOverlap);return b}updateDOM(a,b,c){a=a.__ids.length;let d=this.__ids.length;c=c.theme.markOverlap;a!==d&&(1===a?2===d&&m.addClassNamesToElement(b,c):1===d&&m.removeClassNamesFromElement(b,c));return!1}hasID(a){let b=this.getIDs();for(let c=0;c<b.length;c++)if(a===b[c])return!0;return!1}getIDs(){let a=this.getLatest();return r(a)?a.__ids:[]}addID(a){var b=this.getWritable();if(r(b)){let c=b.__ids;b.__ids=c;for(b=0;b<c.length;b++)if(a===c[b])return;c.push(a)}}deleteID(a){var b=
this.getWritable();if(r(b)){let c=b.__ids;b.__ids=c;for(b=0;b<c.length;b++)if(a===c[b]){c.splice(b,1);break}}}insertNewAfter(a,b=!0){a=q(this.__ids);this.insertAfter(a,b);return a}canInsertTextBefore(){return!1}canInsertTextAfter(){return!1}canBeEmpty(){return!1}isInline(){return!0}extractWithChild(a,b,c){if(!k.$isRangeSelection(b)||"html"===c)return!1;let d=b.anchor,h=b.focus;a=d.getNode();c=h.getNode();b=b.isBackward()?d.offset-h.offset:h.offset-d.offset;return this.isParentOf(a)&&this.isParentOf(c)&&
this.getTextContent().length===b}excludeFromCopy(a){return"clone"!==a}}function q(a){return k.$applyNodeReplacement(new p(a))}function r(a){return a instanceof p}exports.$createMarkNode=q;exports.$getMarkIDs=function(a,b){for(;null!==a;){if(r(a))return a.getIDs();if(k.$isTextNode(a)&&b===a.getTextContentSize()){let c=a.getNextSibling();if(r(c))return c.getIDs()}a=a.getParent()}return null};exports.$isMarkNode=r;
exports.$unwrapMarkNode=function(a){let b=a.getChildren(),c=null;for(let d=0;d<b.length;d++){let h=b[d];null===c?a.insertBefore(h):c.insertAfter(h);c=h}a.remove()};
exports.$wrapSelectionInMarkNode=function(a,b,c,d){let h=a.getNodes();var t=a.anchor.offset,l=a.focus.offset;a=h.length;let y=b?l:t;t=b?t:l;let u,f;for(l=0;l<a;l++){var e=h[l];if(k.$isElementNode(f)&&f.isParentOf(e))continue;var n=0===l;let w=l===a-1;var g=null;if(k.$isTextNode(e)){g=e.getTextContentSize();let x=n?y:0,v=w?t:g;if(0===x&&0===v)continue;e=e.splitText(x,v);g=1<e.length&&(3===e.length||n&&!w||v===g)?e[1]:e[0]}else if(r(e))continue;else k.$isElementNode(e)&&e.isInline()&&(g=e);null!==g?
g&&g.is(u)||(n=g.getParent(),null!=n&&n.is(u)||(f=void 0),u=n,void 0===f&&(f=(d||q)([c]),g.insertBefore(f)),f.append(g)):f=u=void 0}k.$isElementNode(f)&&(b?f.selectStart():f.selectEnd())};exports.MarkNode=p
