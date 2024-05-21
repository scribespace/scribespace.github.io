/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var l={},n={},p={getParentAssignmentName:function(a){let c=a.parent;if("VariableDeclarator"===c.type&&c.init===a)return c.id;if("AssignmentExpression"===c.type&&c.right===a&&"="===c.operator)return c.left}};let {getParentAssignmentName:r}=p;n.getFunctionName=function(a){if("FunctionDeclaration"===a.type||"FunctionExpression"===a.type&&a.id)return a.id;if("FunctionExpression"===a.type||"ArrowFunctionExpression"===a.type)return r(a)};
let {getFunctionName:t}=n,{getParentAssignmentName:z}=p,{buildMatcher:A}={buildMatcher:function(...a){let c=[],e=[];for(let b of a.flat(1))b&&("string"===typeof b?e.push(/^[(^]/.test(b)?b:`^${b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}$`):b&&b instanceof RegExp?b.flags?c.push(h=>b.test(h)):e.push(b.source):"function"===typeof b&&c.push(b));if(a=e.map(b=>`(?:${b})`).join("|")){let b=new RegExp(a);c.push(h=>b.test(h))}return b=>{if(b){if("Identifier"!==b.type)throw Error(`Expecting Identifier, not ${b.type}`);
for(let h of c)if(h(b.name,b))return!0}return!1}}};function B(a,c){a=a.scopeManager;for(let b=c;b;b=b.parent){var e=a.getDeclaredVariables(b).find(h=>h.identifiers.includes(c));if(e)return e;if(e=a.acquire(b))return e.set.get(c.name)||(e.upper?e.upper.set.get(c.name):void 0)}}let C={isDollarFunction:[/^\$[a-z_]/],isIgnoredFunction:[],isLexicalProvider:["parseEditorState","read","registerCommand","registerNodeTransform","update"],isSafeDollarFunction:[/^\$is[A-Z_]/]};
function D(a){let c={};for(let u in C){var e=u,b=e,h=C[e],g=a;g=Array.isArray(g.options)?g.options[0]:void 0;c[b]=A(h,g&&e in g?g[e]:void 0)}return c}function E(a){if(a){if("Identifier"===a.type)return a;if("MemberExpression"===a.type&&!a.computed)return E(a.property)}}function L(a,c){a=a.name;a=/^[a-z]/.test(a)?"$"+a:/^[A-Z][a-z]/.test(a)?"$"+a.slice(0,1).toLowerCase()+a.slice(1):`$_${a}`;if(c)for(c=c.scope;c;c=c.upper)if(c.set.has(a))return a+"_";return a}
function M(a){if(a&&1===a.defs.length){[{node:a}]=a.defs;if("ExportNamedDeclaration"===a.parent.type)return a.parent;if("VariableDeclaration"===a.parent.type&&"ExportNamedDeclaration"===a.parent.parent.type)return a.parent.parent}}function N({caller:a,suggestName:c}){return`\n/** @deprecated renamed to {@link ${c}} by @lexical/eslint-plugin rules-of-lexical */\nexport const ${a} = ${c};`}let O={oneOf:[{type:"string"},{contains:{type:"string"},type:"array"}]};
l.rulesOfLexical={create(a){let c=a.getSourceCode(),e=D(a),b=new Set,h=new Set,g=[],u=()=>{if(0<b.size)return!0;const d=g[g.length-1];return d&&"Property"===d.node.parent.type},F=d=>b.delete(d),v=d=>{a:{var f=t(d);if(!f){f=d.parent;if("CallExpression"===f.type&&f.arguments[0]===d){let k=E(f.callee);if(k&&"Identifier"===k.type&&/^use([A-Z]|$)/.test(k.name)){f=z(f);break a}}f=void 0}}f=E(f);g.push({name:f,node:d});(e.isDollarFunction(f)||e.isIgnoredFunction(f)||e.isLexicalProvider(f))&&b.add(d)},w=
d=>{g.pop();b.delete(d)},W=()=>{const d=g[g.length-1];return d?d.name:void 0};return{ArrowFunctionExpression:v,"ArrowFunctionExpression:exit":w,CallExpression:d=>{if(!u()){var f=E(d.callee);if(e.isLexicalProvider(f)||e.isSafeDollarFunction(f))b.add(d);else if(e.isDollarFunction(f)){var k=W();if(k&&!h.has(k)){h.add(k);var q=B(c,k),G=L(k,q),H=M(q),x={callee:c.getText(d.callee),caller:c.getText(k),suggestName:G};d=I=>{const J=new Set,y=[],K=m=>{J.has(m)||(J.add(m),y.push(I.replaceText(m,G)))};K(k);H&&
y.push(I.insertTextAfter(H,N(x)));if(q)for(const m of q.references)K(m.identifier);return y};a.report({data:x,fix:d,messageId:"rulesOfLexicalReport",node:k,suggest:[{data:x,fix:d,messageId:"rulesOfLexicalSuggestion"}]})}}}},"CallExpression:exit":F,ClassBody:d=>b.add(d),"ClassBody:exit":F,FunctionDeclaration:v,"FunctionDeclaration:exit":w,FunctionExpression:v,"FunctionExpression:exit":w}},meta:{docs:{description:"enforces the Rules of Lexical",recommended:!0,url:"https://lexical.dev/docs/packages/lexical-eslint-plugin"},
fixable:"code",hasSuggestions:!0,messages:{rulesOfLexicalReport:"{{ callee }} called from {{ caller }}, without $ prefix or read/update context",rulesOfLexicalSuggestion:"Rename {{ caller }} to {{ suggestName }}"},schema:[{additionalProperties:!1,properties:{isDollarFunction:O,isIgnoredFunction:O,isLexicalProvider:O,isSafeDollarFunction:O},type:"object"}],type:"suggestion"}};
let {name:P,version:Q}={name:"@lexical/eslint-plugin",description:"Lexical specific linting rules for ESLint",keywords:["eslint","eslint-plugin","eslintplugin","lexical","editor"],version:"0.15.0",license:"MIT",repository:{type:"git",url:"git+https://github.com/facebook/lexical.git",directory:"packages/lexical-eslint-plugin"},main:"LexicalEslintPlugin.js",types:"index.d.ts",bugs:{url:"https://github.com/facebook/lexical/issues"},homepage:"https://lexical.dev/docs/packages/lexical-eslint-plugin",sideEffects:!1,
peerDependencies:{eslint:">=7.31.0 || ^8.0.0"},exports:{".":{"import":{types:"./index.d.ts",development:"./LexicalEslintPlugin.dev.mjs",production:"./LexicalEslintPlugin.prod.mjs",node:"./LexicalEslintPlugin.node.mjs","default":"./LexicalEslintPlugin.mjs"},require:{types:"./index.d.ts",development:"./LexicalEslintPlugin.dev.js",production:"./LexicalEslintPlugin.prod.js","default":"./LexicalEslintPlugin.js"}}},devDependencies:{"@types/eslint":"^8.56.9"},module:"LexicalEslintPlugin.mjs"},{rulesOfLexical:R}=
l,S={plugins:["@lexical"],rules:{"@lexical/rules-of-lexical":"warn"}};for(var T={configs:{all:S,recommended:S},meta:{name:P,version:Q},rules:{"rules-of-lexical":R}},U={__proto__:null,default:T&&T.__esModule&&Object.prototype.hasOwnProperty.call(T,"default")?T["default"]:T},V=[T],X=0;X<V.length;X++){var Y=V[X];if("string"!==typeof Y&&!Array.isArray(Y))for(var Z in Y)"default"===Z||Z in U||(U[Z]=Y[Z])}exports.default=U
