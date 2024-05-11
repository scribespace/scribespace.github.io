/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var m=require("@lexical/selection"),q=require("@lexical/utils"),r=require("lexical");
function t(b,a,f,e=null){let g=null!==e?a.isSelected(e):!0,c=r.$isElementNode(a)&&a.excludeFromCopy("html");var d=a;null!==e&&(d=m.$cloneWithProperties(a),d=r.$isTextNode(d)&&null!==e?m.$sliceSelectedTextNodeContent(e,d):d);let h=r.$isElementNode(d)?d.getChildren():[];var k=b._nodes.get(d.getType());k=k&&void 0!==k.exportDOM?k.exportDOM(b,d):d.exportDOM(b);let {element:l,after:n}=k;if(!l)return!1;k=document.createDocumentFragment();for(let p=0;p<h.length;p++){let u=h[p],y=t(b,u,k,e);!g&&r.$isElementNode(a)&&
y&&a.extractWithChild(u,e,"html")&&(g=!0)}g&&!c?(q.isHTMLElement(l)&&l.append(k),f.append(l),n&&(b=n.call(d,l))&&l.replaceWith(b)):f.append(k);return g}function v(b,a){var {nodeName:f}=b;f=a._htmlConversions.get(f.toLowerCase());a=null;if(void 0!==f)for(let e of f)f=e(b),null!==f&&(null===a||(a.priority||0)<(f.priority||0))&&(a=f);return null!==a?a.conversion:null}let w=new Set(["STYLE","SCRIPT"]);
function x(b,a,f,e,g=new Map,c){let d=[];if(w.has(b.nodeName))return d;let h=null;var k=v(b,a),l=k?k(b):null;k=null;if(null!==l){k=l.after;let p=l.node;h=Array.isArray(p)?p[p.length-1]:p;if(null!==h){for(var [,n]of g)if(h=n(h,c),!h)break;h&&d.push(...(Array.isArray(p)?p:[h]))}null!=l.forChild&&g.set(b.nodeName,l.forChild)}c=b.childNodes;n=[];e=null!=h&&r.$isRootOrShadowRoot(h)?!1:null!=h&&r.$isBlockElementNode(h)||e;for(l=0;l<c.length;l++)n.push(...x(c[l],a,f,e,new Map(g),h));null!=k&&(n=k(n));q.isBlockDomNode(b)&&
(n=e?z(b,n,()=>{let p=new r.ArtificialNode__DO_NOT_USE;f.push(p);return p}):z(b,n,r.$createParagraphNode));null==h?d=d.concat(n):r.$isElementNode(h)&&h.append(...n);return d}function z(b,a,f){b=b.style.textAlign;let e=[],g=[];for(let d=0;d<a.length;d++){var c=a[d];if(r.$isBlockElementNode(c))c.setFormat(b),e.push(c);else if(g.push(c),d===a.length-1||d<a.length-1&&r.$isBlockElementNode(a[d+1]))c=f(),c.setFormat(b),c.append(...g),e.push(c),g=[]}return e}
exports.$generateHtmlFromNodes=function(b,a){if("undefined"===typeof document||"undefined"===typeof window&&"undefined"===typeof global.window)throw Error("To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom before calling this function.");let f=document.createElement("div"),e=r.$getRoot().getChildren();for(let g=0;g<e.length;g++)t(b,e[g],f,a);return f.innerHTML};
exports.$generateNodesFromDOM=function(b,a){let f=a.body?a.body.childNodes:[];a=[];let e=[];for(let c=0;c<f.length;c++){var g=f[c];w.has(g.nodeName)||(g=x(g,b,e,!1),null!==g&&(a=a.concat(g)))}for(let c of e)c.getNextSibling()instanceof r.ArtificialNode__DO_NOT_USE&&c.insertAfter(r.$createLineBreakNode());for(let c of e){b=c.getChildren();for(let d of b)c.insertBefore(d);c.remove()}return a}
