/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{useLexicalComposerContext as t}from"@lexical/react/LexicalComposerContext";import{createCommand as e,KEY_ARROW_DOWN_COMMAND as n,KEY_ARROW_UP_COMMAND as o,KEY_ESCAPE_COMMAND as r,KEY_TAB_COMMAND as l,KEY_ENTER_COMMAND as i,COMMAND_PRIORITY_LOW as s,$getSelection as u,$isRangeSelection as c,$isTextNode as a}from"lexical";import*as d from"react";import{useLayoutEffect as m,useEffect as f,useState as p,useCallback as g,useMemo as h,useRef as w}from"react";import{mergeRegister as y}from"@lexical/utils";const C="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?m:f;class b{constructor(t){this.key=t,this.ref={current:null},this.setRefElement=this.setRefElement.bind(this)}setRefElement(t){this.ref={current:t}}}const v=t=>{const e=document.getElementById("typeahead-menu");if(!e)return;const n=e.getBoundingClientRect();n.top+n.height>window.innerHeight&&e.scrollIntoView({block:"center"}),n.top<0&&e.scrollIntoView({block:"center"}),t.scrollIntoView({block:"nearest"})};function E(t,e){const n=t.getBoundingClientRect(),o=e.getBoundingClientRect();return n.top>o.top&&n.top<o.bottom}function x(e,n,o,r){const[l]=t();f((()=>{if(null!=n&&null!=e){const t=l.getRootElement(),e=null!=t?function(t,e){let n=getComputedStyle(t);const o="absolute"===n.position,r=/(auto|scroll)/;if("fixed"===n.position)return document.body;for(let e=t;e=e.parentElement;)if(n=getComputedStyle(e),(!o||"static"!==n.position)&&r.test(n.overflow+n.overflowY+n.overflowX))return e;return document.body}(t):document.body;let i=!1,s=E(n,e);const u=function(){i||(window.requestAnimationFrame((function(){o(),i=!1})),i=!0);const t=E(n,e);t!==s&&(s=t,null!=r&&r(t))},c=new ResizeObserver(o);return window.addEventListener("resize",o),document.addEventListener("scroll",u,{capture:!0,passive:!0}),c.observe(n),()=>{c.unobserve(n),window.removeEventListener("resize",o),document.removeEventListener("scroll",u,!0)}}}),[n,l,r,o,e])}const S=e("SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND");function R({close:t,editor:e,anchorElementRef:a,resolution:d,options:m,menuRenderFn:w,onSelectOption:b,shouldSplitNodeWithQuery:E=!1,commandPriority:x=s}){const[R,O]=p(null),I=d.match&&d.match.matchingString;f((()=>{O(0)}),[I]);const T=g((n=>{e.update((()=>{const e=null!=d.match&&E?function(t){const e=u();if(!c(e)||!e.isCollapsed())return null;const n=e.anchor;if("text"!==n.type)return null;const o=n.getNode();if(!o.isSimpleText())return null;const r=n.offset,l=o.getTextContent().slice(0,r),i=t.replaceableString.length,s=r-function(t,e,n){let o=n;for(let n=o;n<=e.length;n++)t.substr(-n)===e.substr(0,n)&&(o=n);return o}(l,t.matchingString,i);if(s<0)return null;let a;return 0===s?[a]=o.splitText(r):[,a]=o.splitText(s,r),a}(d.match):null;b(n,e,t,d.match?d.match.matchingString:"")}))}),[e,E,d.match,b,t]),A=g((t=>{const n=e.getRootElement();null!==n&&(n.setAttribute("aria-activedescendant","typeahead-item-"+t),O(t))}),[e]);f((()=>()=>{const t=e.getRootElement();null!==t&&t.removeAttribute("aria-activedescendant")}),[e]),C((()=>{null===m?O(null):null===R&&A(0)}),[m,R,A]),f((()=>y(e.registerCommand(S,(({option:t})=>!(!t.ref||null==t.ref.current)&&(v(t.ref.current),!0)),x))),[e,A,x]),f((()=>y(e.registerCommand(n,(t=>{const n=t;if(null!==m&&m.length&&null!==R){const t=R!==m.length-1?R+1:0;A(t);const o=m[t];null!=o.ref&&o.ref.current&&e.dispatchCommand(S,{index:t,option:o}),n.preventDefault(),n.stopImmediatePropagation()}return!0}),x),e.registerCommand(o,(t=>{const e=t;if(null!==m&&m.length&&null!==R){const t=0!==R?R-1:m.length-1;A(t);const n=m[t];null!=n.ref&&n.ref.current&&v(n.ref.current),e.preventDefault(),e.stopImmediatePropagation()}return!0}),x),e.registerCommand(r,(e=>{const n=e;return n.preventDefault(),n.stopImmediatePropagation(),t(),!0}),x),e.registerCommand(l,(t=>{const e=t;return null!==m&&null!==R&&null!=m[R]&&(e.preventDefault(),e.stopImmediatePropagation(),T(m[R]),!0)}),x),e.registerCommand(i,(t=>null!==m&&null!==R&&null!=m[R]&&(null!==t&&(t.preventDefault(),t.stopImmediatePropagation()),T(m[R]),!0)),x))),[T,t,e,m,R,A,x]);return w(a,h((()=>({options:m,selectOptionAndCleanUp:T,selectedIndex:R,setHighlightedIndex:O})),[T,R,m]),d.match?d.match.matchingString:"")}const O="\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";function I(t,e){let n=getComputedStyle(t);const o="absolute"===n.position,r=e?/(auto|scroll|hidden)/:/(auto|scroll)/;if("fixed"===n.position)return document.body;for(let e=t;e=e.parentElement;)if(n=getComputedStyle(e),(!o||"static"!==n.position)&&r.test(n.overflow+n.overflowY+n.overflowX))return e;return document.body}const T=e("SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND");function A(t,{minLength:e=1,maxLength:n=75}){return g((o=>{const r=new RegExp("(^|\\s|\\()(["+t+"]((?:"+("[^"+t+O+"\\s]")+"){0,"+n+"}))$").exec(o);if(null!==r){const t=r[1],n=r[3];if(n.length>=e)return{leadOffset:r.index+t.length,matchingString:n,replaceableString:r[2]}}return null}),[n,e,t])}function N({options:e,onQueryChange:n,onSelectOption:o,onOpen:r,onClose:l,menuRenderFn:i,triggerFn:m,anchorClassName:h,commandPriority:y=s,parent:C}){const[b]=t(),[v,E]=p(null),S=function(e,n,o,r=document.body){const[l]=t(),i=w(document.createElement("div")),s=g((()=>{i.current.style.top=i.current.style.bottom;const t=l.getRootElement(),n=i.current,s=n.firstChild;if(null!==t&&null!==e){const{left:l,top:u,width:c,height:a}=e.getRect(),d=i.current.offsetHeight;if(n.style.top=`${u+window.pageYOffset+d+3}px`,n.style.left=`${l+window.pageXOffset}px`,n.style.height=`${a}px`,n.style.width=`${c}px`,null!==s){s.style.top=`${u}`;const e=s.getBoundingClientRect(),o=e.height,r=e.width,i=t.getBoundingClientRect();l+r>i.right&&(n.style.left=`${i.right-r+window.pageXOffset}px`),(u+o>window.innerHeight||u+o>i.bottom)&&u-i.top>o+a&&(n.style.top=u-o+window.pageYOffset-a+"px")}n.isConnected||(null!=o&&(n.className=o),n.setAttribute("aria-label","Typeahead menu"),n.setAttribute("id","typeahead-menu"),n.setAttribute("role","listbox"),n.style.display="block",n.style.position="absolute",r.append(n)),i.current=n,t.setAttribute("aria-controls","typeahead-menu")}}),[l,e,o,r]);f((()=>{const t=l.getRootElement();if(null!==e)return s(),()=>{null!==t&&t.removeAttribute("aria-controls");const e=i.current;null!==e&&e.isConnected&&e.remove()}}),[l,s,e]);const u=g((t=>{null!==e&&(t||n(null))}),[e,n]);return x(e,i.current,s,u),i}(v,E,h,C),O=g((()=>{E(null),null!=l&&null!==v&&l()}),[l,v]),I=g((t=>{E(t),null!=r&&null===v&&r(t)}),[r,v]);return f((()=>{const t=b.registerUpdateListener((()=>{b.getEditorState().read((()=>{const t=b._window||window,e=t.document.createRange(),o=u(),r=function(t){let e=null;return t.getEditorState().read((()=>{const t=u();c(t)&&(e=function(t){const e=t.anchor;if("text"!==e.type)return null;const n=e.getNode();if(!n.isSimpleText())return null;const o=e.offset;return n.getTextContent().slice(0,o)}(t))})),e}(b);if(!c(o)||!o.isCollapsed()||null===r||null===e)return void O();const l=m(r,b);if(n(l?l.matchingString:null),null!==l&&!function(t,e){return 0===e&&t.getEditorState().read((()=>{const t=u();if(c(t)){const e=t.anchor.getNode().getPreviousSibling();return a(e)&&e.isTextEntity()}return!1}))}(b,l.leadOffset)){const n=function(t,e,n){const o=n.getSelection();if(null===o||!o.isCollapsed)return!1;const r=o.anchorNode,l=t,i=o.anchorOffset;if(null==r||null==i)return!1;try{e.setStart(r,l),e.setEnd(r,i)}catch(t){return!1}return!0}(l.leadOffset,e,t);if(null!==n)return i=()=>I({getRect:()=>e.getBoundingClientRect(),match:l}),void(d.startTransition?d.startTransition(i):i())}var i;O()}))}));return()=>{t()}}),[b,m,n,v,O,I]),null===v||null===b?null:d.createElement(R,{close:O,resolution:v,editor:b,anchorElementRef:S,options:e,menuRenderFn:i,shouldSplitNodeWithQuery:!0,onSelectOption:o,commandPriority:y})}export{N as LexicalTypeaheadMenuPlugin,b as MenuOption,O as PUNCTUATION,T as SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND,I as getScrollParent,A as useBasicTypeaheadTriggerMatch,x as useDynamicPositioning};