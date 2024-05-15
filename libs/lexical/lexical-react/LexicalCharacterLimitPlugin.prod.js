/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var p=require("@lexical/react/LexicalComposerContext"),q=require("react"),w=require("@lexical/overflow"),x=require("@lexical/text"),A=require("@lexical/utils"),C=require("lexical"),D=Object.create(null);if(q)for(var E in q)D[E]=q[E];D.default=q;var F;
function H(a){let c=new URLSearchParams;c.append("code",a);for(let h=1;h<arguments.length;h++)c.append("v",arguments[h]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${c} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}F=H&&H.__esModule&&Object.prototype.hasOwnProperty.call(H,"default")?H["default"]:H;
function I(a,c,h=Object.freeze({})){let {strlen:f=l=>l.length,remainingCharacters:r=()=>{}}=h;q.useEffect(()=>{a.hasNodes([w.OverflowNode])||F(57)},[a]);q.useEffect(()=>{let l=a.getEditorState().read(x.$rootTextContent),m=0;return A.mergeRegister(a.registerTextContentListener(d=>{l=d}),a.registerUpdateListener(({dirtyLeaves:d,dirtyElements:t})=>{var y=a.isComposing();d=0<d.size||0<t.size;if(!y&&d){y=f(l);d=y>c||null!==m&&m>c;r(c-y);if(null===m||d){let u=K(l,c,f);a.update(()=>{let G=A.$dfs(),O=G.length,
z=0;for(let B=0;B<O;B+=1){var {node:b}=G[B];if(w.$isOverflowNode(b)){var e=z;if(z+b.getTextContentSize()<=u){var g=b.getParent();e=b.getPreviousSibling();var k=b.getNextSibling();L(b);b=C.$getSelection();!C.$isRangeSelection(b)||b.anchor.getNode().isAttached()&&b.focus.getNode().isAttached()||(C.$isTextNode(e)?e.select():C.$isTextNode(k)?k.select():null!==g&&g.select())}else e<u&&(g=b.getFirstDescendant(),k=null!==g?g.getTextContentSize():0,e+=k,g=C.$isTextNode(g)&&g.isSimpleText(),e=e<=u,(g||e)&&
L(b))}else if(C.$isLeafNode(b)&&(e=z,z+=b.getTextContentSize(),z>u&&!w.$isOverflowNode(b.getParent())&&(g=C.$getSelection(),e<u&&C.$isTextNode(b)&&b.isSimpleText()?([,b]=b.splitText(u-e),b=M(b)):b=M(b),null!==g&&C.$setSelection(g),e=b.getPreviousSibling(),w.$isOverflowNode(e)))){k=b.getFirstChild();var v=e.getChildren();g=v.length;if(null===k)b.append(...v);else for(var n=0;n<g;n++)k.insertBefore(v[n]);n=C.$getSelection();if(C.$isRangeSelection(n)){k=n.anchor;v=k.getNode();n=n.focus;let J=k.getNode();
v.is(e)?k.set(b.getKey(),k.offset,"element"):v.is(b)&&k.set(b.getKey(),g+k.offset,"element");J.is(e)?n.set(b.getKey(),n.offset,"element"):J.is(b)&&n.set(b.getKey(),g+n.offset,"element")}e.remove()}}},{tag:"history-merge"})}m=y}}))},[a,c,r,f])}
function K(a,c,h){var f=Intl.Segmenter;let r=0;var l=0;if("function"===typeof f){a=(new f).segment(a);for(var {segment:m}of a){l+=h(m);if(l>c)break;r+=m.length}}else for(m=Array.from(a),a=m.length,f=0;f<a;f++){let d=m[f];l+=h(d);if(l>c)break;r+=d.length}return r}function M(a){let c=w.$createOverflowNode();a.replace(c);c.append(a);return c}function L(a){let c=a.getChildren(),h=c.length;for(let f=0;f<h;f++)a.insertBefore(c[f]);a.remove();return 0<h?c[h-1]:null}let N=null;
function P({remainingCharacters:a}){return D.createElement("span",{className:`characters-limit ${0>a?"characters-limit-exceeded":""}`},a)}
exports.CharacterLimitPlugin=function({charset:a="UTF-16",maxLength:c=5,renderer:h=P}){let [f]=p.useLexicalComposerContext(),[r,l]=q.useState(c),m=q.useMemo(()=>({remainingCharacters:l,strlen:d=>{if("UTF-8"===a){if(void 0===window.TextEncoder)var t=null;else null===N&&(N=new window.TextEncoder),t=N;null===t?(t=encodeURIComponent(d).match(/%[89ABab]/g),d=d.length+(t?t.length:0)):d=t.encode(d).length;return d}if("UTF-16"===a)return d.length;throw Error("Unrecognized charset");}}),[a]);I(f,c,m);return h({remainingCharacters:r})}