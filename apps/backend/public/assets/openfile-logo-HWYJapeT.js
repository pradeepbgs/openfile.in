import{r as s,j as i}from"./chunk-UH6JLGW7-BgIDLrGe.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,o)=>o?o.toUpperCase():r.toLowerCase()),l=t=>{const e=w(t);return e.charAt(0).toUpperCase()+e.slice(1)},u=(...t)=>t.filter((e,r,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===r).join(" ").trim(),x=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var C={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=s.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:n="",children:a,iconNode:p,...c},d)=>s.createElement("svg",{ref:d,...C,width:e,height:e,stroke:t,strokeWidth:o?Number(r)*24/Number(e):r,className:u("lucide",n),...!a&&!x(c)&&{"aria-hidden":"true"},...c},[...p.map(([h,m])=>s.createElement(h,m)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=(t,e)=>{const r=s.forwardRef(({className:o,...n},a)=>s.createElement(g,{ref:a,iconNode:e,className:u(`lucide-${f(l(t))}`,`lucide-${t}`,o),...n}));return r.displayName=l(t),r};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],b=k("file-text",y);function v(){return i.jsx("div",{className:"w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center",children:i.jsx(b,{className:"w-5 h-5 text-white"})})}export{b as F,v as O,k as c};
