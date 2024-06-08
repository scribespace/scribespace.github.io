/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var h=require("@lexical/utils"),u=require("lexical");let aa=/^(\d+(?:\.\d+)?)px$/,w={BOTH:3,COLUMN:2,NO_STATUS:0,ROW:1};
class x extends u.ElementNode{static getType(){return"tablecell"}static clone(a){let b=new x(a.__headerState,a.__colSpan,a.__width,a.__key);b.__rowSpan=a.__rowSpan;b.__backgroundColor=a.__backgroundColor;return b}static importDOM(){return{td:()=>({conversion:ba,priority:0}),th:()=>({conversion:ba,priority:0})}}static importJSON(a){let b=a.rowSpan||1,c=z(a.headerState,a.colSpan||1,a.width||void 0);c.__rowSpan=b;c.__backgroundColor=a.backgroundColor||null;return c}constructor(a=w.NO_STATUS,b=1,c,d){super(d);
this.__colSpan=b;this.__rowSpan=1;this.__headerState=a;this.__width=c;this.__backgroundColor=null}createDOM(a){let b=document.createElement(this.getTag());this.__width&&(b.style.width=`${this.__width}px`);1<this.__colSpan&&(b.colSpan=this.__colSpan);1<this.__rowSpan&&(b.rowSpan=this.__rowSpan);null!==this.__backgroundColor&&(b.style.backgroundColor=this.__backgroundColor);h.addClassNamesToElement(b,a.theme.tableCell,this.hasHeader()&&a.theme.tableCellHeader);return b}exportDOM(a){({element:a}=super.exportDOM(a));
if(a){var b=this.getParentOrThrow().getChildrenSize();a.style.border="1px solid black";1<this.__colSpan&&(a.colSpan=this.__colSpan);1<this.__rowSpan&&(a.rowSpan=this.__rowSpan);a.style.width=`${this.getWidth()||Math.max(90,700/b)}px`;a.style.verticalAlign="top";a.style.textAlign="start";b=this.getBackgroundColor();null!==b?a.style.backgroundColor=b:this.hasHeader()&&(a.style.backgroundColor="#f2f3f5")}return{element:a}}exportJSON(){return{...super.exportJSON(),backgroundColor:this.getBackgroundColor(),
colSpan:this.__colSpan,headerState:this.__headerState,rowSpan:this.__rowSpan,type:"tablecell",width:this.getWidth()}}getColSpan(){return this.__colSpan}setColSpan(a){this.getWritable().__colSpan=a;return this}getRowSpan(){return this.__rowSpan}setRowSpan(a){this.getWritable().__rowSpan=a;return this}getTag(){return this.hasHeader()?"th":"td"}setHeaderStyles(a){this.getWritable().__headerState=a;return this.__headerState}getHeaderStyles(){return this.getLatest().__headerState}setWidth(a){this.getWritable().__width=
a;return this.__width}getWidth(){return this.getLatest().__width}getBackgroundColor(){return this.getLatest().__backgroundColor}setBackgroundColor(a){this.getWritable().__backgroundColor=a}toggleHeaderStyle(a){let b=this.getWritable();b.__headerState=(b.__headerState&a)===a?b.__headerState-a:b.__headerState+a;return b}hasHeaderState(a){return(this.getHeaderStyles()&a)===a}hasHeader(){return this.getLatest().__headerState!==w.NO_STATUS}updateDOM(a){return a.__headerState!==this.__headerState||a.__width!==
this.__width||a.__colSpan!==this.__colSpan||a.__rowSpan!==this.__rowSpan||a.__backgroundColor!==this.__backgroundColor}isShadowRoot(){return!0}collapseAtStart(){return!0}canBeEmpty(){return!1}canIndent(){return!1}}
function ba(a){var b=a.nodeName.toLowerCase(),c=void 0;aa.test(a.style.width)&&(c=parseFloat(a.style.width));b=z("th"===b?w.ROW:w.NO_STATUS,a.colSpan,c);b.__rowSpan=a.rowSpan;c=a.style.backgroundColor;""!==c&&(b.__backgroundColor=c);a=a.style;c=a.textDecoration.split(" ");let d="700"===a.fontWeight||"bold"===a.fontWeight,e=c.includes("line-through"),g="italic"===a.fontStyle,f=c.includes("underline");return{after:m=>{0===m.length&&m.push(u.$createParagraphNode());return m},forChild:(m,q)=>{if(A(q)&&
!u.$isElementNode(m)){q=u.$createParagraphNode();if(u.$isLineBreakNode(m)&&"\n"===m.getTextContent())return null;u.$isTextNode(m)&&(d&&m.toggleFormat("bold"),e&&m.toggleFormat("strikethrough"),g&&m.toggleFormat("italic"),f&&m.toggleFormat("underline"));q.append(m);return q}return m},node:b}}function z(a,b=1,c){return u.$applyNodeReplacement(new x(a,b,c))}function A(a){return a instanceof x}let ca=u.createCommand("INSERT_TABLE_COMMAND");
class C extends u.ElementNode{static getType(){return"tablerow"}static clone(a){return new C(a.__height,a.__key)}static importDOM(){return{tr:()=>({conversion:da,priority:0})}}static importJSON(a){return D(a.height)}constructor(a,b){super(b);this.__height=a}exportJSON(){return{...super.exportJSON(),...(this.getHeight()&&{height:this.getHeight()}),type:"tablerow",version:1}}createDOM(a){let b=document.createElement("tr");this.__height&&(b.style.height=`${this.__height}px`);h.addClassNamesToElement(b,
a.theme.tableRow);return b}isShadowRoot(){return!0}setHeight(a){this.getWritable().__height=a;return this.__height}getHeight(){return this.getLatest().__height}updateDOM(a){return a.__height!==this.__height}canBeEmpty(){return!1}canIndent(){return!1}}function da(a){let b=void 0;aa.test(a.style.height)&&(b=parseFloat(a.style.height));return{node:D(b)}}function D(a){return u.$applyNodeReplacement(new C(a))}function H(a){return a instanceof C}var J;
function K(a){let b=new URLSearchParams;b.append("code",a);for(let c=1;c<arguments.length;c++)b.append("v",arguments[c]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${b} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}J=K&&K.__esModule&&Object.prototype.hasOwnProperty.call(K,"default")?K["default"]:K;let ea="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement;
function ia(a){a=h.$findMatchingParent(a,b=>H(b));if(H(a))return a;throw Error("Expected table cell to be inside of table row.");}function ja(a){a=h.$findMatchingParent(a,b=>N(b));if(N(a))return a;throw Error("Expected table cell to be inside of table.");}function ka(a,b){let c=ja(a),{x:d,y:e}=c.getCordsFromCellNode(a,b);return{above:c.getCellNodeFromCords(d,e-1,b),below:c.getCellNodeFromCords(d,e+1,b),left:c.getCellNodeFromCords(d-1,e,b),right:c.getCellNodeFromCords(d+1,e,b)}}
let la=(a,b)=>a===w.BOTH||a===b?b:w.NO_STATUS;function O(a){let b=a.getFirstDescendant();null==b?a.selectStart():b.getParentOrThrow().selectStart()}function ma(a,b){let c=a.getFirstChild();null!==c?c.insertBefore(b):a.append(b)}function P(a,b,c){let [d,e,g]=na(a,b,c);null===e&&J(122);null===g&&J(123);return[d,e,g]}
function na(a,b,c){let d=[],e=null,g=null;a=a.getChildren();for(let t=0;t<a.length;t++){var f=a[t];H(f)||J(124);var m=f.getChildren();f=0;for(let k of m){for(A(k)||J(125);void 0!==d[t]&&void 0!==d[t][f];)f++;m=t;var q=f,r=k;let l={cell:r,startColumn:q,startRow:m},n=r.__rowSpan,p=r.__colSpan;for(let v=0;v<n;v++){void 0===d[m+v]&&(d[m+v]=[]);for(let y=0;y<p;y++)d[m+v][q+y]=l}null!==b&&b.is(r)&&(e=l);null!==c&&c.is(r)&&(g=l);f+=k.__colSpan}}return[d,e,g]}
function Q(a){a instanceof x||("__type"in a?(a=h.$findMatchingParent(a,A),A(a)||J(126)):(a=h.$findMatchingParent(a.getNode(),A),A(a)||J(126)));let b=a.getParent();H(b)||J(127);let c=b.getParent();N(c)||J(128);return[a,b,c]}
function oa(a){let [b,,c]=Q(a);a=c.getChildren();let d=a.length;var e=a[0].getChildren().length;let g=Array(d);for(var f=0;f<d;f++)g[f]=Array(e);for(e=0;e<d;e++){f=a[e].getChildren();let m=0;for(let q=0;q<f.length;q++){for(;g[e][m];)m++;let r=f[q],t=r.__rowSpan||1,k=r.__colSpan||1;for(let l=0;l<t;l++)for(let n=0;n<k;n++)g[e+l][m+n]=r;if(b===r)return{colSpan:k,columnIndex:m,rowIndex:e,rowSpan:t};m+=k}}return null}
class pa{constructor(a,b,c){this.anchor=b;this.focus=c;b._selection=this;c._selection=this;this._cachedNodes=null;this.dirty=!1;this.tableKey=a}getStartEndPoints(){return[this.anchor,this.focus]}isBackward(){return this.focus.isBefore(this.anchor)}getCachedNodes(){return this._cachedNodes}setCachedNodes(a){this._cachedNodes=a}is(a){return R(a)?this.tableKey===a.tableKey&&this.anchor.is(a.anchor)&&this.focus.is(a.focus):!1}set(a,b,c){this.dirty=!0;this.tableKey=a;this.anchor.key=b;this.focus.key=c;
this._cachedNodes=null}clone(){return new pa(this.tableKey,this.anchor,this.focus)}isCollapsed(){return!1}extract(){return this.getNodes()}insertRawText(){}insertText(){}insertNodes(a){let b=this.focus.getNode();u.$isElementNode(b)||J(103);u.$normalizeSelection__EXPERIMENTAL(b.select(0,b.getChildrenSize())).insertNodes(a)}getShape(){var a=u.$getNodeByKey(this.anchor.key);A(a)||J(104);a=oa(a);null===a&&J(105);var b=u.$getNodeByKey(this.focus.key);A(b)||J(106);let c=oa(b);null===c&&J(107);b=Math.min(a.columnIndex,
c.columnIndex);let d=Math.max(a.columnIndex,c.columnIndex),e=Math.min(a.rowIndex,c.rowIndex);a=Math.max(a.rowIndex,c.rowIndex);return{fromX:Math.min(b,d),fromY:Math.min(e,a),toX:Math.max(b,d),toY:Math.max(e,a)}}getNodes(){function a(v){let {cell:y,startColumn:B,startRow:E}=v;q=Math.min(q,B);r=Math.min(r,E);t=Math.max(t,B+y.__colSpan-1);k=Math.max(k,E+y.__rowSpan-1)}var b=this._cachedNodes;if(null!==b)return b;var c=this.anchor.getNode();b=this.focus.getNode();var d=h.$findMatchingParent(c,A);c=h.$findMatchingParent(b,
A);A(d)||J(104);A(c)||J(106);b=d.getParent();H(b)||J(108);b=b.getParent();N(b)||J(109);var e=c.getParents()[1];if(e!==b)return b.isParentOf(c)?(b=e.getParent(),null==b&&J(111),this.set(this.tableKey,c.getKey(),b.getKey())):(b=b.getParent(),null==b&&J(110),this.set(this.tableKey,b.getKey(),c.getKey())),this.getNodes();let [g,f,m]=P(b,d,c),q=Math.min(f.startColumn,m.startColumn),r=Math.min(f.startRow,m.startRow),t=Math.max(f.startColumn+f.cell.__colSpan-1,m.startColumn+m.cell.__colSpan-1),k=Math.max(f.startRow+
f.cell.__rowSpan-1,m.startRow+m.cell.__rowSpan-1);c=q;d=r;e=q;for(var l=r;q<c||r<d||t>e||k>l;){if(q<c){var n=l-d;--c;for(var p=0;p<=n;p++)a(g[d+p][c])}if(r<d)for(n=e-c,--d,p=0;p<=n;p++)a(g[d][c+p]);if(t>e)for(n=l-d,e+=1,p=0;p<=n;p++)a(g[d+p][e]);if(k>l)for(n=e-c,l+=1,p=0;p<=n;p++)a(g[l][c+p])}b=[b];c=null;for(d=r;d<=k;d++)for(e=q;e<=t;e++)({cell:l}=g[d][e]),n=l.getParent(),H(n)||J(112),n!==c&&b.push(n),b.push(l,...qa(l)),c=n;u.isCurrentlyReadOnlyMode()||(this._cachedNodes=b);return b}getTextContent(){let a=
this.getNodes(),b="";for(let c=0;c<a.length;c++)b+=a[c].getTextContent();return b}}function R(a){return a instanceof pa}function ra(){let a=u.$createPoint("root",0,"element"),b=u.$createPoint("root",0,"element");return new pa("root",a,b)}function qa(a){let b=[],c=[a];for(;0<c.length;){let d=c.pop();void 0===d&&J(113);u.$isElementNode(d)&&c.unshift(...d.getChildren());d!==a&&b.push(d)}return b}
class sa{constructor(a,b){this.isHighlightingCells=!1;this.focusY=this.focusX=this.anchorY=this.anchorX=-1;this.listenersToRemove=new Set;this.tableNodeKey=b;this.editor=a;this.table={columns:0,domRows:[],rows:0};this.focusCell=this.anchorCell=this.focusCellNodeKey=this.anchorCellNodeKey=this.tableSelection=null;this.hasHijackedSelectionStyles=!1;this.trackTable();this.isSelecting=!1}getTable(){return this.table}removeListeners(){Array.from(this.listenersToRemove).forEach(a=>a())}trackTable(){let a=
new MutationObserver(b=>{this.editor.update(()=>{var c=!1;for(let d=0;d<b.length;d++){const e=b[d].target.nodeName;if("TABLE"===e||"TBODY"===e||"THEAD"===e||"TR"===e){c=!0;break}}if(c){c=this.editor.getElementByKey(this.tableNodeKey);if(!c)throw Error("Expected to find TableElement in DOM");this.table=S(c)}})});this.editor.update(()=>{let b=this.editor.getElementByKey(this.tableNodeKey);if(!b)throw Error("Expected to find TableElement in DOM");this.table=S(b);a.observe(b,{childList:!0,subtree:!0})})}clearHighlight(){let a=
this.editor;this.isHighlightingCells=!1;this.focusY=this.focusX=this.anchorY=this.anchorX=-1;this.focusCell=this.anchorCell=this.focusCellNodeKey=this.anchorCellNodeKey=this.tableSelection=null;this.hasHijackedSelectionStyles=!1;this.enableHighlightStyle();a.update(()=>{var b=u.$getNodeByKey(this.tableNodeKey);if(!N(b))throw Error("Expected TableNode.");b=a.getElementByKey(this.tableNodeKey);if(!b)throw Error("Expected to find TableElement in DOM");b=S(b);ta(a,b,null);u.$setSelection(null);a.dispatchCommand(u.SELECTION_CHANGE_COMMAND,
void 0)})}enableHighlightStyle(){let a=this.editor;a.update(()=>{let b=a.getElementByKey(this.tableNodeKey);if(!b)throw Error("Expected to find TableElement in DOM");h.removeClassNamesFromElement(b,a._config.theme.tableSelection);b.classList.remove("disable-selection");this.hasHijackedSelectionStyles=!1})}disableHighlightStyle(){let a=this.editor;a.update(()=>{let b=a.getElementByKey(this.tableNodeKey);if(!b)throw Error("Expected to find TableElement in DOM");h.addClassNamesToElement(b,a._config.theme.tableSelection);
this.hasHijackedSelectionStyles=!0})}updateTableTableSelection(a){if(null!==a&&a.tableKey===this.tableNodeKey){let b=this.editor;this.tableSelection=a;this.isHighlightingCells=!0;this.disableHighlightStyle();ta(b,this.table,this.tableSelection)}else null==a?this.clearHighlight():(this.tableNodeKey=a.tableKey,this.updateTableTableSelection(a))}setFocusCellForSelection(a,b=!1){let c=this.editor;c.update(()=>{var d=u.$getNodeByKey(this.tableNodeKey);if(!N(d))throw Error("Expected TableNode.");if(!c.getElementByKey(this.tableNodeKey))throw Error("Expected to find TableElement in DOM");
var e=a.x;let g=a.y;this.focusCell=a;if(null!==this.anchorCell){let f=ea?(c._window||window).getSelection():null;f&&f.setBaseAndExtent(this.anchorCell.elem,0,this.focusCell.elem,0)}if(!this.isHighlightingCells&&(this.anchorX!==e||this.anchorY!==g||b))this.isHighlightingCells=!0,this.disableHighlightStyle();else if(e===this.focusX&&g===this.focusY)return;this.focusX=e;this.focusY=g;this.isHighlightingCells&&(e=u.$getNearestNodeFromDOMNode(a.elem),null!=this.tableSelection&&null!=this.anchorCellNodeKey&&
A(e)&&d.is(T(e))&&(d=e.getKey(),this.tableSelection=this.tableSelection.clone()||ra(),this.focusCellNodeKey=d,this.tableSelection.set(this.tableNodeKey,this.anchorCellNodeKey,this.focusCellNodeKey),u.$setSelection(this.tableSelection),c.dispatchCommand(u.SELECTION_CHANGE_COMMAND,void 0),ta(c,this.table,this.tableSelection)))})}setAnchorCellForSelection(a){this.isHighlightingCells=!1;this.anchorCell=a;this.anchorX=a.x;this.anchorY=a.y;this.editor.update(()=>{var b=u.$getNearestNodeFromDOMNode(a.elem);
A(b)&&(b=b.getKey(),this.tableSelection=null!=this.tableSelection?this.tableSelection.clone():ra(),this.anchorCellNodeKey=b)})}formatCells(a){this.editor.update(()=>{let b=u.$getSelection();R(b)||J(129);let c=u.$createRangeSelection(),d=c.anchor,e=c.focus;b.getNodes().forEach(g=>{A(g)&&0!==g.getTextContentSize()&&(d.set(g.getKey(),0,"element"),e.set(g.getKey(),g.getChildrenSize(),"element"),c.formatText(a))});u.$setSelection(b);this.editor.dispatchCommand(u.SELECTION_CHANGE_COMMAND,void 0)})}clearText(){let a=
this.editor;a.update(()=>{let b=u.$getNodeByKey(this.tableNodeKey);if(!N(b))throw Error("Expected TableNode.");var c=u.$getSelection();R(c)||J(129);c=c.getNodes().filter(A);c.length===this.table.columns*this.table.rows?(b.selectPrevious(),b.remove(),u.$getRoot().selectStart()):(c.forEach(d=>{if(u.$isElementNode(d)){let e=u.$createParagraphNode(),g=u.$createTextNode();e.append(g);d.append(e);d.getChildren().forEach(f=>{f!==e&&f.remove()})}}),ta(a,this.table,null),u.$setSelection(null),a.dispatchCommand(u.SELECTION_CHANGE_COMMAND,
void 0))})}}function ua(a){for(;null!=a;){let b=a.nodeName;if("TD"===b||"TH"===b){a=a._cell;if(void 0===a)break;return a}a=a.parentNode}return null}
function S(a){let b=[],c={columns:0,domRows:b,rows:0};var d=a.firstChild;let e=a=0;for(b.length=0;null!=d;){var g=d.nodeName;if("TD"===g||"TH"===g){g=d;g={elem:g,hasBackgroundColor:""!==g.style.backgroundColor,highlighted:!1,x:a,y:e};d._cell=g;let f=b[e];void 0===f&&(f=b[e]=[]);f[a]=g}else if(g=d.firstChild,null!=g){d=g;continue}g=d.nextSibling;if(null!=g)a++,d=g;else if(g=d.parentNode,null!=g){d=g.nextSibling;if(null==d)break;e++;a=0}}c.columns=a+1;c.rows=e+1;return c}
function ta(a,b,c){let d=new Set(c?c.getNodes():[]);va(b,(e,g)=>{let f=e.elem;d.has(g)?(e.highlighted=!0,wa(a,e)):(e.highlighted=!1,xa(a,e),f.getAttribute("style")||f.removeAttribute("style"))})}function va(a,b){({domRows:a}=a);for(let c=0;c<a.length;c++){let d=a[c];if(d)for(let e=0;e<d.length;e++){let g=d[e];if(!g)continue;let f=u.$getNearestNodeFromDOMNode(g.elem);null!==f&&b(g,f,{x:e,y:c})}}}function ya(a,b){b.disableHighlightStyle();va(b.table,c=>{c.highlighted=!0;wa(a,c)})}
function za(a,b){b.enableHighlightStyle();va(b.table,c=>{let d=c.elem;c.highlighted=!1;xa(a,c);d.getAttribute("style")||d.removeAttribute("style")})}
let Aa=(a,b,c,d,e)=>{const g="forward"===e;switch(e){case "backward":case "forward":return c!==(g?a.table.columns-1:0)?(a=b.getCellNodeFromCordsOrThrow(c+(g?1:-1),d,a.table),g?a.selectStart():a.selectEnd()):d!==(g?a.table.rows-1:0)?(a=b.getCellNodeFromCordsOrThrow(g?0:a.table.columns-1,d+(g?1:-1),a.table),g?a.selectStart():a.selectEnd()):g?b.selectNext():b.selectPrevious(),!0;case "up":return 0!==d?b.getCellNodeFromCordsOrThrow(c,d-1,a.table).selectEnd():b.selectPrevious(),!0;case "down":return d!==
a.table.rows-1?b.getCellNodeFromCordsOrThrow(c,d+1,a.table).selectStart():b.selectNext(),!0;default:return!1}},Ba=(a,b,c,d,e)=>{const g="forward"===e;switch(e){case "backward":case "forward":return c!==(g?a.table.columns-1:0)&&a.setFocusCellForSelection(b.getDOMCellFromCordsOrThrow(c+(g?1:-1),d,a.table)),!0;case "up":return 0!==d?(a.setFocusCellForSelection(b.getDOMCellFromCordsOrThrow(c,d-1,a.table)),!0):!1;case "down":return d!==a.table.rows-1?(a.setFocusCellForSelection(b.getDOMCellFromCordsOrThrow(c,
d+1,a.table)),!0):!1;default:return!1}};function U(a,b){if(u.$isRangeSelection(a)||R(a)){let c=b.isParentOf(a.anchor.getNode());a=b.isParentOf(a.focus.getNode());return c&&a}return!1}
function wa(a,b){a=b.elem;b=u.$getNearestNodeFromDOMNode(a);A(b)||J(102);null===b.getBackgroundColor()?a.style.setProperty("background-color","rgb(172,206,247)"):a.style.setProperty("background-image","linear-gradient(to right, rgba(172,206,247,0.85), rgba(172,206,247,0.85))");a.style.setProperty("caret-color","transparent")}
function xa(a,b){a=b.elem;b=u.$getNearestNodeFromDOMNode(a);A(b)||J(102);null===b.getBackgroundColor()&&a.style.removeProperty("background-color");a.style.removeProperty("background-image");a.style.removeProperty("caret-color")}function Da(a){a=h.$findMatchingParent(a,A);return A(a)?a:null}function T(a){a=h.$findMatchingParent(a,N);return N(a)?a:null}
function V(a,b,c,d,e){if(("up"===c||"down"===c)&&Ea(a))return!1;var g=u.$getSelection();if(!U(g,d)){if("backward"===c&&u.$isRangeSelection(g)&&g.isCollapsed()){c=g.anchor.type;d=g.anchor.offset;if("element"!==c&&("text"!==c||0!==d))return!1;c=g.anchor.getNode();if(!c)return!1;c=h.$findMatchingParent(c,r=>u.$isElementNode(r)&&!r.isInline());if(!c)return!1;c=c.getPreviousSibling();if(!c||!N(c))return!1;Z(b);c.selectEnd();return!0}return!1}if(u.$isRangeSelection(g)&&g.isCollapsed()){let {anchor:r,focus:t}=
g;var f=h.$findMatchingParent(r.getNode(),A),m=h.$findMatchingParent(t.getNode(),A);if(!A(f)||!f.is(m))return!1;m=T(f);if(m!==d&&null!=m){var q=a.getElementByKey(m.getKey());if(null!=q)return e.table=S(q),V(a,b,c,m,e)}if("backward"===c||"forward"===c){e=r.type;a=r.offset;f=r.getNode();if(!f)return!1;g=g.getNodes();return 1===g.length&&u.$isDecoratorNode(g[0])?!1:Fa(e,a,f,c)?Ga(b,f,d,c):!1}g=a.getElementByKey(f.__key);m=a.getElementByKey(r.key);if(null==m||null==g)return!1;if("element"===r.type)g=
m.getBoundingClientRect();else{g=window.getSelection();if(null===g||0===g.rangeCount)return!1;g=g.getRangeAt(0).getBoundingClientRect()}m="up"===c?f.getFirstChild():f.getLastChild();if(null==m)return!1;a=a.getElementByKey(m.__key);if(null==a)return!1;a=a.getBoundingClientRect();if("up"===c?a.top>g.top-g.height:g.bottom+g.height>a.bottom){Z(b);g=d.getCordsFromCellNode(f,e.table);if(b.shiftKey)b=d.getDOMCellFromCordsOrThrow(g.x,g.y,e.table),e.setAnchorCellForSelection(b),e.setFocusCellForSelection(b,
!0);else return Aa(e,d,g.x,g.y,c);return!0}}else if(R(g)){let {anchor:r,focus:t}=g;q=h.$findMatchingParent(r.getNode(),A);m=h.$findMatchingParent(t.getNode(),A);[f]=g.getNodes();a=a.getElementByKey(f.getKey());if(!A(q)||!A(m)||!N(f)||null==a)return!1;e.updateTableTableSelection(g);g=S(a);a=d.getCordsFromCellNode(q,g);a=d.getDOMCellFromCordsOrThrow(a.x,a.y,g);e.setAnchorCellForSelection(a);Z(b);if(b.shiftKey)return b=d.getCordsFromCellNode(m,g),Ba(e,f,b.x,b.y,c);m.selectEnd();return!0}return!1}
function Z(a){a.preventDefault();a.stopImmediatePropagation();a.stopPropagation()}function Ea(a){return(a=a.getRootElement())?a.hasAttribute("aria-controls")&&"typeahead-menu"===a.getAttribute("aria-controls"):!1}function Fa(a,b,c,d){return"element"===a&&("backward"===d?null===c.getPreviousSibling():null===c.getNextSibling())||Ha(a,b,c,d)}
function Ha(a,b,c,d){let e=h.$findMatchingParent(c,g=>u.$isElementNode(g)&&!g.isInline());if(!e)return!1;b="backward"===d?0===b:b===c.getTextContentSize();return"text"===a&&b&&("backward"===d?null===e.getPreviousSibling():null===e.getNextSibling())}
function Ga(a,b,c,d){var e=h.$findMatchingParent(b,A);if(!A(e))return!1;let [g,f]=P(c,e,e);e=g[0][0];let m=g[g.length-1][g[0].length-1],{startColumn:q,startRow:r}=f;if("backward"===d?q!==e.startColumn||r!==e.startRow:q!==m.startColumn||r!==m.startRow)return!1;b=Ia(b,d,c);if(!b||N(b))return!1;Z(a);"backward"===d?b.selectEnd():b.selectStart();return!0}
function Ia(a,b,c){if(a=h.$findMatchingParent(a,d=>u.$isElementNode(d)&&!d.isInline()))return(a="backward"===b?a.getPreviousSibling():a.getNextSibling())&&N(a)?a:"backward"===b?c.getPreviousSibling():c.getNextSibling()}function Ja(a,b,c){let d=u.$createParagraphNode();"first"===a?b.insertBefore(d):b.insertAfter(d);d.append(...(c||[]));d.selectEnd()}
function Ka(a,b,c){var d=c.getParent();if(d&&(a=a.getElementByKey(d.getKey()))&&(d=window.getSelection())&&d.anchorNode===a&&(b=h.$findMatchingParent(b.anchor.getNode(),q=>A(q)))&&(a=h.$findMatchingParent(b,q=>N(q)),N(a)&&a.is(c))){var [e,g]=P(c,b,b);c=e[0][0];b=e[e.length-1][e[0].length-1];var {startRow:f,startColumn:m}=g;if(f===c.startRow&&m===c.startColumn)return"first";if(f===b.startRow&&m===b.startColumn)return"last"}}
class La extends u.ElementNode{static getType(){return"table"}static clone(a){return new La(a.__key)}static importDOM(){return{table:()=>({conversion:Ma,priority:1})}}static importJSON(){return Na()}constructor(a){super(a)}exportJSON(){return{...super.exportJSON(),type:"table",version:1}}createDOM(a){let b=document.createElement("table");h.addClassNamesToElement(b,a.theme.table);return b}updateDOM(){return!1}exportDOM(a){return{...super.exportDOM(a),after:b=>{if(b){let c=b.cloneNode(),d=document.createElement("colgroup"),
e=document.createElement("tbody");h.isHTMLElement(b)&&e.append(...b.children);b=this.getFirstChildOrThrow();if(!H(b))throw Error("Expected to find row node.");b=b.getChildrenSize();for(let g=0;g<b;g++){let f=document.createElement("col");d.append(f)}c.replaceChildren(d,e);return c}}}}canBeEmpty(){return!1}isShadowRoot(){return!0}getCordsFromCellNode(a,b){let {rows:c,domRows:d}=b;for(b=0;b<c;b++){var e=d[b];if(null!=e&&(e=e.findIndex(g=>{if(g)return{elem:g}=g,u.$getNearestNodeFromDOMNode(g)===a}),
-1!==e))return{x:e,y:b}}throw Error("Cell not found in table.");}getDOMCellFromCords(a,b,c){({domRows:c}=c);b=c[b];if(null==b)return null;a=b[a];return null==a?null:a}getDOMCellFromCordsOrThrow(a,b,c){a=this.getDOMCellFromCords(a,b,c);if(!a)throw Error("Cell not found at cords.");return a}getCellNodeFromCords(a,b,c){a=this.getDOMCellFromCords(a,b,c);if(null==a)return null;a=u.$getNearestNodeFromDOMNode(a.elem);return A(a)?a:null}getCellNodeFromCordsOrThrow(a,b,c){a=this.getCellNodeFromCords(a,b,c);
if(!a)throw Error("Node at cords not TableCellNode.");return a}canSelectBefore(){return!0}canIndent(){return!1}}function Ma(){return{node:Na()}}function Na(){return u.$applyNodeReplacement(new La)}function N(a){return a instanceof La}exports.$computeTableMap=P;exports.$computeTableMapSkipCellCheck=na;exports.$createTableCellNode=z;exports.$createTableNode=Na;
exports.$createTableNodeWithDimensions=function(a,b,c=!0){let d=Na();for(let g=0;g<a;g++){let f=D();for(let m=0;m<b;m++){var e=w.NO_STATUS;"object"===typeof c?(0===g&&c.rows&&(e|=w.ROW),0===m&&c.columns&&(e|=w.COLUMN)):c&&(0===g&&(e|=w.ROW),0===m&&(e|=w.COLUMN));e=z(e);let q=u.$createParagraphNode();q.append(u.$createTextNode());e.append(q);f.append(e)}d.append(f)}return d};exports.$createTableRowNode=D;exports.$createTableSelection=ra;
exports.$deleteTableColumn=function(a,b){let c=a.getChildren();for(let e=0;e<c.length;e++){var d=c[e];if(H(d)){d=d.getChildren();if(b>=d.length||0>b)throw Error("Table column target index out of range");d[b].remove()}}return a};
exports.$deleteTableColumn__EXPERIMENTAL=function(){var a=u.$getSelection();u.$isRangeSelection(a)||R(a)||J(115);var b=a.anchor.getNode();a=a.focus.getNode();let [c,,d]=Q(b);[b]=Q(a);let [e,g,f]=P(d,c,b);var {startColumn:m}=g;let {startRow:q,startColumn:r}=f;a=Math.min(m,r);m=Math.max(m+c.__colSpan-1,r+b.__colSpan-1);let t=m-a+1;if(e[0].length===m-a+1)d.selectPrevious(),d.remove();else{var k=e.length;for(let l=0;l<k;l++)for(let n=a;n<=m;n++){let {cell:p,startColumn:v}=e[l][n];v<a?n===a&&p.setColSpan(p.__colSpan-
Math.min(t,p.__colSpan-(a-v))):v+p.__colSpan-1>m?n===m&&p.setColSpan(p.__colSpan-(m-v+1)):p.remove()}a=e[q];b=a[r+b.__colSpan];void 0!==b?({cell:b}=b,O(b)):({cell:b}=a[r-1],O(b))}};
exports.$deleteTableRow__EXPERIMENTAL=function(){var a=u.$getSelection();u.$isRangeSelection(a)||R(a)||J(115);var b=a.anchor.getNode();a=a.focus.getNode();let [c,,d]=Q(b);[a]=Q(a);let [e,g,f]=P(d,c,a);({startRow:b}=g);var {startRow:m}=f;a=m+a.__rowSpan-1;if(e.length===a-b+1)d.remove();else{m=e[0].length;var q=e[a+1],r=d.getChildAtIndex(a+1);for(let k=a;k>=b;k--){for(var t=m-1;0<=t;t--){let {cell:l,startRow:n,startColumn:p}=e[k][t];if(p===t&&(k===b&&n<b&&l.setRowSpan(l.__rowSpan-(n-b)),n>=b&&n+l.__rowSpan-
1>a))if(l.setRowSpan(l.__rowSpan-(a-n+1)),null===r&&J(119),0===t)ma(r,l);else{let {cell:v}=q[t-1];v.insertAfter(l)}}t=d.getChildAtIndex(k);H(t)||J(120,String(k));t.remove()}void 0!==q?({cell:b}=q[0],O(b)):({cell:b}=e[b-1][0],O(b))}};exports.$findCellNode=Da;exports.$findTableNode=T;exports.$getElementForTableNode=function(a,b){a=a.getElementByKey(b.getKey());if(null==a)throw Error("Table Element Not Found");return S(a)};exports.$getNodeTriplet=Q;
exports.$getTableCellNodeFromLexicalNode=function(a){a=h.$findMatchingParent(a,b=>A(b));return A(a)?a:null};exports.$getTableCellNodeRect=oa;exports.$getTableColumnIndexFromTableCellNode=function(a){return ia(a).getChildren().findIndex(b=>b.is(a))};exports.$getTableNodeFromLexicalNodeOrThrow=ja;exports.$getTableRowIndexFromTableCellNode=function(a){let b=ia(a);return ja(b).getChildren().findIndex(c=>c.is(b))};exports.$getTableRowNodeFromTableCellNodeOrThrow=ia;
exports.$insertTableColumn=function(a,b,c=!0,d,e){let g=a.getChildren(),f=[];for(let r=0;r<g.length;r++){let t=g[r];if(H(t))for(let k=0;k<d;k++){var m=t.getChildren();if(b>=m.length||0>b)throw Error("Table column target index out of range");m=m[b];A(m)||J(114);let {left:l,right:n}=ka(m,e);var q=w.NO_STATUS;if(l&&l.hasHeaderState(w.ROW)||n&&n.hasHeaderState(w.ROW))q|=w.ROW;q=z(q);q.append(u.$createParagraphNode());f.push({newTableCell:q,targetCell:m})}}f.forEach(({newTableCell:r,targetCell:t})=>{c?
t.insertAfter(r):t.insertBefore(r)});return a};
exports.$insertTableColumn__EXPERIMENTAL=function(a=!0){function b(k=w.NO_STATUS){k=z(k).append(u.$createParagraphNode());null===r&&(r=k);return k}var c=u.$getSelection();u.$isRangeSelection(c)||R(c)||J(115);var d=c.anchor.getNode();c=c.focus.getNode();[d]=Q(d);let [e,,g]=Q(c),[f,m,q]=P(g,e,d);d=f.length;c=a?Math.max(m.startColumn,q.startColumn):Math.min(m.startColumn,q.startColumn);a=a?c+e.__colSpan-1:c-1;c=g.getFirstChild();H(c)||J(117);let r=null;var t=c;a:for(c=0;c<d;c++){0!==c&&(t=t.getNextSibling(),
H(t)||J(118));let k=f[c],l=la(k[0>a?0:a].cell.__headerState,w.ROW);if(0>a){ma(t,b(l));continue}let {cell:n,startColumn:p,startRow:v}=k[a];if(p+n.__colSpan-1<=a){let y=n,B=v,E=a;for(;B!==c&&1<y.__rowSpan;)if(E-=n.__colSpan,0<=E){let {cell:F,startRow:G}=k[E];y=F;B=G}else{t.append(b(l));continue a}y.insertAfter(b(l))}else n.setColSpan(n.__colSpan+1)}null!==r&&O(r)};
exports.$insertTableRow=function(a,b,c=!0,d,e){var g=a.getChildren();if(b>=g.length||0>b)throw Error("Table row target index out of range");b=g[b];if(H(b))for(g=0;g<d;g++){let m=b.getChildren(),q=m.length,r=D();for(let t=0;t<q;t++){var f=m[t];A(f)||J(114);let {above:k,below:l}=ka(f,e);f=w.NO_STATUS;let n=k&&k.getWidth()||l&&l.getWidth()||void 0;if(k&&k.hasHeaderState(w.COLUMN)||l&&l.hasHeaderState(w.COLUMN))f|=w.COLUMN;f=z(f,1,n);f.append(u.$createParagraphNode());r.append(f)}c?b.insertAfter(r):b.insertBefore(r)}else throw Error("Row before insertion index does not exist.");
return a};
exports.$insertTableRow__EXPERIMENTAL=function(a=!0){var b=u.$getSelection();u.$isRangeSelection(b)||R(b)||J(115);b=b.focus.getNode();let [c,,d]=Q(b),[e,g]=P(d,c,c);b=e[0].length;var {startRow:f}=g;if(a){a=f+c.__rowSpan-1;var m=e[a];f=D();for(var q=0;q<b;q++){let {cell:t,startRow:k}=m[q];if(k+t.__rowSpan-1<=a){var r=la(m[q].cell.__headerState,w.COLUMN);f.append(z(r).append(u.$createParagraphNode()))}else t.setRowSpan(t.__rowSpan+1)}b=d.getChildAtIndex(a);H(b)||J(116);b.insertAfter(f)}else{m=e[f];
a=D();for(q=0;q<b;q++){let {cell:t,startRow:k}=m[q];k===f?(r=la(m[q].cell.__headerState,w.COLUMN),a.append(z(r).append(u.$createParagraphNode()))):t.setRowSpan(t.__rowSpan+1)}b=d.getChildAtIndex(f);H(b)||J(116);b.insertBefore(a)}};exports.$isTableCellNode=A;exports.$isTableNode=N;exports.$isTableRowNode=H;exports.$isTableSelection=R;exports.$removeTableRowAtIndex=function(a,b){let c=a.getChildren();if(b>=c.length||0>b)throw Error("Expected table cell to be inside of table row.");c[b].remove();return a};
exports.$unmergeCell=function(){var a=u.$getSelection();u.$isRangeSelection(a)||R(a)||J(115);a=a.anchor.getNode();let [b,c,d]=Q(a);a=b.__colSpan;let e=b.__rowSpan;if(1<a){for(var g=1;g<a;g++)b.insertAfter(z(w.NO_STATUS));b.setColSpan(1)}if(1<e){let [q,r]=P(d,b,b),{startColumn:t,startRow:k}=r,l;for(g=1;g<e;g++){var f=k+g;let n=q[f];l=(l||c).getNextSibling();H(l)||J(121);var m=null;for(let p=0;p<t;p++){let v=n[p],y=v.cell;v.startRow===f&&(m=y);1<y.__colSpan&&(p+=y.__colSpan-1)}if(null===m)for(m=0;m<
a;m++)ma(l,z(w.NO_STATUS));else for(f=0;f<a;f++)m.insertAfter(z(w.NO_STATUS))}b.setRowSpan(1)}};exports.INSERT_TABLE_COMMAND=ca;exports.TableCellHeaderStates=w;exports.TableCellNode=x;exports.TableNode=La;exports.TableObserver=sa;exports.TableRowNode=C;
exports.applyTableHandlers=function(a,b,c,d){function e(k){k=a.getCordsFromCellNode(k,f.table);return a.getDOMCellFromCordsOrThrow(k.x,k.y,f.table)}let g=c.getRootElement();if(null===g)throw Error("No root element.");let f=new sa(c,a.getKey()),m=c._window||window;b.__lexicalTableSelection=f;let q=()=>{const k=()=>{f.isSelecting=!1;m.removeEventListener("mouseup",k);m.removeEventListener("mousemove",l)},l=n=>{setTimeout(()=>{if(1!==(n.buttons&1)&&f.isSelecting)f.isSelecting=!1,m.removeEventListener("mouseup",
k),m.removeEventListener("mousemove",l);else{var p=ua(n.target);null===p||f.anchorX===p.x&&f.anchorY===p.y||(n.preventDefault(),f.setFocusCellForSelection(p))}},0)};return{onMouseMove:l,onMouseUp:k}};b.addEventListener("mousedown",k=>{setTimeout(()=>{if(0===k.button&&m){var l=ua(k.target);null!==l&&(Z(k),f.setAnchorCellForSelection(l));var {onMouseUp:n,onMouseMove:p}=q();f.isSelecting=!0;m.addEventListener("mouseup",n);m.addEventListener("mousemove",p)}},0)});let r=k=>{0===k.button&&c.update(()=>
{const l=u.$getSelection(),n=k.target;R(l)&&l.tableKey===f.tableNodeKey&&g.contains(n)&&f.clearHighlight()})};m.addEventListener("mousedown",r);f.listenersToRemove.add(()=>m.removeEventListener("mousedown",r));f.listenersToRemove.add(c.registerCommand(u.KEY_ARROW_DOWN_COMMAND,k=>V(c,k,"down",a,f),u.COMMAND_PRIORITY_HIGH));f.listenersToRemove.add(c.registerCommand(u.KEY_ARROW_UP_COMMAND,k=>V(c,k,"up",a,f),u.COMMAND_PRIORITY_HIGH));f.listenersToRemove.add(c.registerCommand(u.KEY_ARROW_LEFT_COMMAND,
k=>V(c,k,"backward",a,f),u.COMMAND_PRIORITY_HIGH));f.listenersToRemove.add(c.registerCommand(u.KEY_ARROW_RIGHT_COMMAND,k=>V(c,k,"forward",a,f),u.COMMAND_PRIORITY_HIGH));f.listenersToRemove.add(c.registerCommand(u.KEY_ESCAPE_COMMAND,k=>{var l=u.$getSelection();return R(l)&&(l=h.$findMatchingParent(l.focus.getNode(),A),A(l))?(Z(k),l.selectEnd(),!0):!1},u.COMMAND_PRIORITY_HIGH));let t=k=>()=>{var l=u.$getSelection();if(!U(l,a))return!1;if(R(l))return f.clearText(),!0;if(u.$isRangeSelection(l)){var n=
h.$findMatchingParent(l.anchor.getNode(),v=>A(v));if(!A(n))return!1;var p=l.anchor.getNode();n=l.focus.getNode();p=a.isParentOf(p);n=a.isParentOf(n);if(p&&!n||n&&!p)return f.clearText(),!0;n=(l=h.$findMatchingParent(l.anchor.getNode(),v=>u.$isElementNode(v)))&&h.$findMatchingParent(l,v=>u.$isElementNode(v)&&A(v.getParent()));if(!u.$isElementNode(n)||!u.$isElementNode(l))return!1;if(k===u.DELETE_LINE_COMMAND&&null===n.getPreviousSibling())return!0}return!1};[u.DELETE_WORD_COMMAND,u.DELETE_LINE_COMMAND,
u.DELETE_CHARACTER_COMMAND].forEach(k=>{f.listenersToRemove.add(c.registerCommand(k,t(k),u.COMMAND_PRIORITY_CRITICAL))});b=k=>{const l=u.$getSelection();if(!U(l,a))return!1;if(R(l))return k.preventDefault(),k.stopPropagation(),f.clearText(),!0;u.$isRangeSelection(l)&&(k=h.$findMatchingParent(l.anchor.getNode(),n=>A(n)),A(k));return!1};f.listenersToRemove.add(c.registerCommand(u.KEY_BACKSPACE_COMMAND,b,u.COMMAND_PRIORITY_CRITICAL));f.listenersToRemove.add(c.registerCommand(u.KEY_DELETE_COMMAND,b,u.COMMAND_PRIORITY_CRITICAL));
f.listenersToRemove.add(c.registerCommand(u.FORMAT_TEXT_COMMAND,k=>{let l=u.$getSelection();if(!U(l,a))return!1;if(R(l))return f.formatCells(k),!0;u.$isRangeSelection(l)&&(k=h.$findMatchingParent(l.anchor.getNode(),n=>A(n)),A(k));return!1},u.COMMAND_PRIORITY_CRITICAL));f.listenersToRemove.add(c.registerCommand(u.FORMAT_ELEMENT_COMMAND,k=>{var l=u.$getSelection();if(!R(l)||!U(l,a))return!1;var n=l.anchor.getNode();l=l.focus.getNode();if(!A(n)||!A(l))return!1;let [p,v,y]=P(a,n,l);n=Math.max(v.startRow,
y.startRow);l=Math.max(v.startColumn,y.startColumn);var B=Math.min(v.startRow,y.startRow);let E=Math.min(v.startColumn,y.startColumn);for(;B<=n;B++)for(let G=E;G<=l;G++){var F=p[B][G].cell;F.setFormat(k);F=F.getChildren();for(let L=0;L<F.length;L++){let M=F[L];u.$isElementNode(M)&&!M.isInline()&&M.setFormat(k)}}return!0},u.COMMAND_PRIORITY_CRITICAL));f.listenersToRemove.add(c.registerCommand(u.CONTROLLED_TEXT_INSERTION_COMMAND,k=>{var l=u.$getSelection();if(!U(l,a))return!1;if(R(l))f.clearHighlight();
else if(u.$isRangeSelection(l)){let n=h.$findMatchingParent(l.anchor.getNode(),p=>A(p));if(!A(n))return!1;if("string"===typeof k&&(l=Ka(c,l,a)))return Ja(l,a,[u.$createTextNode(k)]),!0}return!1},u.COMMAND_PRIORITY_CRITICAL));d&&f.listenersToRemove.add(c.registerCommand(u.KEY_TAB_COMMAND,k=>{var l=u.$getSelection();if(!u.$isRangeSelection(l)||!l.isCollapsed()||!U(l,a))return!1;l=Da(l.anchor.getNode());if(null===l)return!1;Z(k);l=a.getCordsFromCellNode(l,f.table);Aa(f,a,l.x,l.y,k.shiftKey?"backward":
"forward");return!0},u.COMMAND_PRIORITY_CRITICAL));f.listenersToRemove.add(c.registerCommand(u.FOCUS_COMMAND,()=>a.isSelected(),u.COMMAND_PRIORITY_HIGH));f.listenersToRemove.add(c.registerCommand(u.SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,k=>{let {nodes:l,selection:n}=k;k=n.getStartEndPoints();var p=R(n);p=u.$isRangeSelection(n)&&null!==h.$findMatchingParent(n.anchor.getNode(),I=>A(I))&&null!==h.$findMatchingParent(n.focus.getNode(),I=>A(I))||p;if(1!==l.length||!N(l[0])||!p||null===k)return!1;var [v]=
k,y=l[0];k=y.getChildren();p=y.getFirstChildOrThrow().getChildrenSize();y=y.getChildrenSize();var B=h.$findMatchingParent(v.getNode(),I=>A(I)),E=(v=B&&h.$findMatchingParent(B,I=>H(I)))&&h.$findMatchingParent(v,I=>N(I));if(!A(B)||!H(v)||!N(E))return!1;var F=v.getIndexWithinParent(),G=Math.min(E.getChildrenSize()-1,F+y-1);y=B.getIndexWithinParent();B=Math.min(v.getChildrenSize()-1,y+p-1);p=Math.min(y,B);v=Math.min(F,G);y=Math.max(y,B);F=Math.max(F,G);E=E.getChildren();G=0;let L,M;for(B=v;B<=F;B++){var fa=
E[B];if(!H(fa))return!1;var ha=k[G];if(!H(ha))return!1;fa=fa.getChildren();ha=ha.getChildren();let I=0;for(let W=p;W<=y;W++){let X=fa[W];if(!A(X))return!1;let Ca=ha[I];if(!A(Ca))return!1;B===v&&W===p?L=X.getKey():B===F&&W===y&&(M=X.getKey());let Oa=X.getChildren();Ca.getChildren().forEach(Y=>{u.$isTextNode(Y)&&u.$createParagraphNode().append(Y);X.append(Y)});Oa.forEach(Y=>Y.remove());I++}G++}L&&M&&(k=ra(),k.set(l[0].getKey(),L,M),u.$setSelection(k));return!0},u.COMMAND_PRIORITY_CRITICAL));f.listenersToRemove.add(c.registerCommand(u.SELECTION_CHANGE_COMMAND,
()=>{let k=u.$getSelection(),l=u.$getPreviousSelection();if(u.$isRangeSelection(k)){let {anchor:B,focus:E}=k;var n=B.getNode(),p=E.getNode();n=Da(n);var v=Da(p),y=!(!n||!a.is(T(n)));p=!(!v||!a.is(T(v)));let F=y!==p,G=y&&p;y=k.isBackward();F?(n=k.clone(),p?n.focus.set(a.getParentOrThrow().getKey(),a.getIndexWithinParent(),"element"):n.anchor.set(a.getParentOrThrow().getKey(),y?a.getIndexWithinParent()+1:a.getIndexWithinParent(),"element"),u.$setSelection(n),ya(c,f)):G&&!n.is(v)&&(f.setAnchorCellForSelection(e(n)),
f.setFocusCellForSelection(e(v),!0),f.isSelecting||setTimeout(()=>{let {onMouseUp:L,onMouseMove:M}=q();f.isSelecting=!0;m.addEventListener("mouseup",L);m.addEventListener("mousemove",M)},0))}else k&&R(k)&&k.is(l)&&k.tableKey===a.getKey()&&(n=ea?(c._window||window).getSelection():null)&&n.anchorNode&&n.focusNode&&(p=(p=u.$getNearestNodeFromDOMNode(n.focusNode))&&!a.is(T(p)),v=(v=u.$getNearestNodeFromDOMNode(n.anchorNode))&&a.is(T(v)),p&&v&&0<n.rangeCount&&(p=u.$createRangeSelectionFromDom(n,c)))&&
(p.anchor.set(a.getKey(),k.isBackward()?a.getChildrenSize():0,"element"),n.removeAllRanges(),u.$setSelection(p));if(k&&!k.is(l)&&(R(k)||R(l))&&f.tableSelection&&!f.tableSelection.is(l))return R(k)&&k.tableKey===f.tableNodeKey?f.updateTableTableSelection(k):!R(k)&&R(l)&&l.tableKey===f.tableNodeKey&&f.updateTableTableSelection(null),!1;f.hasHijackedSelectionStyles&&!a.isSelected()?za(c,f):!f.hasHijackedSelectionStyles&&a.isSelected()&&ya(c,f);return!1},u.COMMAND_PRIORITY_CRITICAL));f.listenersToRemove.add(c.registerCommand(u.INSERT_PARAGRAPH_COMMAND,
()=>{var k=u.$getSelection();return u.$isRangeSelection(k)&&k.isCollapsed()&&U(k,a)?(k=Ka(c,k,a))?(Ja(k,a),!0):!1:!1},u.COMMAND_PRIORITY_CRITICAL));return f};exports.getDOMCellFromTarget=ua;exports.getTableObserverFromTableElement=function(a){return a.__lexicalTableSelection}
