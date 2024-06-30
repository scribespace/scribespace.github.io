/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var k=require("@lexical/link"),n=require("@lexical/react/LexicalComposerContext"),p=require("@lexical/utils"),r=require("lexical"),u=require("react"),v;function w(a){let c=new URLSearchParams;c.append("code",a);for(let b=1;b<arguments.length;b++)c.append("v",arguments[b]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${c} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}
v=w&&w.__esModule&&Object.prototype.hasOwnProperty.call(w,"default")?w["default"]:w;function x(a,c){for(let b=0;b<c.length;b++){let d=c[b](a);if(d)return d}return null}let y=/[.,;\s]/;function z(a){a=a.getPreviousSibling();r.$isElementNode(a)&&(a=a.getLastDescendant());var c;!(c=null===a||r.$isLineBreakNode(a))&&(c=r.$isTextNode(a))&&(a=a.getTextContent(),c=y.test(a[a.length-1]));return c}
function A(a){a=a.getNextSibling();r.$isElementNode(a)&&(a=a.getFirstDescendant());return null===a||r.$isLineBreakNode(a)||r.$isTextNode(a)&&y.test(a.getTextContent()[0])}function B(a,c,b,d){return(0<a?y.test(b[a-1]):z(d[0]))?c<b.length?y.test(b[c]):A(d[d.length-1]):!1}function C(a,c,b){let d=[],h=[],e=[],f=0,g=0;for(a=[...a];0<a.length;){let l=a[0],m=l.getTextContent().length,q=g;g+m<=c?(d.push(l),f+=m):q>=b?e.push(l):h.push(l);g+=m;a.shift()}return[f,d,h,e]}
function D(a,c,b,d){let h=k.$createAutoLinkNode(d.url,d.attributes);if(1===a.length){var e=a[0];0===c?[g,e]=e.splitText(b):[,g,e]=e.splitText(c,b);var f=r.$createTextNode(d.text);f.setFormat(g.getFormat());f.setDetail(g.getDetail());f.setStyle(g.getStyle());h.append(f);g.replace(h);return e}if(1<a.length){d=a[0];var g=d.getTextContent().length;0===c?e=d:[,e]=d.splitText(c);c=[];for(d=1;d<a.length;d++){let l=a[d],m=l.getTextContent().length,q=g,t=g+m;if(q<b)if(t<=b)c.push(l);else{let [G,H]=l.splitText(b-
q);c.push(G);f=H}g+=m}a=(b=r.$getSelection())?b.getNodes().find(r.$isTextNode):void 0;g=r.$createTextNode(e.getTextContent());g.setFormat(e.getFormat());g.setDetail(e.getDetail());g.setStyle(e.getStyle());h.append(g,...c);a&&a===e&&(r.$isRangeSelection(b)?g.select(b.anchor.offset,b.focus.offset):r.$isNodeSelection(b)&&g.select(0,g.getTextContent().length));e.replace(h);return f}}
function E(a,c,b){var d=[...a];let h=a=d.map(g=>g.getTextContent()).join(""),e,f=0;for(;(e=x(h,c))&&null!==e;){let g=e.index,l=g+e.length;if(B(f+g,f+l,a,d)){let [m,,q,t]=C(d,f+g,f+l);d=(d=D(q,f+g-m,f+l-m,e))?[d,...t]:t;b(e.url,null);f=0}else f+=l;h=h.substring(l)}}
function F(a,c,b){var d=a.getChildren();let h=d.length;for(let e=0;e<h;e++){let f=d[e];if(!r.$isTextNode(f)||!f.isSimpleText()){I(a);b(null,a.getURL());return}}d=a.getTextContent();c=x(d,c);null===c||c.text!==d?(I(a),b(null,a.getURL())):z(a)&&A(a)?(d=a.getURL(),d!==c.url&&(a.setURL(c.url),b(c.url,d)),c.attributes&&(d=a.getRel(),d!==c.attributes.rel&&(a.setRel(c.attributes.rel||null),b(c.attributes.rel||null,d)),d=a.getTarget(),d!==c.attributes.target&&(a.setTarget(c.attributes.target||null),b(c.attributes.target||
null,d)))):(I(a),b(null,a.getURL()))}function I(a){let c=a.getChildren();var b=c.length;for(--b;0<=b;b--)a.insertAfter(c[b]);a.remove();return c.map(d=>d.getLatest())}
function J(a,c,b){u.useEffect(()=>{a.hasNodes([k.AutoLinkNode])||v(91);let d=(h,e)=>{b&&b(h,e)};return p.mergeRegister(a.registerNodeTransform(r.TextNode,h=>{var e=h.getParentOrThrow(),f=h.getPreviousSibling();if(k.$isAutoLinkNode(e))F(e,c,d);else if(!k.$isLinkNode(e)){if(h.isSimpleText()&&(y.test(h.getTextContent()[0])||!k.$isAutoLinkNode(f))){e=[h];for(f=h.getNextSibling();null!==f&&r.$isTextNode(f)&&f.isSimpleText();){e.push(f);if(/[\s]/.test(f.getTextContent()))break;f=f.getNextSibling()}E(e,
c,d)}let g=h.getPreviousSibling();e=h.getNextSibling();f=h.getTextContent();k.$isAutoLinkNode(g)&&!y.test(f[0])&&(g.append(h),F(g,c,d),h=g.getURL(),b&&b(null,h));k.$isAutoLinkNode(e)&&!y.test(f[f.length-1])&&(I(e),F(e,c,d),h=e.getURL(),b&&b(null,h))}}))},[a,c,b])}exports.AutoLinkPlugin=function({matchers:a,onChange:c}){let [b]=n.useLexicalComposerContext();J(b,a,c);return null};
exports.createLinkMatcherWithRegExp=function(a,c=b=>b){return b=>{b=a.exec(b);return null===b?null:{index:b.index,length:b[0].length,text:b[0],url:c(b[0])}}}