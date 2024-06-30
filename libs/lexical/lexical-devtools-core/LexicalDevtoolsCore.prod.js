/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var k=require("@lexical/html"),t=require("@lexical/link"),u=require("@lexical/mark"),w=require("@lexical/table"),L=require("lexical"),M=require("react"),N=require("react/jsx-runtime");
let O=Object.freeze({"\t":"\\t","\n":"\\n"}),P=new RegExp(Object.keys(O).join("|"),"g"),Q=Object.freeze({ancestorHasNextSibling:"|",ancestorIsLastChild:" ",hasNextSibling:"\u251c",isLastChild:"\u2514",selectedChar:"^",selectedLine:">"}),aa=[a=>a.hasFormat("bold")&&"Bold",a=>a.hasFormat("code")&&"Code",a=>a.hasFormat("italic")&&"Italic",a=>a.hasFormat("strikethrough")&&"Strikethrough",a=>a.hasFormat("subscript")&&"Subscript",a=>a.hasFormat("superscript")&&"Superscript",a=>a.hasFormat("underline")&&
"Underline"],ba=[a=>a.hasTextFormat("bold")&&"Bold",a=>a.hasTextFormat("code")&&"Code",a=>a.hasTextFormat("italic")&&"Italic",a=>a.hasTextFormat("strikethrough")&&"Strikethrough",a=>a.hasTextFormat("subscript")&&"Subscript",a=>a.hasTextFormat("superscript")&&"Superscript",a=>a.hasTextFormat("underline")&&"Underline"],ca=[a=>a.isDirectionless()&&"Directionless",a=>a.isUnmergeable()&&"Unmergeable"],da=[a=>a.isToken()&&"Token",a=>a.isSegmented()&&"Segmented"];
function ea(a){let b="";var c=V(a);b+=`: range ${""!==c?`{ ${c} }`:""} ${""!==a.style?`{ style: ${a.style} } `:""}`;c=a.anchor;a=a.focus;let e=c.offset,d=a.offset;b+=`\n  \u251c anchor { key: ${c.key}, offset: ${null===e?"null":e}, type: ${c.type} }`;return b+=`\n  \u2514 focus { key: ${a.key}, offset: ${null===d?"null":d}, type: ${a.type} }`}function fa(a){return L.$isNodeSelection(a)?`: node\n  \u2514 [${Array.from(a._nodes).join(", ")}]`:""}
function W(a,b,c=[]){a=a.getChildren();let e=a.length;a.forEach((d,l)=>{b(d,c.concat(l===e-1?Q.isLastChild:Q.hasNextSibling));L.$isElementNode(d)&&W(d,b,c.concat(l===e-1?Q.ancestorIsLastChild:Q.ancestorHasNextSibling))})}function X(a,b=!1){a=Object.entries(O).reduce((c,[e,d])=>c.replace(new RegExp(e,"g"),String(d)),a);return b?a.replace(/[^\s]/g,"*"):a}
function ha(a,b,c=!1){b=b?b(a,c):void 0;if(void 0!==b&&0<b.length)return b;if(L.$isTextNode(a))return b=a.getTextContent(),c=0===b.length?"(empty)":`"${X(b,c)}"`,a=[V(a),ia(a),ja(a)].filter(Boolean).join(", "),[c,0!==a.length?`{ ${a} }`:null].filter(Boolean).join(" ").trim();if(t.$isLinkNode(a)){b=a.getURL();c=0===b.length?"(empty)":`"${X(b,c)}"`;b=a.getTarget();null!=b&&(b="target: "+b);var e=Boolean;var d=a.getRel();null!=d&&(d="rel: "+d);a=a.getTitle();null!=a&&(a="title: "+a);a=[b,d,a].filter(e).join(", ");
return[c,0!==a.length?`{ ${a} }`:null].filter(Boolean).join(" ").trim()}return u.$isMarkNode(a)?`ids: [ ${a.getIDs().join(", ")} ]`:L.$isParagraphNode(a)?(a=ka(a),""!==a?`{ ${a} }`:""):""}function ka(a){let b=ba.map(c=>c(a)).filter(Boolean).join(", ").toLocaleLowerCase();""!==b&&(b="format: "+b);return b}function ia(a){let b=ca.map(c=>c(a)).filter(Boolean).join(", ").toLocaleLowerCase();""!==b&&(b="detail: "+b);return b}
function ja(a){let b=da.map(c=>c(a)).filter(Boolean).join(", ").toLocaleLowerCase();""!==b&&(b="mode: "+b);return b}function V(a){let b=aa.map(c=>c(a)).filter(Boolean).join(", ").toLocaleLowerCase();""!==b&&(b="format: "+b);return b}
function la({indent:a,isSelected:b,node:c,nodeKeyDisplay:e,selection:d,typeDisplay:l}){if(!L.$isTextNode(c)||!L.$isRangeSelection(d)||!b||L.$isElementNode(c))return"";b=d.anchor;var f=d.focus;if(""===c.getTextContent()||b.getNode()===d.focus.getNode()&&b.offset===f.offset)return"";b=d.getStartEndPoints();if(L.$isNodeSelection(d)||null===b)c=[-1,-1];else{var [p,r]=b;f=c.getTextContent();var m=f.length;b=d=-1;if("text"===p.type&&"text"===r.type){let n=p.getNode(),x=r.getNode();n===x&&c===n&&p.offset!==
r.offset?[d,b]=p.offset<r.offset?[p.offset,r.offset]:[r.offset,p.offset]:c===n?[d,b]=n.isBefore(x)?[p.offset,m]:[0,p.offset]:c===x?[d,b]=x.isBefore(n)?[r.offset,m]:[0,r.offset]:[d,b]=[0,m]}c=(f.slice(0,d).match(P)||[]).length;f=(f.slice(d,b).match(P)||[]).length;c=[d+c,b+c+f]}let [h,g]=c;if(h===g)return"";c=a[a.length-1]===Q.hasNextSibling?Q.ancestorHasNextSibling:Q.ancestorIsLastChild;a=[...a.slice(0,a.length-1),c];c=Array(h+1).fill(" ");d=Array(g-h).fill(Q.selectedChar);e=Array(e.length+(l.length+
3)).fill(" ");return[Q.selectedLine,a.join(" "),[...e,...c,...d].join("")].join(" ")+"\n"}function Y(a,b){let c=Array(b++ +1).join("  "),e=Array(b-1).join("  "),d;for(let l=0;l<a.children.length;l++)d=document.createTextNode("\n"+c),a.insertBefore(d,a.children[l]),Y(a.children[l],b),a.lastElementChild===a.children[l]&&(d=document.createTextNode("\n"+e),a.appendChild(d));return a}
let pa=M.forwardRef(function({treeTypeButtonClassName:a,timeTravelButtonClassName:b,timeTravelPanelSliderClassName:c,timeTravelPanelButtonClassName:e,viewClassName:d,timeTravelPanelClassName:l,editorState:f,setEditorState:p,setEditorReadOnly:r,generateContent:m},h){const [g,n]=M.useState([]),[x,D]=M.useState(""),[A,R]=M.useState(!1),[E,ma]=M.useState(!1),B=M.useRef(0),H=M.useRef(null),[F,I]=M.useState(!1),[G,na]=M.useState(!1),[y,oa]=M.useState(!1),S=M.useRef(),J=M.useRef(0),K=M.useCallback(q=>{const v=
++J.current;m(q).then(z=>{v===J.current&&D(z)}).catch(z=>{v===J.current&&D(`Error rendering tree: ${z.message}\n\nStack:\n${z.stack}`)})},[m]);M.useEffect(()=>{if(!y&&1E3<f._nodeMap.size&&(na(!0),!y))return;S.current!==f&&(S.current=f,K(E),A||n(q=>[...q,[Date.now(),f]]))},[f,K,E,y,A]);const C=g.length;M.useEffect(()=>{if(F){let q;const v=()=>{const z=B.current;z===C-1?I(!1):q=setTimeout(()=>{B.current++;const T=B.current,U=H.current;null!==U&&(U.value=String(T));p(g[T][1]);v()},g[z+1][0]-g[z][0])};
v();return()=>{clearTimeout(q)}}},[g,F,C,p]);return N.jsxs("div",{className:d,children:[!y&&G?N.jsxs("div",{style:{padding:20},children:[N.jsx("span",{style:{marginRight:20},children:"Detected large EditorState, this can impact debugging performance."}),N.jsx("button",{onClick:()=>{oa(!0)},style:{background:"transparent",border:"1px solid white",color:"white",cursor:"pointer",padding:5},children:"Show full tree"})]}):null,y?null:N.jsx("button",{onClick:()=>{K(!E);ma(!E)},className:a,type:"button",
children:E?"Tree":"Export DOM"}),!A&&(y||!G)&&2<C&&N.jsx("button",{onClick:()=>{r(!0);B.current=C-1;R(!0)},className:b,type:"button",children:"Time Travel"}),(y||!G)&&N.jsx("pre",{ref:h,children:x}),A&&(y||!G)&&N.jsxs("div",{className:l,children:[N.jsx("button",{className:e,onClick:()=>{B.current===C-1&&(B.current=1);I(!F)},type:"button",children:F?"Pause":"Play"}),N.jsx("input",{className:c,ref:H,onChange:q=>{q=Number(q.target.value);const v=g[q];v&&(B.current=q,p(v[1]))},type:"range",min:"1",max:C-
1}),N.jsx("button",{className:e,onClick:()=>{r(!1);const q=g.length-1;p(g[q][1]);const v=H.current;null!==v&&(v.value=String(q));R(!1);I(!1)},type:"button",children:"Exit"})]})]})});function Z(a,b){let c=new Set,e=0;for(let [d]of a._commands)c.add(a.registerCommand(d,l=>{b(f=>{e+=1;f=[...f];f.push({index:e,payload:l,type:d.type?d.type:"UNKNOWN"});10<f.length&&f.shift();return f});return!1},L.COMMAND_PRIORITY_CRITICAL));return()=>c.forEach(d=>d())}exports.TreeView=pa;
exports.generateContent=function(a,b,c,e,d=!1){let l=a.getEditorState(),f=a._config,p=a._compositionKey,r=a._editable;if(c){let h="";l.read(()=>{var g=k.$generateHtmlFromNodes(a);let n=document.createElement("div");n.innerHTML=g.trim();h=Y(n,0).innerHTML});return h}let m=" root\n";c=l.read(()=>{const h=L.$getSelection();W(L.$getRoot(),(g,n)=>{const x=`(${g.getKey()})`,D=g.getType()||"",A=g.isSelected();m+=`${A?Q.selectedLine:" "} ${n.join(" ")} ${x} ${D} ${ha(g,e,d)}\n`;m+=la({indent:n,isSelected:A,
node:g,nodeKeyDisplay:x,selection:h,typeDisplay:D})});return null===h?": null":L.$isRangeSelection(h)?ea(h):w.$isTableSelection(h)?`: table\n  \u2514 { table: ${h.tableKey}, anchorCell: ${h.anchor.key}, focusCell: ${h.focus.key} }`:fa(h)});m+="\n selection"+c;m+="\n\n commands:";if(b.length)for(let {index:h,type:g,payload:n}of b)m+=`\n  \u2514 ${h}. { type: ${g}, payload: ${n instanceof Event?n.constructor.name:n} }`;else m+="\n  \u2514 None dispatched.";m+="\n\n editor:";m+=`\n  \u2514 namespace ${f.namespace}`;
null!==p&&(m+=`\n  \u2514 compositionKey ${p}`);return m+=`\n  \u2514 editable ${String(r)}`};exports.registerLexicalCommandLogger=Z;exports.useLexicalCommandsLog=function(a){let [b,c]=M.useState([]);M.useEffect(()=>Z(a,c),[a]);return M.useMemo(()=>b,[b])}
