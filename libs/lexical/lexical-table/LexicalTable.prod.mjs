/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{addClassNamesToElement as e,$findMatchingParent as t,removeClassNamesFromElement as n,isHTMLElement as o}from"@lexical/utils";import{ElementNode as r,$createParagraphNode as l,$isElementNode as s,$isLineBreakNode as i,$isTextNode as a,$applyNodeReplacement as c,createCommand as h,$createTextNode as d,$getSelection as u,$isRangeSelection as g,$createPoint as f,$normalizeSelection__EXPERIMENTAL as m,$getNodeByKey as p,isCurrentlyReadOnlyMode as S,$setSelection as C,SELECTION_CHANGE_COMMAND as _,$getNearestNodeFromDOMNode as w,$createRangeSelection as b,$getRoot as y,KEY_ARROW_DOWN_COMMAND as N,COMMAND_PRIORITY_HIGH as T,KEY_ARROW_UP_COMMAND as x,KEY_ARROW_LEFT_COMMAND as v,KEY_ARROW_RIGHT_COMMAND as E,KEY_ESCAPE_COMMAND as O,DELETE_WORD_COMMAND as M,DELETE_LINE_COMMAND as R,DELETE_CHARACTER_COMMAND as K,COMMAND_PRIORITY_CRITICAL as k,KEY_BACKSPACE_COMMAND as F,KEY_DELETE_COMMAND as A,FORMAT_TEXT_COMMAND as H,FORMAT_ELEMENT_COMMAND as P,CONTROLLED_TEXT_INSERTION_COMMAND as B,KEY_TAB_COMMAND as D,FOCUS_COMMAND as L,SELECTION_INSERT_CLIPBOARD_NODES_COMMAND as I,$getPreviousSelection as W,$createRangeSelectionFromDom as U,INSERT_PARAGRAPH_COMMAND as z}from"lexical";const X=/^(\d+(?:\.\d+)?)px$/,Y={BOTH:3,COLUMN:2,NO_STATUS:0,ROW:1};class J extends r{static getType(){return"tablecell"}static clone(e){const t=new J(e.__headerState,e.__colSpan,e.__width,e.__key);return t.__rowSpan=e.__rowSpan,t.__backgroundColor=e.__backgroundColor,t}static importDOM(){return{td:e=>({conversion:$,priority:0}),th:e=>({conversion:$,priority:0})}}static importJSON(e){const t=e.colSpan||1,n=e.rowSpan||1,o=j(e.headerState,t,e.width||void 0);return o.__rowSpan=n,o.__backgroundColor=e.backgroundColor||null,o}constructor(e=Y.NO_STATUS,t=1,n,o){super(o),this.__colSpan=t,this.__rowSpan=1,this.__headerState=e,this.__width=n,this.__backgroundColor=null}createDOM(t){const n=document.createElement(this.getTag());return this.__width&&(n.style.width=`${this.__width}px`),this.__colSpan>1&&(n.colSpan=this.__colSpan),this.__rowSpan>1&&(n.rowSpan=this.__rowSpan),null!==this.__backgroundColor&&(n.style.backgroundColor=this.__backgroundColor),e(n,t.theme.tableCell,this.hasHeader()&&t.theme.tableCellHeader),n}exportDOM(e){const{element:t}=super.exportDOM(e);if(t){const e=t,n=700,o=this.getParentOrThrow().getChildrenSize();e.style.border="1px solid black",this.__colSpan>1&&(e.colSpan=this.__colSpan),this.__rowSpan>1&&(e.rowSpan=this.__rowSpan),e.style.width=`${this.getWidth()||Math.max(90,n/o)}px`,e.style.verticalAlign="top",e.style.textAlign="start";const r=this.getBackgroundColor();null!==r?e.style.backgroundColor=r:this.hasHeader()&&(e.style.backgroundColor="#f2f3f5")}return{element:t}}exportJSON(){return{...super.exportJSON(),backgroundColor:this.getBackgroundColor(),colSpan:this.__colSpan,headerState:this.__headerState,rowSpan:this.__rowSpan,type:"tablecell",width:this.getWidth()}}getColSpan(){return this.__colSpan}setColSpan(e){return this.getWritable().__colSpan=e,this}getRowSpan(){return this.__rowSpan}setRowSpan(e){return this.getWritable().__rowSpan=e,this}getTag(){return this.hasHeader()?"th":"td"}setHeaderStyles(e){return this.getWritable().__headerState=e,this.__headerState}getHeaderStyles(){return this.getLatest().__headerState}setWidth(e){return this.getWritable().__width=e,this.__width}getWidth(){return this.getLatest().__width}getBackgroundColor(){return this.getLatest().__backgroundColor}setBackgroundColor(e){this.getWritable().__backgroundColor=e}toggleHeaderStyle(e){const t=this.getWritable();return(t.__headerState&e)===e?t.__headerState-=e:t.__headerState+=e,t}hasHeaderState(e){return(this.getHeaderStyles()&e)===e}hasHeader(){return this.getLatest().__headerState!==Y.NO_STATUS}updateDOM(e){return e.__headerState!==this.__headerState||e.__width!==this.__width||e.__colSpan!==this.__colSpan||e.__rowSpan!==this.__rowSpan||e.__backgroundColor!==this.__backgroundColor}isShadowRoot(){return!0}collapseAtStart(){return!0}canBeEmpty(){return!1}canIndent(){return!1}}function $(e){const t=e,n=e.nodeName.toLowerCase();let o;X.test(t.style.width)&&(o=parseFloat(t.style.width));const r=j("th"===n?Y.ROW:Y.NO_STATUS,t.colSpan,o);r.__rowSpan=t.rowSpan;const c=t.style.backgroundColor;""!==c&&(r.__backgroundColor=c);const h=t.style,d=h.textDecoration.split(" "),u="700"===h.fontWeight||"bold"===h.fontWeight,g=d.includes("line-through"),f="italic"===h.fontStyle,m=d.includes("underline");return{after:e=>(0===e.length&&e.push(l()),e),forChild:(e,t)=>{if(q(t)&&!s(e)){const t=l();return i(e)&&"\n"===e.getTextContent()?null:(a(e)&&(u&&e.toggleFormat("bold"),g&&e.toggleFormat("strikethrough"),f&&e.toggleFormat("italic"),m&&e.toggleFormat("underline")),t.append(e),t)}return e},node:r}}function j(e,t=1,n){return c(new J(e,t,n))}function q(e){return e instanceof J}const G=h("INSERT_TABLE_COMMAND");class Q extends r{static getType(){return"tablerow"}static clone(e){return new Q(e.__height,e.__key)}static importDOM(){return{tr:e=>({conversion:V,priority:0})}}static importJSON(e){return Z(e.height)}constructor(e,t){super(t),this.__height=e}exportJSON(){return{...super.exportJSON(),...this.getHeight()&&{height:this.getHeight()},type:"tablerow",version:1}}createDOM(t){const n=document.createElement("tr");return this.__height&&(n.style.height=`${this.__height}px`),e(n,t.theme.tableRow),n}isShadowRoot(){return!0}setHeight(e){return this.getWritable().__height=e,this.__height}getHeight(){return this.getLatest().__height}updateDOM(e){return e.__height!==this.__height}canBeEmpty(){return!1}canIndent(){return!1}}function V(e){const t=e;let n;return X.test(t.style.height)&&(n=parseFloat(t.style.height)),{node:Z(n)}}function Z(e){return c(new Q(e))}function ee(e){return e instanceof Q}function te(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ne=te((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const oe="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement;function re(e,t,n=!0){const o=ot();for(let r=0;r<e;r++){const e=Z();for(let o=0;o<t;o++){let t=Y.NO_STATUS;"object"==typeof n?(0===r&&n.rows&&(t|=Y.ROW),0===o&&n.columns&&(t|=Y.COLUMN)):n&&(0===r&&(t|=Y.ROW),0===o&&(t|=Y.COLUMN));const s=j(t),i=l();i.append(d()),s.append(i),e.append(s)}o.append(e)}return o}function le(e){const n=t(e,(e=>q(e)));return q(n)?n:null}function se(e){const n=t(e,(e=>ee(e)));if(ee(n))return n;throw new Error("Expected table cell to be inside of table row.")}function ie(e){const n=t(e,(e=>rt(e)));if(rt(n))return n;throw new Error("Expected table cell to be inside of table.")}function ae(e){const t=se(e);return ie(t).getChildren().findIndex((e=>e.is(t)))}function ce(e){return se(e).getChildren().findIndex((t=>t.is(e)))}function he(e,t){const n=ie(e),{x:o,y:r}=n.getCordsFromCellNode(e,t);return{above:n.getCellNodeFromCords(o,r-1,t),below:n.getCellNodeFromCords(o,r+1,t),left:n.getCellNodeFromCords(o-1,r,t),right:n.getCellNodeFromCords(o+1,r,t)}}function de(e,t){const n=e.getChildren();if(t>=n.length||t<0)throw new Error("Expected table cell to be inside of table row.");return n[t].remove(),e}function ue(e,t,n=!0,o,r){const s=e.getChildren();if(t>=s.length||t<0)throw new Error("Table row target index out of range");const i=s[t];if(!ee(i))throw new Error("Row before insertion index does not exist.");for(let e=0;e<o;e++){const e=i.getChildren(),t=e.length,o=Z();for(let n=0;n<t;n++){const t=e[n];q(t)||ne(12);const{above:s,below:i}=he(t,r);let a=Y.NO_STATUS;const c=s&&s.getWidth()||i&&i.getWidth()||void 0;(s&&s.hasHeaderState(Y.COLUMN)||i&&i.hasHeaderState(Y.COLUMN))&&(a|=Y.COLUMN);const h=j(a,1,c);h.append(l()),o.append(h)}n?i.insertAfter(o):i.insertBefore(o)}return e}const ge=(e,t)=>e===Y.BOTH||e===t?t:Y.NO_STATUS;function fe(e=!0){const t=u();g(t)||Oe(t)||ne(118);const n=t.focus.getNode(),[o,,r]=xe(n),[s,i]=Ne(r,o,o),a=s[0].length,{startRow:c}=i;if(e){const e=c+o.__rowSpan-1,t=s[e],n=Z();for(let o=0;o<a;o++){const{cell:r,startRow:s}=t[o];if(s+r.__rowSpan-1<=e){const e=t[o].cell.__headerState,r=ge(e,Y.COLUMN);n.append(j(r).append(l()))}else r.setRowSpan(r.__rowSpan+1)}const i=r.getChildAtIndex(e);ee(i)||ne(145),i.insertAfter(n)}else{const e=s[c],t=Z();for(let n=0;n<a;n++){const{cell:o,startRow:r}=e[n];if(r===c){const o=e[n].cell.__headerState,r=ge(o,Y.COLUMN);t.append(j(r).append(l()))}else o.setRowSpan(o.__rowSpan+1)}const n=r.getChildAtIndex(c);ee(n)||ne(145),n.insertBefore(t)}}function me(e,t,n=!0,o,r){const s=e.getChildren(),i=[];for(let e=0;e<s.length;e++){const n=s[e];if(ee(n))for(let e=0;e<o;e++){const e=n.getChildren();if(t>=e.length||t<0)throw new Error("Table column target index out of range");const o=e[t];q(o)||ne(12);const{left:s,right:a}=he(o,r);let c=Y.NO_STATUS;(s&&s.hasHeaderState(Y.ROW)||a&&a.hasHeaderState(Y.ROW))&&(c|=Y.ROW);const h=j(c);h.append(l()),i.push({newTableCell:h,targetCell:o})}}return i.forEach((({newTableCell:e,targetCell:t})=>{n?t.insertAfter(e):t.insertBefore(e)})),e}function pe(e=!0){const t=u();g(t)||Oe(t)||ne(118);const n=t.anchor.getNode(),o=t.focus.getNode(),[r]=xe(n),[s,,i]=xe(o),[a,c,h]=Ne(i,s,r),d=a.length,f=e?Math.max(c.startColumn,h.startColumn):Math.min(c.startColumn,h.startColumn),m=e?f+s.__colSpan-1:f-1,p=i.getFirstChild();ee(p)||ne(120);let S=null;function C(e=Y.NO_STATUS){const t=j(e).append(l());return null===S&&(S=t),t}let _=p;e:for(let e=0;e<d;e++){if(0!==e){const e=_.getNextSibling();ee(e)||ne(121),_=e}const t=a[e],n=t[m<0?0:m].cell.__headerState,o=ge(n,Y.ROW);if(m<0){be(_,C(o));continue}const{cell:r,startColumn:l,startRow:s}=t[m];if(l+r.__colSpan-1<=m){let n=r,l=s,i=m;for(;l!==e&&n.__rowSpan>1;){if(i-=r.__colSpan,!(i>=0)){_.append(C(o));continue e}{const{cell:e,startRow:o}=t[i];n=e,l=o}}n.insertAfter(C(o))}else r.setColSpan(r.__colSpan+1)}null!==S&&we(S)}function Se(e,t){const n=e.getChildren();for(let e=0;e<n.length;e++){const o=n[e];if(ee(o)){const e=o.getChildren();if(t>=e.length||t<0)throw new Error("Table column target index out of range");e[t].remove()}}return e}function Ce(){const e=u();g(e)||Oe(e)||ne(118);const t=e.anchor.getNode(),n=e.focus.getNode(),[o,,r]=xe(t),[l]=xe(n),[s,i,a]=Ne(r,o,l),{startRow:c}=i,{startRow:h}=a,d=h+l.__rowSpan-1;if(s.length===d-c+1)return void r.remove();const f=s[0].length,m=s[d+1],p=r.getChildAtIndex(d+1);for(let e=d;e>=c;e--){for(let t=f-1;t>=0;t--){const{cell:n,startRow:o,startColumn:r}=s[e][t];if(r===t&&(e===c&&o<c&&n.setRowSpan(n.__rowSpan-(o-c)),o>=c&&o+n.__rowSpan-1>d))if(n.setRowSpan(n.__rowSpan-(d-o+1)),null===p&&ne(122),0===t)be(p,n);else{const{cell:e}=m[t-1];e.insertAfter(n)}}const t=r.getChildAtIndex(e);ee(t)||ne(123,String(e)),t.remove()}if(void 0!==m){const{cell:e}=m[0];we(e)}else{const e=s[c-1],{cell:t}=e[0];we(t)}}function _e(){const e=u();g(e)||Oe(e)||ne(118);const t=e.anchor.getNode(),n=e.focus.getNode(),[o,,r]=xe(t),[l]=xe(n),[s,i,a]=Ne(r,o,l),{startColumn:c}=i,{startRow:h,startColumn:d}=a,f=Math.min(c,d),m=Math.max(c+o.__colSpan-1,d+l.__colSpan-1),p=m-f+1;if(s[0].length===m-f+1)return r.selectPrevious(),void r.remove();const S=s.length;for(let e=0;e<S;e++)for(let t=f;t<=m;t++){const{cell:n,startColumn:o}=s[e][t];if(o<f){if(t===f){const e=f-o;n.setColSpan(n.__colSpan-Math.min(p,n.__colSpan-e))}}else if(o+n.__colSpan-1>m){if(t===m){const e=m-o+1;n.setColSpan(n.__colSpan-e)}}else n.remove()}const C=s[h],_=C[d+l.__colSpan];if(void 0!==_){const{cell:e}=_;we(e)}else{const e=C[d-1],{cell:t}=e;we(t)}}function we(e){const t=e.getFirstDescendant();null==t?e.selectStart():t.getParentOrThrow().selectStart()}function be(e,t){const n=e.getFirstChild();null!==n?n.insertBefore(t):e.append(t)}function ye(){const e=u();g(e)||Oe(e)||ne(118);const t=e.anchor.getNode(),[n,o,r]=xe(t),l=n.__colSpan,s=n.__rowSpan;if(l>1){for(let e=1;e<l;e++)n.insertAfter(j(Y.NO_STATUS));n.setColSpan(1)}if(s>1){const[e,t]=Ne(r,n,n),{startColumn:i,startRow:a}=t;let c;for(let t=1;t<s;t++){const n=a+t,r=e[n];c=(c||o).getNextSibling(),ee(c)||ne(125);let s=null;for(let e=0;e<i;e++){const t=r[e],o=t.cell;t.startRow===n&&(s=o),o.__colSpan>1&&(e+=o.__colSpan-1)}if(null===s)for(let e=0;e<l;e++)be(c,j(Y.NO_STATUS));else for(let e=0;e<l;e++)s.insertAfter(j(Y.NO_STATUS))}n.setRowSpan(1)}}function Ne(e,t,n){const[o,r,l]=Te(e,t,n);return null===r&&ne(110),null===l&&ne(111),[o,r,l]}function Te(e,t,n){const o=[];let r=null,l=null;function s(e,s,i){const a={cell:i,startColumn:s,startRow:e},c=i.__rowSpan,h=i.__colSpan;for(let t=0;t<c;t++){void 0===o[e+t]&&(o[e+t]=[]);for(let n=0;n<h;n++)o[e+t][s+n]=a}null!==t&&t.is(i)&&(r=a),null!==n&&n.is(i)&&(l=a)}function i(e,t){return void 0===o[e]||void 0===o[e][t]}const a=e.getChildren();for(let e=0;e<a.length;e++){const t=a[e];ee(t)||ne(146);const n=t.getChildren();let o=0;for(const t of n){for(q(t)||ne(147);!i(e,o);)o++;s(e,o,t),o+=t.__colSpan}}return[o,r,l]}function xe(e){let n;if(e instanceof J)n=e;else if("__type"in e){const o=t(e,q);q(o)||ne(148),n=o}else{const o=t(e.getNode(),q);q(o)||ne(148),n=o}const o=n.getParent();ee(o)||ne(149);const r=o.getParent();return rt(r)||ne(150),[n,o,r]}function ve(e){const[t,,n]=xe(e),o=n.getChildren(),r=o.length,l=o[0].getChildren().length,s=new Array(r);for(let e=0;e<r;e++)s[e]=new Array(l);for(let e=0;e<r;e++){const n=o[e].getChildren();let r=0;for(let o=0;o<n.length;o++){for(;s[e][r];)r++;const l=n[o],i=l.__rowSpan||1,a=l.__colSpan||1;for(let t=0;t<i;t++)for(let n=0;n<a;n++)s[e+t][r+n]=l;if(t===l)return{colSpan:a,columnIndex:r,rowIndex:e,rowSpan:i};r+=a}}return null}class Ee{constructor(e,t,n){this.anchor=t,this.focus=n,t._selection=this,n._selection=this,this._cachedNodes=null,this.dirty=!1,this.tableKey=e}getStartEndPoints(){return[this.anchor,this.focus]}isBackward(){return this.focus.isBefore(this.anchor)}getCachedNodes(){return this._cachedNodes}setCachedNodes(e){this._cachedNodes=e}is(e){return!!Oe(e)&&(this.tableKey===e.tableKey&&this.anchor.is(e.anchor)&&this.focus.is(e.focus))}set(e,t,n){this.dirty=!0,this.tableKey=e,this.anchor.key=t,this.focus.key=n,this._cachedNodes=null}clone(){return new Ee(this.tableKey,this.anchor,this.focus)}isCollapsed(){return!1}extract(){return this.getNodes()}insertRawText(e){}insertText(){}insertNodes(e){const t=this.focus.getNode();s(t)||ne(151);m(t.select(0,t.getChildrenSize())).insertNodes(e)}getShape(){const e=p(this.anchor.key);q(e)||ne(152);const t=ve(e);null===t&&ne(153);const n=p(this.focus.key);q(n)||ne(154);const o=ve(n);null===o&&ne(155);const r=Math.min(t.columnIndex,o.columnIndex),l=Math.max(t.columnIndex,o.columnIndex),s=Math.min(t.rowIndex,o.rowIndex),i=Math.max(t.rowIndex,o.rowIndex);return{fromX:Math.min(r,l),fromY:Math.min(s,i),toX:Math.max(r,l),toY:Math.max(s,i)}}getNodes(){const e=this._cachedNodes;if(null!==e)return e;const n=this.anchor.getNode(),o=this.focus.getNode(),r=t(n,q),l=t(o,q);q(r)||ne(152),q(l)||ne(154);const s=r.getParent();ee(s)||ne(156);const i=s.getParent();rt(i)||ne(157);const a=l.getParents()[1];if(a!==i){if(i.isParentOf(l)){const e=a.getParent();null==e&&ne(159),this.set(this.tableKey,l.getKey(),e.getKey())}else{const e=i.getParent();null==e&&ne(158),this.set(this.tableKey,e.getKey(),l.getKey())}return this.getNodes()}const[c,h,d]=Ne(i,r,l);let u=Math.min(h.startColumn,d.startColumn),g=Math.min(h.startRow,d.startRow),f=Math.max(h.startColumn+h.cell.__colSpan-1,d.startColumn+d.cell.__colSpan-1),m=Math.max(h.startRow+h.cell.__rowSpan-1,d.startRow+d.cell.__rowSpan-1),p=u,C=g,_=u,w=g;function b(e){const{cell:t,startColumn:n,startRow:o}=e;u=Math.min(u,n),g=Math.min(g,o),f=Math.max(f,n+t.__colSpan-1),m=Math.max(m,o+t.__rowSpan-1)}for(;u<p||g<C||f>_||m>w;){if(u<p){const e=w-C,t=p-1;for(let n=0;n<=e;n++)b(c[C+n][t]);p=t}if(g<C){const e=_-p,t=C-1;for(let n=0;n<=e;n++)b(c[t][p+n]);C=t}if(f>_){const e=w-C,t=_+1;for(let n=0;n<=e;n++)b(c[C+n][t]);_=t}if(m>w){const e=_-p,t=w+1;for(let n=0;n<=e;n++)b(c[t][p+n]);w=t}}const y=[i];let N=null;for(let e=g;e<=m;e++)for(let t=u;t<=f;t++){const{cell:n}=c[e][t],o=n.getParent();ee(o)||ne(160),o!==N&&y.push(o),y.push(n,...Re(n)),N=o}return S()||(this._cachedNodes=y),y}getTextContent(){const e=this.getNodes();let t="";for(let n=0;n<e.length;n++)t+=e[n].getTextContent();return t}}function Oe(e){return e instanceof Ee}function Me(){const e=f("root",0,"element"),t=f("root",0,"element");return new Ee("root",e,t)}function Re(e){const t=[],n=[e];for(;n.length>0;){const o=n.pop();void 0===o&&ne(112),s(o)&&n.unshift(...o.getChildren()),o!==e&&t.push(o)}return t}class Ke{constructor(e,t){this.isHighlightingCells=!1,this.anchorX=-1,this.anchorY=-1,this.focusX=-1,this.focusY=-1,this.listenersToRemove=new Set,this.tableNodeKey=t,this.editor=e,this.table={columns:0,domRows:[],rows:0},this.tableSelection=null,this.anchorCellNodeKey=null,this.focusCellNodeKey=null,this.anchorCell=null,this.focusCell=null,this.hasHijackedSelectionStyles=!1,this.trackTable(),this.isSelecting=!1}getTable(){return this.table}removeListeners(){Array.from(this.listenersToRemove).forEach((e=>e()))}trackTable(){const e=new MutationObserver((e=>{this.editor.update((()=>{let t=!1;for(let n=0;n<e.length;n++){const o=e[n].target.nodeName;if("TABLE"===o||"TR"===o){t=!0;break}}if(!t)return;const n=this.editor.getElementByKey(this.tableNodeKey);if(!n)throw new Error("Expected to find TableElement in DOM");this.table=Be(n)}))}));this.editor.update((()=>{const t=this.editor.getElementByKey(this.tableNodeKey);if(!t)throw new Error("Expected to find TableElement in DOM");this.table=Be(t),e.observe(t,{childList:!0,subtree:!0})}))}clearHighlight(){const e=this.editor;this.isHighlightingCells=!1,this.anchorX=-1,this.anchorY=-1,this.focusX=-1,this.focusY=-1,this.tableSelection=null,this.anchorCellNodeKey=null,this.focusCellNodeKey=null,this.anchorCell=null,this.focusCell=null,this.hasHijackedSelectionStyles=!1,this.enableHighlightStyle(),e.update((()=>{if(!rt(p(this.tableNodeKey)))throw new Error("Expected TableNode.");const t=e.getElementByKey(this.tableNodeKey);if(!t)throw new Error("Expected to find TableElement in DOM");const n=Be(t);De(e,n,null),C(null),e.dispatchCommand(_,void 0)}))}enableHighlightStyle(){const e=this.editor;e.update((()=>{const t=e.getElementByKey(this.tableNodeKey);if(!t)throw new Error("Expected to find TableElement in DOM");n(t,e._config.theme.tableSelection),t.classList.remove("disable-selection"),this.hasHijackedSelectionStyles=!1}))}disableHighlightStyle(){const t=this.editor;t.update((()=>{const n=t.getElementByKey(this.tableNodeKey);if(!n)throw new Error("Expected to find TableElement in DOM");e(n,t._config.theme.tableSelection),this.hasHijackedSelectionStyles=!0}))}updateTableTableSelection(e){if(null!==e&&e.tableKey===this.tableNodeKey){const t=this.editor;this.tableSelection=e,this.isHighlightingCells=!0,this.disableHighlightStyle(),De(t,this.table,this.tableSelection)}else null==e?this.clearHighlight():(this.tableNodeKey=e.tableKey,this.updateTableTableSelection(e))}setFocusCellForSelection(e,t=!1){const n=this.editor;n.update((()=>{const o=p(this.tableNodeKey);if(!rt(o))throw new Error("Expected TableNode.");if(!n.getElementByKey(this.tableNodeKey))throw new Error("Expected to find TableElement in DOM");const r=e.x,l=e.y;if(this.focusCell=e,null!==this.anchorCell){const e=Fe(n._window);e&&e.setBaseAndExtent(this.anchorCell.elem,0,this.focusCell.elem,0)}if(this.isHighlightingCells||this.anchorX===r&&this.anchorY===l&&!t){if(r===this.focusX&&l===this.focusY)return}else this.isHighlightingCells=!0,this.disableHighlightStyle();if(this.focusX=r,this.focusY=l,this.isHighlightingCells){const t=w(e.elem);if(null!=this.tableSelection&&null!=this.anchorCellNodeKey&&q(t)&&o.is(qe(t))){const e=t.getKey();this.tableSelection=this.tableSelection.clone()||Me(),this.focusCellNodeKey=e,this.tableSelection.set(this.tableNodeKey,this.anchorCellNodeKey,this.focusCellNodeKey),C(this.tableSelection),n.dispatchCommand(_,void 0),De(n,this.table,this.tableSelection)}}}))}setAnchorCellForSelection(e){this.isHighlightingCells=!1,this.anchorCell=e,this.anchorX=e.x,this.anchorY=e.y,this.editor.update((()=>{const t=w(e.elem);if(q(t)){const e=t.getKey();this.tableSelection=null!=this.tableSelection?this.tableSelection.clone():Me(),this.anchorCellNodeKey=e}}))}formatCells(e){this.editor.update((()=>{const t=u();Oe(t)||ne(11);const n=b(),o=n.anchor,r=n.focus;t.getNodes().forEach((t=>{q(t)&&0!==t.getTextContentSize()&&(o.set(t.getKey(),0,"element"),r.set(t.getKey(),t.getChildrenSize(),"element"),n.formatText(e))})),C(t),this.editor.dispatchCommand(_,void 0)}))}clearText(){const e=this.editor;e.update((()=>{const t=p(this.tableNodeKey);if(!rt(t))throw new Error("Expected TableNode.");const n=u();Oe(n)||ne(11);const o=n.getNodes().filter(q);if(o.length!==this.table.columns*this.table.rows)o.forEach((e=>{if(s(e)){const t=l(),n=d();t.append(n),e.append(t),e.getChildren().forEach((e=>{e!==t&&e.remove()}))}})),De(e,this.table,null),C(null),e.dispatchCommand(_,void 0);else{t.selectPrevious(),t.remove();y().selectStart()}}))}}const ke="__lexicalTableSelection",Fe=e=>oe?(e||window).getSelection():null;function Ae(e,n,o,r){const i=o.getRootElement();if(null===i)throw new Error("No root element.");const c=new Ke(o,e.getKey()),h=o._window||window;!function(e,t){e[ke]=t}(n,c);const f=()=>{const e=()=>{c.isSelecting=!1,h.removeEventListener("mouseup",e),h.removeEventListener("mousemove",t)},t=n=>{setTimeout((()=>{if(1&~n.buttons&&c.isSelecting)return c.isSelecting=!1,h.removeEventListener("mouseup",e),void h.removeEventListener("mousemove",t);const o=Pe(n.target);null===o||c.anchorX===o.x&&c.anchorY===o.y||(n.preventDefault(),c.setFocusCellForSelection(o))}),0)};return{onMouseMove:t,onMouseUp:e}};n.addEventListener("mousedown",(e=>{setTimeout((()=>{if(0!==e.button)return;if(!h)return;const t=Pe(e.target);null!==t&&(Qe(e),c.setAnchorCellForSelection(t));const{onMouseUp:n,onMouseMove:o}=f();c.isSelecting=!0,h.addEventListener("mouseup",n),h.addEventListener("mousemove",o)}),0)}));const m=e=>{0===e.button&&o.update((()=>{const t=u(),n=e.target;Oe(t)&&t.tableKey===c.tableNodeKey&&i.contains(n)&&c.clearHighlight()}))};h.addEventListener("mousedown",m),c.listenersToRemove.add((()=>h.removeEventListener("mousedown",m))),c.listenersToRemove.add(o.registerCommand(N,(t=>Ge(o,t,"down",e,c)),T)),c.listenersToRemove.add(o.registerCommand(x,(t=>Ge(o,t,"up",e,c)),T)),c.listenersToRemove.add(o.registerCommand(v,(t=>Ge(o,t,"backward",e,c)),T)),c.listenersToRemove.add(o.registerCommand(E,(t=>Ge(o,t,"forward",e,c)),T)),c.listenersToRemove.add(o.registerCommand(O,(e=>{const n=u();if(Oe(n)){const o=t(n.focus.getNode(),q);if(q(o))return Qe(e),o.selectEnd(),!0}return!1}),T));[M,R,K].forEach((n=>{c.listenersToRemove.add(o.registerCommand(n,(n=>()=>{const o=u();if(!ze(o,e))return!1;if(Oe(o))return c.clearText(),!0;if(g(o)){const r=t(o.anchor.getNode(),(e=>q(e)));if(!q(r))return!1;const l=o.anchor.getNode(),i=o.focus.getNode(),a=e.isParentOf(l),h=e.isParentOf(i);if(a&&!h||h&&!a)return c.clearText(),!0;const d=t(o.anchor.getNode(),(e=>s(e))),u=d&&t(d,(e=>s(e)&&q(e.getParent())));if(!s(u)||!s(d))return!1;if(n===R&&null===u.getPreviousSibling())return!0}return!1})(n),k))}));const p=n=>{const o=u();if(!ze(o,e))return!1;if(Oe(o))return n.preventDefault(),n.stopPropagation(),c.clearText(),!0;if(g(o)){const e=t(o.anchor.getNode(),(e=>q(e)));if(!q(e))return!1}return!1};function S(t){const n=e.getCordsFromCellNode(t,c.table);return e.getDOMCellFromCordsOrThrow(n.x,n.y,c.table)}return c.listenersToRemove.add(o.registerCommand(F,p,k)),c.listenersToRemove.add(o.registerCommand(A,p,k)),c.listenersToRemove.add(o.registerCommand(H,(n=>{const o=u();if(!ze(o,e))return!1;if(Oe(o))return c.formatCells(n),!0;if(g(o)){const e=t(o.anchor.getNode(),(e=>q(e)));if(!q(e))return!1}return!1}),k)),c.listenersToRemove.add(o.registerCommand(P,(t=>{const n=u();if(!Oe(n)||!ze(n,e))return!1;const o=n.anchor.getNode(),r=n.focus.getNode();if(!q(o)||!q(r))return!1;const[l,i,a]=Ne(e,o,r),c=Math.max(i.startRow,a.startRow),h=Math.max(i.startColumn,a.startColumn),d=Math.min(i.startRow,a.startRow),g=Math.min(i.startColumn,a.startColumn);for(let e=d;e<=c;e++)for(let n=g;n<=h;n++){const o=l[e][n].cell;o.setFormat(t);const r=o.getChildren();for(let e=0;e<r.length;e++){const n=r[e];s(n)&&!n.isInline()&&n.setFormat(t)}}return!0}),k)),c.listenersToRemove.add(o.registerCommand(B,(n=>{const r=u();if(!ze(r,e))return!1;if(Oe(r))return c.clearHighlight(),!1;if(g(r)){const l=t(r.anchor.getNode(),(e=>q(e)));if(!q(l))return!1;if("string"==typeof n){const t=Ze(o,r,e);if(t)return Ve(t,e,[d(n)]),!0}}return!1}),k)),r&&c.listenersToRemove.add(o.registerCommand(D,(t=>{const n=u();if(!g(n)||!n.isCollapsed()||!ze(n,e))return!1;const o=je(n.anchor.getNode());if(null===o)return!1;Qe(t);const r=e.getCordsFromCellNode(o,c.table);return We(c,e,r.x,r.y,t.shiftKey?"backward":"forward"),!0}),k)),c.listenersToRemove.add(o.registerCommand(L,(t=>e.isSelected()),T)),c.listenersToRemove.add(o.registerCommand(I,(e=>{const{nodes:n,selection:o}=e,r=o.getStartEndPoints(),s=Oe(o),i=g(o)&&null!==t(o.anchor.getNode(),(e=>q(e)))&&null!==t(o.focus.getNode(),(e=>q(e)))||s;if(1!==n.length||!rt(n[0])||!i||null===r)return!1;const[c]=r,h=n[0],d=h.getChildren(),u=h.getFirstChildOrThrow().getChildrenSize(),f=h.getChildrenSize(),m=t(c.getNode(),(e=>q(e))),p=m&&t(m,(e=>ee(e))),S=p&&t(p,(e=>rt(e)));if(!q(m)||!ee(p)||!rt(S))return!1;const _=p.getIndexWithinParent(),w=Math.min(S.getChildrenSize()-1,_+f-1),b=m.getIndexWithinParent(),y=Math.min(p.getChildrenSize()-1,b+u-1),N=Math.min(b,y),T=Math.min(_,w),x=Math.max(b,y),v=Math.max(_,w),E=S.getChildren();let O,M,R=0;for(let e=T;e<=v;e++){const t=E[e];if(!ee(t))return!1;const n=d[R];if(!ee(n))return!1;const o=t.getChildren(),r=n.getChildren();let s=0;for(let t=N;t<=x;t++){const n=o[t];if(!q(n))return!1;const i=r[s];if(!q(i))return!1;e===T&&t===N?O=n.getKey():e===v&&t===x&&(M=n.getKey());const c=n.getChildren();i.getChildren().forEach((e=>{if(a(e)){l().append(e),n.append(e)}else n.append(e)})),c.forEach((e=>e.remove())),s++}R++}if(O&&M){const e=Me();e.set(n[0].getKey(),O,M),C(e)}return!0}),k)),c.listenersToRemove.add(o.registerCommand(_,(()=>{const t=u(),n=W();if(g(t)){const{anchor:n,focus:r}=t,l=n.getNode(),s=r.getNode(),i=je(l),a=je(s),d=!(!i||!e.is(qe(i))),u=!(!a||!e.is(qe(a))),g=d!==u,m=d&&u,p=t.isBackward();if(g){const n=t.clone();u?n.focus.set(e.getParentOrThrow().getKey(),e.getIndexWithinParent(),"element"):n.anchor.set(e.getParentOrThrow().getKey(),p?e.getIndexWithinParent()+1:e.getIndexWithinParent(),"element"),C(n),Ie(o,c)}else m&&(i.is(a)||(c.setAnchorCellForSelection(S(i)),c.setFocusCellForSelection(S(a),!0),c.isSelecting||setTimeout((()=>{const{onMouseUp:e,onMouseMove:t}=f();c.isSelecting=!0,h.addEventListener("mouseup",e),h.addEventListener("mousemove",t)}),0)))}else if(t&&Oe(t)&&t.is(n)&&t.tableKey===e.getKey()){const n=Fe(o._window);if(n&&n.anchorNode&&n.focusNode){const r=w(n.focusNode),l=r&&!e.is(qe(r)),s=w(n.anchorNode),i=s&&e.is(qe(s));if(l&&i&&n.rangeCount>0){const r=U(n,o);r&&(r.anchor.set(e.getKey(),t.isBackward()?e.getChildrenSize():0,"element"),n.removeAllRanges(),C(r))}}}return t&&!t.is(n)&&(Oe(t)||Oe(n))&&c.tableSelection&&!c.tableSelection.is(n)?(Oe(t)&&t.tableKey===c.tableNodeKey?c.updateTableTableSelection(t):!Oe(t)&&Oe(n)&&n.tableKey===c.tableNodeKey&&c.updateTableTableSelection(null),!1):(c.hasHijackedSelectionStyles&&!e.isSelected()?function(e,t){t.enableHighlightStyle(),Le(t.table,(t=>{const n=t.elem;t.highlighted=!1,$e(e,t),n.getAttribute("style")||n.removeAttribute("style")}))}(o,c):!c.hasHijackedSelectionStyles&&e.isSelected()&&Ie(o,c),!1)}),k)),c.listenersToRemove.add(o.registerCommand(z,(()=>{const t=u();if(!g(t)||!t.isCollapsed()||!ze(t,e))return!1;const n=Ze(o,t,e);return!!n&&(Ve(n,e),!0)}),k)),c}function He(e){return e[ke]}function Pe(e){let t=e;for(;null!=t;){const e=t.nodeName;if("TD"===e||"TH"===e){const e=t._cell;return void 0===e?null:e}t=t.parentNode}return null}function Be(e){const t=[],n={columns:0,domRows:t,rows:0};let o=e.firstChild,r=0,l=0;for(t.length=0;null!=o;){const e=o.nodeName;if("TD"===e||"TH"===e){const e={elem:o,hasBackgroundColor:""!==o.style.backgroundColor,highlighted:!1,x:r,y:l};o._cell=e;let n=t[l];void 0===n&&(n=t[l]=[]),n[r]=e}else{const e=o.firstChild;if(null!=e){o=e;continue}}const n=o.nextSibling;if(null!=n){r++,o=n;continue}const s=o.parentNode;if(null!=s){const e=s.nextSibling;if(null==e)break;l++,r=0,o=e}}return n.columns=r+1,n.rows=l+1,n}function De(e,t,n){const o=new Set(n?n.getNodes():[]);Le(t,((t,n)=>{const r=t.elem;o.has(n)?(t.highlighted=!0,Je(e,t)):(t.highlighted=!1,$e(e,t),r.getAttribute("style")||r.removeAttribute("style"))}))}function Le(e,t){const{domRows:n}=e;for(let e=0;e<n.length;e++){const o=n[e];if(o)for(let n=0;n<o.length;n++){const r=o[n];if(!r)continue;const l=w(r.elem);null!==l&&t(r,l,{x:n,y:e})}}}function Ie(e,t){t.disableHighlightStyle(),Le(t.table,(t=>{t.highlighted=!0,Je(e,t)}))}const We=(e,t,n,o,r)=>{const l="forward"===r;switch(r){case"backward":case"forward":return n!==(l?e.table.columns-1:0)?Xe(t.getCellNodeFromCordsOrThrow(n+(l?1:-1),o,e.table),l):o!==(l?e.table.rows-1:0)?Xe(t.getCellNodeFromCordsOrThrow(l?0:e.table.columns-1,o+(l?1:-1),e.table),l):l?t.selectNext():t.selectPrevious(),!0;case"up":return 0!==o?Xe(t.getCellNodeFromCordsOrThrow(n,o-1,e.table),!1):t.selectPrevious(),!0;case"down":return o!==e.table.rows-1?Xe(t.getCellNodeFromCordsOrThrow(n,o+1,e.table),!0):t.selectNext(),!0;default:return!1}},Ue=(e,t,n,o,r)=>{const l="forward"===r;switch(r){case"backward":case"forward":return n!==(l?e.table.columns-1:0)&&e.setFocusCellForSelection(t.getDOMCellFromCordsOrThrow(n+(l?1:-1),o,e.table)),!0;case"up":return 0!==o&&(e.setFocusCellForSelection(t.getDOMCellFromCordsOrThrow(n,o-1,e.table)),!0);case"down":return o!==e.table.rows-1&&(e.setFocusCellForSelection(t.getDOMCellFromCordsOrThrow(n,o+1,e.table)),!0);default:return!1}};function ze(e,t){if(g(e)||Oe(e)){const n=t.isParentOf(e.anchor.getNode()),o=t.isParentOf(e.focus.getNode());return n&&o}return!1}function Xe(e,t){t?e.selectStart():e.selectEnd()}const Ye="172,206,247";function Je(e,t){const n=t.elem,o=w(n);q(o)||ne(131);null===o.getBackgroundColor()?n.style.setProperty("background-color",`rgb(${Ye})`):n.style.setProperty("background-image",`linear-gradient(to right, rgba(${Ye},0.85), rgba(${Ye},0.85))`),n.style.setProperty("caret-color","transparent")}function $e(e,t){const n=t.elem,o=w(n);q(o)||ne(131);null===o.getBackgroundColor()&&n.style.removeProperty("background-color"),n.style.removeProperty("background-image"),n.style.removeProperty("caret-color")}function je(e){const n=t(e,q);return q(n)?n:null}function qe(e){const n=t(e,rt);return rt(n)?n:null}function Ge(e,n,o,r,l){if(("up"===o||"down"===o)&&function(e){const t=e.getRootElement();if(!t)return!1;return t.hasAttribute("aria-controls")&&"typeahead-menu"===t.getAttribute("aria-controls")}(e))return!1;const i=u();if(!ze(i,r)){if("backward"===o&&g(i)&&i.isCollapsed()){const e=i.anchor.type,o=i.anchor.offset;if("element"!==e&&("text"!==e||0!==o))return!1;const r=i.anchor.getNode();if(!r)return!1;const l=t(r,(e=>s(e)&&!e.isInline()));if(!l)return!1;const a=l.getPreviousSibling();return!(!a||!rt(a))&&(Qe(n),a.selectEnd(),!0)}return!1}if(g(i)&&i.isCollapsed()){const{anchor:a,focus:c}=i,h=t(a.getNode(),q),d=t(c.getNode(),q);if(!q(h)||!h.is(d))return!1;const u=qe(h);if(u!==r&&null!=u){const t=e.getElementByKey(u.getKey());if(null!=t)return l.table=Be(t),Ge(e,n,o,u,l)}if("backward"===o||"forward"===o){const e=a.type,l=a.offset,i=a.getNode();return!!i&&(!!function(e,n,o,r){return function(e,t,n){return"element"===e&&("backward"===n?null===t.getPreviousSibling():null===t.getNextSibling())}(e,o,r)||function(e,n,o,r){const l=t(o,(e=>s(e)&&!e.isInline()));if(!l)return!1;const i="backward"===r?0===n:n===o.getTextContentSize();return"text"===e&&i&&("backward"===r?null===l.getPreviousSibling():null===l.getNextSibling())}(e,n,o,r)}(e,l,i,o)&&function(e,n,o,r){const l=t(n,q);if(!q(l))return!1;const[i,a]=Ne(o,l,l);if(!function(e,t,n){const o=e[0][0],r=e[e.length-1][e[0].length-1],{startColumn:l,startRow:s}=t;return"backward"===n?l===o.startColumn&&s===o.startRow:l===r.startColumn&&s===r.startRow}(i,a,r))return!1;const c=function(e,n,o){const r=t(e,(e=>s(e)&&!e.isInline()));if(!r)return;const l="backward"===n?r.getPreviousSibling():r.getNextSibling();return l&&rt(l)?l:"backward"===n?o.getPreviousSibling():o.getNextSibling()}(n,r,o);if(!c||rt(c))return!1;Qe(e),"backward"===r?c.selectEnd():c.selectStart();return!0}(n,i,r,o))}const g=e.getElementByKey(h.__key),f=e.getElementByKey(a.key);if(null==f||null==g)return!1;let m;if("element"===a.type)m=f.getBoundingClientRect();else{const e=window.getSelection();if(null===e||0===e.rangeCount)return!1;m=e.getRangeAt(0).getBoundingClientRect()}const p="up"===o?h.getFirstChild():h.getLastChild();if(null==p)return!1;const S=e.getElementByKey(p.__key);if(null==S)return!1;const C=S.getBoundingClientRect();if("up"===o?C.top>m.top-m.height:m.bottom+m.height>C.bottom){Qe(n);const e=r.getCordsFromCellNode(h,l.table);if(!n.shiftKey)return We(l,r,e.x,e.y,o);{const t=r.getDOMCellFromCordsOrThrow(e.x,e.y,l.table);l.setAnchorCellForSelection(t),l.setFocusCellForSelection(t,!0)}return!0}}else if(Oe(i)){const{anchor:s,focus:a}=i,c=t(s.getNode(),q),h=t(a.getNode(),q),[d]=i.getNodes(),u=e.getElementByKey(d.getKey());if(!q(c)||!q(h)||!rt(d)||null==u)return!1;l.updateTableTableSelection(i);const g=Be(u),f=r.getCordsFromCellNode(c,g),m=r.getDOMCellFromCordsOrThrow(f.x,f.y,g);if(l.setAnchorCellForSelection(m),Qe(n),n.shiftKey){const e=r.getCordsFromCellNode(h,g);return Ue(l,d,e.x,e.y,o)}return h.selectEnd(),!0}return!1}function Qe(e){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation()}function Ve(e,t,n){const o=l();"first"===e?t.insertBefore(o):t.insertAfter(o),o.append(...n||[]),o.selectEnd()}function Ze(e,n,o){const r=window.getSelection();if(!r||r.anchorNode!==e.getRootElement())return;const l=t(n.anchor.getNode(),(e=>q(e)));if(!l)return;const s=t(l,(e=>rt(e)));if(!rt(s)||!s.is(o))return;const[i,a]=Ne(o,l,l),c=i[0][0],h=i[i.length-1][i[0].length-1],{startRow:d,startColumn:u}=a,g=d===c.startRow&&u===c.startColumn,f=d===h.startRow&&u===h.startColumn;return g?"first":f?"last":void 0}class et extends r{static getType(){return"table"}static clone(e){return new et(e.__key)}static importDOM(){return{table:e=>({conversion:nt,priority:1})}}static importJSON(e){return ot()}constructor(e){super(e)}exportJSON(){return{...super.exportJSON(),type:"table",version:1}}createDOM(t,n){const o=document.createElement("table");return e(o,t.theme.table),o}updateDOM(){return!1}exportDOM(e){return{...super.exportDOM(e),after:e=>{if(e){const t=e.cloneNode(),n=document.createElement("colgroup"),r=document.createElement("tbody");o(e)&&r.append(...e.children);const l=this.getFirstChildOrThrow();if(!ee(l))throw new Error("Expected to find row node.");const s=l.getChildrenSize();for(let e=0;e<s;e++){const e=document.createElement("col");n.append(e)}return t.replaceChildren(n,r),t}}}}canBeEmpty(){return!1}isShadowRoot(){return!0}getCordsFromCellNode(e,t){const{rows:n,domRows:o}=t;for(let t=0;t<n;t++){const n=o[t];if(null==n)continue;const r=n.findIndex((t=>{if(!t)return;const{elem:n}=t;return w(n)===e}));if(-1!==r)return{x:r,y:t}}throw new Error("Cell not found in table.")}getDOMCellFromCords(e,t,n){const{domRows:o}=n,r=o[t];if(null==r)return null;const l=r[e];return null==l?null:l}getDOMCellFromCordsOrThrow(e,t,n){const o=this.getDOMCellFromCords(e,t,n);if(!o)throw new Error("Cell not found at cords.");return o}getCellNodeFromCords(e,t,n){const o=this.getDOMCellFromCords(e,t,n);if(null==o)return null;const r=w(o.elem);return q(r)?r:null}getCellNodeFromCordsOrThrow(e,t,n){const o=this.getCellNodeFromCords(e,t,n);if(!o)throw new Error("Node at cords not TableCellNode.");return o}canSelectBefore(){return!0}canIndent(){return!1}}function tt(e,t){const n=e.getElementByKey(t.getKey());if(null==n)throw new Error("Table Element Not Found");return Be(n)}function nt(e){return{node:ot()}}function ot(){return c(new et)}function rt(e){return e instanceof et}export{Ne as $computeTableMap,Te as $computeTableMapSkipCellCheck,j as $createTableCellNode,ot as $createTableNode,re as $createTableNodeWithDimensions,Z as $createTableRowNode,Me as $createTableSelection,Se as $deleteTableColumn,_e as $deleteTableColumn__EXPERIMENTAL,Ce as $deleteTableRow__EXPERIMENTAL,je as $findCellNode,qe as $findTableNode,tt as $getElementForTableNode,xe as $getNodeTriplet,le as $getTableCellNodeFromLexicalNode,ve as $getTableCellNodeRect,ce as $getTableColumnIndexFromTableCellNode,ie as $getTableNodeFromLexicalNodeOrThrow,ae as $getTableRowIndexFromTableCellNode,se as $getTableRowNodeFromTableCellNodeOrThrow,me as $insertTableColumn,pe as $insertTableColumn__EXPERIMENTAL,ue as $insertTableRow,fe as $insertTableRow__EXPERIMENTAL,q as $isTableCellNode,rt as $isTableNode,ee as $isTableRowNode,Oe as $isTableSelection,de as $removeTableRowAtIndex,ye as $unmergeCell,G as INSERT_TABLE_COMMAND,Y as TableCellHeaderStates,J as TableCellNode,et as TableNode,Ke as TableObserver,Q as TableRowNode,Ae as applyTableHandlers,Pe as getDOMCellFromTarget,He as getTableObserverFromTableElement};
