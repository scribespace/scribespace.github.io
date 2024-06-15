/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var n=require("lexical"),v=require("yjs"),x=require("@lexical/offset"),z=require("@lexical/selection"),A;function C(a){let b=new URLSearchParams;b.append("code",a);for(let c=1;c<arguments.length;c++)b.append("v",arguments[c]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${b} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}
A=C&&C.__esModule&&Object.prototype.hasOwnProperty.call(C,"default")?C["default"]:C;class E{constructor(a,b){this._key="";this._map=a;this._parent=b;this._type="linebreak"}getNode(){let a=n.$getNodeByKey(this._key);return n.$isLineBreakNode(a)?a:null}getKey(){return this._key}getSharedType(){return this._map}getType(){return this._type}getSize(){return 1}getOffset(){return this._parent.getChildOffset(this)}destroy(a){a.collabNodeMap.delete(this._key)}}
function F(a,b){b=new E(a,b);return a._collabNode=b}
class G{constructor(a,b,c,d){this._key="";this._map=a;this._parent=c;this._text=b;this._type=d;this._normalized=!1}getPrevNode(a){if(null===a)return null;a=a.get(this._key);return n.$isTextNode(a)?a:null}getNode(){let a=n.$getNodeByKey(this._key);return n.$isTextNode(a)?a:null}getSharedType(){return this._map}getType(){return this._type}getKey(){return this._key}getSize(){return this._text.length+(this._normalized?0:1)}getOffset(){return this._parent.getChildOffset(this)}spliceText(a,b,c){let d=this._parent._xmlText;
a=this.getOffset()+1+a;0!==b&&d.delete(a,b);""!==c&&d.insert(a,c)}syncPropertiesAndTextFromLexical(a,b,c){var d=this.getPrevNode(c);c=b.__text;H(a,this._map,d,b);if(null!==d&&(a=d.__text,a!==c)){d=b.__key;b=a;var e=n.$getSelection();a=c.length;n.$isRangeSelection(e)&&e.isCollapsed()&&(e=e.anchor,e.key===d&&(a=e.offset));d=b.length;let f=c.length,h=e=0;for(;e<d&&e<f&&b[e]===c[e]&&e<a;)e++;for(;h+e<d&&h+e<f&&b[d-h-1]===c[f-h-1];)h++;for(;h+e<d&&h+e<f&&b[e]===c[e];)e++;b=e;a=c.slice(e,f-h);d=d-e-h;this.spliceText(b,
d,a);this._text=c}}syncPropertiesAndTextFromYjs(a,b){let c=this.getNode();null===c&&A(145);I(a,this._map,c,b);a=this._text;c.__text!==a&&(c.getWritable().__text=a)}destroy(a){a.collabNodeMap.delete(this._key)}}function J(a,b,c,d){b=new G(a,b,c,d);return a._collabNode=b}let aa=new Set(["__key","__parent","__next","__prev"]),ba=new Set(["__first","__last","__size"]),ca=new Set(["__cachedText"]),ka=new Set(["__text"]);
function K(a,b,c){if(aa.has(a))return!0;if(n.$isTextNode(b)){if(ka.has(a))return!0}else if(n.$isElementNode(b)&&(ba.has(a)||n.$isRootNode(b)&&ca.has(a)))return!0;b=c.excludedProperties.get(b.constructor);return null!=b&&b.has(a)}function L(a){a=n.$getNodeByKey(a);null===a&&A(146);return a}
function M(a,b,c){let d=b.__type;if(n.$isElementNode(b)){var e=new v.XmlText;e=N(e,c,d);e.syncPropertiesFromLexical(a,b,null);e.syncChildrenFromLexical(a,b,null,null,null)}else n.$isTextNode(b)?(e=new v.Map,e=J(e,b.__text,c,d),e.syncPropertiesAndTextFromLexical(a,b,null)):n.$isLineBreakNode(b)?(a=new v.Map,a.set("__type","linebreak"),e=F(a,c)):n.$isDecoratorNode(b)?(e=new v.XmlElement,e=O(e,c,d),e.syncPropertiesFromLexical(a,b,null)):A(147);e._key=b.__key;return e}
function P(a,b,c){let d=b._collabNode;if(void 0===d){var e=a.editor._nodes;let f=b instanceof v.Map?b.get("__type"):b.getAttribute("__type");null==f&&A(148);void 0===e.get(f)&&A(149,f);e=b.parent;a=void 0===c&&null!==e?P(a,e):c||null;a instanceof Q||A(150);if(b instanceof v.XmlText)return N(b,a,f);if(b instanceof v.Map)return"linebreak"===f?F(b,a):J(b,"",a,f);if(b instanceof v.XmlElement)return O(b,a,f)}return d}
function I(a,b,c,d){d=null===d?b instanceof v.Map?Array.from(b.keys()):Object.keys(b.getAttributes()):Array.from(d);let e;for(let h=0;h<d.length;h++){let g=d[h];if(K(g,c,a))continue;var f=c[g];let k=b instanceof v.Map?b.get(g):b.getAttribute(g);if(f!==k){if(k instanceof v.Doc){let p=a.docMap;f instanceof v.Doc&&p.delete(f.guid);f=n.createEditor();let t=k.guid;f._key=t;p.set(t,k);k=f}void 0===e&&(e=c.getWritable());e[g]=k}}}
function H(a,b,c,d){var e=d.__type,f=a.nodeProperties;let h=f.get(e);void 0===h&&(h=Object.keys(d).filter(k=>!K(k,d,a)),f.set(e,h));e=a.editor.constructor;for(f=0;f<h.length;f++){let k=h[f];var g=null===c?void 0:c[k];let p=d[k];if(g!==p){if(p instanceof e){let t=a.docMap,m;g instanceof e&&(g=g._key,m=t.get(g),t.delete(g));g=m||new v.Doc;let l=g.guid;p._key=l;t.set(l,g);p=g;a.editor.update(()=>{d.markDirty()})}b instanceof v.Map?b.set(k,p):b.setAttribute(k,p)}}}
function R(a,b,c){let d=0,e=0,f=a._children,h=f.length;for(;e<h;e++){a=f[e];let g=d,k=a.getSize();d+=k;if((c?d>=b:d>b)&&a instanceof G)return c=b-g-1,0>c&&(c=0),{length:d-b,node:a,nodeIndex:e,offset:c};if(d>b)return{length:0,node:a,nodeIndex:e,offset:g};if(e===h-1)return{length:0,node:null,nodeIndex:e+1,offset:g+1}}return{length:0,node:null,nodeIndex:0,offset:0}}
function S(a){let b=a.anchor;a=a.focus;let c=!1;try{let d=b.getNode(),e=a.getNode();if(!d.isAttached()||!e.isAttached()||n.$isTextNode(d)&&b.offset>d.getTextContentSize()||n.$isTextNode(e)&&a.offset>e.getTextContentSize())c=!0}catch(d){c=!0}return c}function la(a,b){a.doc.transact(b,a)}
function T(a){var b=a.getParent();if(null!==b){let e=a.getWritable();b=b.getWritable();var c=a.getPreviousSibling();a=a.getNextSibling();if(null===c)if(null!==a){var d=a.getWritable();b.__first=a.__key;d.__prev=null}else b.__first=null;else{d=c.getWritable();if(null!==a){let f=a.getWritable();f.__prev=d.__key;d.__next=f.__key}else d.__next=null;e.__prev=null}null===a?null!==c?(a=c.getWritable(),b.__last=c.__key,a.__next=null):b.__last=null:(a=a.getWritable(),null!==c?(c=c.getWritable(),c.__next=a.__key,
a.__prev=c.__key):a.__prev=null,e.__next=null);b.__size--;e.__parent=null}}function U(a,b){if(a=b._nodeMap.get(a)){var c=a.__prev,d=null;c&&(d=n.$getNodeByKey(c));null===d&&null!==a.__parent&&(d=n.$getNodeByKey(a.__parent));null===d?n.$getRoot().selectStart():null!==d&&d.isAttached()?d.selectEnd():U(d.__key,b)}else n.$getRoot().selectStart()}
class V{constructor(a,b,c){this._key="";this._xmlElem=a;this._parent=b;this._type=c}getPrevNode(a){if(null===a)return null;a=a.get(this._key);return n.$isDecoratorNode(a)?a:null}getNode(){let a=n.$getNodeByKey(this._key);return n.$isDecoratorNode(a)?a:null}getSharedType(){return this._xmlElem}getType(){return this._type}getKey(){return this._key}getSize(){return 1}getOffset(){return this._parent.getChildOffset(this)}syncPropertiesFromLexical(a,b,c){c=this.getPrevNode(c);H(a,this._xmlElem,c,b)}syncPropertiesFromYjs(a,
b){let c=this.getNode();null===c&&A(151);I(a,this._xmlElem,c,b)}destroy(a){a.collabNodeMap.delete(this._key)}}function O(a,b,c){b=new V(a,b,c);return a._collabNode=b}
class Q{constructor(a,b,c){this._key="";this._children=[];this._xmlText=a;this._type=c;this._parent=b}getPrevNode(a){if(null===a)return null;a=a.get(this._key);return n.$isElementNode(a)?a:null}getNode(){let a=n.$getNodeByKey(this._key);return n.$isElementNode(a)?a:null}getSharedType(){return this._xmlText}getType(){return this._type}getKey(){return this._key}isEmpty(){return 0===this._children.length}getSize(){return 1}getOffset(){let a=this._parent;null===a&&A(139);return a.getChildOffset(this)}syncPropertiesFromYjs(a,
b){let c=this.getNode();null===c&&A(140);I(a,this._xmlText,c,b)}applyChildrenYjsDelta(a,b){let c=this._children,d=0;for(let t=0;t<b.length;t++){var e=b[t],f=e.insert,h=e.delete;if(null!=e.retain)d+=e.retain;else if("number"===typeof h)for(f=h;0<f;){let {node:m,nodeIndex:l,offset:q,length:u}=R(this,d,!1);if(m instanceof Q||m instanceof E||m instanceof V)c.splice(l,1),--f;else if(m instanceof G){e=Math.min(f,u);h=0!==l?c[l-1]:null;var g=m.getSize();if(0===q&&1===e&&0<l&&h instanceof G&&u===g&&0===Array.from(m._map.keys()).length)h._text+=
m._text,c.splice(l,1);else if(0===q&&e===g)c.splice(l,1);else{h=m;g=m._text;var k=q,p=e;g=g.slice(0,k)+""+g.slice(k+p);h._text=g}f-=e}else break}else if(null!=f)if("string"===typeof f){let {node:m,offset:l}=R(this,d,!0);m instanceof G?(e=m,h=m._text,g=l,k=f,h=h.slice(0,g)+k+h.slice(g+0),e._text=h):this._xmlText.delete(l,f.length);d+=f.length}else e=f,{nodeIndex:f}=R(this,d,!1),e=P(a,e,this),c.splice(f,0,e),d+=1;else throw Error("Unexpected delta format");}}syncChildrenFromYjs(a){var b=this.getNode();
null===b&&A(141);var c=b.__key;let d=x.$createChildrenArray(b,null),e=d.length;var f=this._children;let h=f.length,g=a.collabNodeMap,k=new Set,p;let t=0;var m=null;h!==e&&b.getWritable();for(let y=0;y<h;y++){var l=d[t],q=f[y];var u=q.getNode();var r=q._key;if(null!==u&&l===r)m=n.$isTextNode(u),k.add(l),m&&(q._key=l,q instanceof Q?(m=q._xmlText,q.syncPropertiesFromYjs(a,null),q.applyChildrenYjsDelta(a,m.toDelta()),q.syncChildrenFromYjs(a)):q instanceof G?q.syncPropertiesAndTextFromYjs(a,null):q instanceof
V?q.syncPropertiesFromYjs(a,null):q instanceof E||A(142)),m=u,t++;else{if(void 0===p)for(p=new Set,r=0;r<h;r++){var w=f[r]._key;""!==w&&p.add(w)}if(null!==u&&void 0!==l&&!p.has(l)){q=L(l);T(q);y--;t++;continue}u=b.getWritable();l=a;r=q;w=c;var B=r.getType();let D=l.editor._nodes.get(B);void 0===D&&A(149,B);B=new D.klass;B.__parent=w;r._key=B.__key;r instanceof Q?(w=r._xmlText,r.syncPropertiesFromYjs(l,null),r.applyChildrenYjsDelta(l,w.toDelta()),r.syncChildrenFromYjs(l)):r instanceof G?r.syncPropertiesAndTextFromYjs(l,
null):r instanceof V&&r.syncPropertiesFromYjs(l,null);l.collabNodeMap.set(B.__key,r);l=B;r=l.__key;g.set(r,q);null===m?(m=u.getFirstChild(),u.__first=r,null!==m&&(m=m.getWritable(),m.__prev=r,l.__next=m.__key)):(q=m.getWritable(),w=m.getNextSibling(),q.__next=r,l.__prev=m.__key,null!==w&&(m=w.getWritable(),m.__prev=r,l.__next=m.__key));y===h-1&&(u.__last=r);u.__size++;m=l}}for(b=0;b<e;b++)f=d[b],k.has(f)||(c=L(f),f=a.collabNodeMap.get(f),void 0!==f&&f.destroy(a),T(c))}syncPropertiesFromLexical(a,
b,c){H(a,this._xmlText,this.getPrevNode(c),b)}_syncChildFromLexical(a,b,c,d,e,f){b=this._children[b];c=L(c);b instanceof Q&&n.$isElementNode(c)?(b.syncPropertiesFromLexical(a,c,d),b.syncChildrenFromLexical(a,c,d,e,f)):b instanceof G&&n.$isTextNode(c)?b.syncPropertiesAndTextFromLexical(a,c,d):b instanceof V&&n.$isDecoratorNode(c)&&b.syncPropertiesFromLexical(a,c,d)}syncChildrenFromLexical(a,b,c,d,e){var f=this.getPrevNode(c);let h=null===f?[]:x.$createChildrenArray(f,c);f=x.$createChildrenArray(b,
null);let g=h.length-1,k=f.length-1,p=a.collabNodeMap,t,m,l=0;for(b=0;l<=g&&b<=k;){var q=h[l];let r=f[b];if(q===r)this._syncChildFromLexical(a,b,r,c,d,e),l++,b++;else{void 0===t&&(t=new Set(h));void 0===m&&(m=new Set(f));var u=m.has(q);q=t.has(r);u?(u=L(r),u=M(a,u,this),p.set(r,u),q?(this.splice(a,b,1,u),l++):this.splice(a,b,0,u),b++):(this.splice(a,b,1),l++)}}c=l>g;d=b>k;if(c&&!d)for(;b<=k;++b)c=f[b],d=L(c),d=M(a,d,this),this.append(d),p.set(c,d);else if(d&&!c)for(f=this._children.length-1;f>=b;f--)this.splice(a,
f,1)}append(a){let b=this._xmlText;var c=this._children;c=c[c.length-1];c=void 0!==c?c.getOffset()+c.getSize():0;if(a instanceof Q)b.insertEmbed(c,a._xmlText);else if(a instanceof G){let d=a._map;null===d.parent&&b.insertEmbed(c,d);b.insert(c+1,a._text)}else a instanceof E?b.insertEmbed(c,a._map):a instanceof V&&b.insertEmbed(c,a._xmlElem);this._children.push(a)}splice(a,b,c,d){let e=this._children;var f=e[b];if(void 0===f)void 0===d&&A(143),this.append(d);else{var h=f.getOffset();-1===h&&A(144);
var g=this._xmlText;0!==c&&g.delete(h,f.getSize());d instanceof Q?g.insertEmbed(h,d._xmlText):d instanceof G?(f=d._map,null===f.parent&&g.insertEmbed(h,f),g.insert(h+1,d._text)):d instanceof E?g.insertEmbed(h,d._map):d instanceof V&&g.insertEmbed(h,d._xmlElem);if(0!==c)for(h=e.slice(b,b+c),g=0;g<h.length;g++)h[g].destroy(a);void 0!==d?e.splice(b,c,d):e.splice(b,c)}}getChildOffset(a){let b=0,c=this._children;for(let d=0;d<c.length;d++){let e=c[d];if(e===a)return b;b+=e.getSize()}return-1}destroy(a){let b=
a.collabNodeMap,c=this._children;for(let d=0;d<c.length;d++)c[d].destroy(a);b.delete(this._key)}}function N(a,b,c){b=new Q(a,b,c);return a._collabNode=b}
function W(a,b){var c=b.collabNodeMap.get(a.key);if(void 0===c)return null;b=a.offset;let d=c.getSharedType();if(c instanceof G){d=c._parent._xmlText;a=c.getOffset();if(-1===a)return null;b=a+1+b}else if(c instanceof Q&&"element"===a.type){var e=a.getNode();n.$isElementNode(e)||A(138);c=a=0;for(e=e.getFirstChild();null!==e&&c++<b;)n.$isTextNode(e)?a+=e.getTextContentSize()+1:a++,e=e.getNextSibling();b=a}return v.createRelativePositionFromTypeIndex(d,b)}
function X(a,b){if(null==a){if(null!=b)return!0}else if(null==b||!v.compareRelativePositions(a,b))return!0;return!1}function Y(a,b){a=a.cursorsContainer;if(null!==a){b=b.selections;let c=b.length;for(let d=0;d<c;d++)a.removeChild(b[d])}}
function ma(a,b){var c=b.awareness.getLocalState();if(null!==c&&(b=c.anchorPos,c=c.focusPos,null!==b&&null!==c&&(b=v.createAbsolutePositionFromRelativePosition(b,a.doc),a=v.createAbsolutePositionFromRelativePosition(c,a.doc),null!==b&&null!==a))){let [d,e]=Z(b.type,b.index),[f,h]=Z(a.type,a.index);if(null!==d&&null!==f){b=d.getKey();c=f.getKey();let g=n.$getSelection();n.$isRangeSelection(g)&&(a=g.focus,na(g.anchor,b,e),na(a,c,h))}}}
function na(a,b,c){if(a.key!==b||a.offset!==c){let d=n.$getNodeByKey(b);if(null!==d&&!n.$isElementNode(d)&&!n.$isTextNode(d)){let e=d.getParentOrThrow();b=e.getKey();c=d.getIndexWithinParent();d=e}a.set(b,c,n.$isElementNode(d)?"element":"text")}}function Z(a,b){a=a._collabNode;if(void 0===a)return[null,0];if(a instanceof Q){let {node:c,offset:d}=R(a,b,!0);return null===c?[a,0]:[c,d]}return[null,0]}
function oa(a,b){var c=Array.from(b.awareness.getStates()),d=a.clientID;b=a.cursors;var e=a.editor._editorState._nodeMap;let f=new Set;for(var h=0;h<c.length;h++){let [D,qa]=c[h];if(D!==d){f.add(D);let {anchorPos:da,focusPos:ea,name:ra,color:sa,focusing:ta}=qa;var g=null,k=b.get(D);void 0===k&&(k={color:sa,name:ra,selection:null},b.set(D,k));if(null!==da&&null!==ea&&ta){var p=v.createAbsolutePositionFromRelativePosition(da,a.doc),t=v.createAbsolutePositionFromRelativePosition(ea,a.doc);if(null!==
p&&null!==t){let [fa,ha]=Z(p.type,p.index),[ia,ja]=Z(t.type,t.index);if(null!==fa&&null!==ia){p=fa.getKey();var m=ia.getKey();g=k.selection;if(null===g){g=k;t=ha;var l=ja,q=g.color,u=document.createElement("span");u.style.cssText=`position:absolute;top:0;bottom:0;right:-1px;width:1px;background-color:${q};z-index:10;`;var r=document.createElement("span");r.textContent=g.name;r.style.cssText=`position:absolute;left:-2px;top:-16px;background-color:${q};color:#fff;line-height:12px;font-size:12px;padding:2px;font-family:Arial;font-weight:bold;white-space:nowrap;`;
u.appendChild(r);g={anchor:{key:p,offset:t},caret:u,color:q,focus:{key:m,offset:l},name:r,selections:[]}}else t=g.anchor,l=g.focus,t.key=p,t.offset=ha,l.key=m,l.offset=ja}}}a:if(p=a,t=k,u=g,q=e,l=p.editor,g=l.getRootElement(),k=p.cursorsContainer,null!==k&&null!==g&&(g=k.offsetParent,null!==g))if(g=g.getBoundingClientRect(),m=t.selection,null===u)null!==m&&(t.selection=null,Y(p,m));else{t.selection=u;t=u.caret;m=u.color;p=u.selections;r=u.anchor;u=u.focus;var w=r.key,B=u.key,y=q.get(w);q=q.get(B);
if(null!=y&&null!=q){if(y===q&&n.$isLineBreakNode(y))q=[l.getElementByKey(w).getBoundingClientRect()];else{q=z.createDOMRange(l,y,r.offset,q,u.offset);if(null===q)break a;q=z.createRectsFromDOMRange(l,q)}u=p.length;l=q.length;for(r=0;r<l;r++)y=q[r],w=p[r],void 0===w&&(w=document.createElement("span"),p[r]=w,B=document.createElement("span"),w.appendChild(B),k.appendChild(w)),y=`position:absolute;top:${y.top-g.top}px;left:${y.left-g.left}px;height:${y.height}px;width:${y.width}px;pointer-events:none;z-index:5;`,
w.style.cssText=y,w.firstChild.style.cssText=`${y}left:0;top:0;background-color:${m};opacity:0.3;`,r===l-1&&t.parentNode!==w&&w.appendChild(t);for(g=u-1;g>=l;g--)k.removeChild(p[g]),p.pop()}}}}c=Array.from(b.keys());for(d=0;d<c.length;d++)e=c[d],f.has(e)||(h=b.get(e),void 0!==h&&(h=h.selection,null!==h&&Y(a,h),b.delete(e)))}
function pa(a,b,c,d){b=b.awareness;var e=b.getLocalState();if(null!==e){var {anchorPos:f,focusPos:h,name:g,color:k,focusing:p,awarenessData:t}=e,m=e=null;if(null!==d&&(null===f||d.is(c))||null!==c)n.$isRangeSelection(d)&&(e=W(d.anchor,a),m=W(d.focus,a)),(X(f,e)||X(h,m))&&b.setLocalState({anchorPos:e,awarenessData:t,color:k,focusPos:m,focusing:p,name:g})}}let ua=n.createCommand("CONNECTED_COMMAND"),va=n.createCommand("TOGGLE_CONNECT_COMMAND");exports.CONNECTED_COMMAND=ua;
exports.TOGGLE_CONNECT_COMMAND=va;exports.createBinding=function(a,b,c,d,e,f){void 0!==d&&null!==d||A(136);b=d.get("root",v.XmlText);b=N(b,null,"root");b._key="root";return{clientID:d.clientID,collabNodeMap:new Map,cursors:new Map,cursorsContainer:null,doc:d,docMap:e,editor:a,excludedProperties:f||new Map,id:c,nodeProperties:new Map,root:b}};exports.createUndoManager=function(a,b){return new v.UndoManager(b,{trackedOrigins:new Set([a,null])})};
exports.initLocalState=function(a,b,c,d,e){a.awareness.setLocalState({anchorPos:null,awarenessData:e,color:c,focusPos:null,focusing:d,name:b})};exports.setLocalStateFocus=function(a,b,c,d,e){({awareness:a}=a);let f=a.getLocalState();null===f&&(f={anchorPos:null,awarenessData:e,color:c,focusPos:null,focusing:d,name:b});f.focusing=d;a.setLocalState(f)};exports.syncCursorPositions=oa;
exports.syncLexicalUpdateToYjs=function(a,b,c,d,e,f,h,g){la(a,()=>{d.read(()=>{if(g.has("collaboration")||g.has("historic")){if(0<h.size){var k=Array.from(h),p=a.collabNodeMap,t=[];for(let u=0;u<k.length;u++){var m=k[u],l=n.$getNodeByKey(m),q=p.get(m);if(q instanceof G)if(n.$isTextNode(l))t.push([q,l.__text]);else{l=q.getOffset();if(-1===l)continue;let r=q._parent;q._normalized=!0;r._xmlText.delete(l,1);p.delete(m);m=r._children;q=m.indexOf(q);m.splice(q,1)}}for(k=0;k<t.length;k++){let [u,r]=t[k];
u instanceof G&&"string"===typeof r&&(u._text=r)}}}else e.has("root")&&(t=c._nodeMap,k=n.$getRoot(),p=a.root,p.syncPropertiesFromLexical(a,k,t),p.syncChildrenFromLexical(a,k,t,e,f)),t=n.$getSelection(),pa(a,b,c._selection,t)})})};
exports.syncYjsChangesToLexical=function(a,b,c,d){let e=a.editor,f=e._editorState;c.forEach(h=>h.delta);e.update(()=>{for(var h=0;h<c.length;h++){var g=a,k=c[h],{target:p}=k;p=P(g,p);if(p instanceof Q&&k instanceof v.YTextEvent){let {keysChanged:t,childListChanged:m,delta:l}=k;0<t.size&&p.syncPropertiesFromYjs(g,t);m&&(p.applyChildrenYjsDelta(g,l),p.syncChildrenFromYjs(g))}else p instanceof G&&k instanceof v.YMapEvent?({keysChanged:k}=k,0<k.size&&p.syncPropertiesAndTextFromYjs(g,k)):p instanceof V&&
k instanceof v.YXmlEvent?({attributesChanged:k}=k,0<k.size&&p.syncPropertiesFromYjs(g,k)):A(137)}0===n.$getRoot().getChildrenSize()&&n.$getRoot().append(n.$createParagraphNode());g=n.$getSelection();n.$isRangeSelection(g)&&(S(g)?(h=f._selection,n.$isRangeSelection(h)&&(ma(a,b),S(g)&&U(g.anchor.key,f)),pa(a,b,h,n.$getSelection())):ma(a,b))},{onUpdate:()=>{oa(a,b)},skipTransforms:!0,tag:d?"historic":"collaboration"})}
