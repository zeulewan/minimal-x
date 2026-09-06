const {test,before,beforeEach,afterEach} = require('node:test');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');
const {rollup} = require('rollup');
const path = require('path');
const Module = require('module');
const popup=path.resolve(__dirname,'../popup');
const React=require(path.join(popup,'node_modules/react'));
const ReactDOM=require(path.join(popup,'node_modules/react-dom'));
const {act,Simulate}=require(path.join(popup,'node_modules/react-dom/test-utils'));
const swc=require(path.join(popup,'node_modules/next/dist/build/swc'));
let api,dom,saved,writes,listeners,container;
before(async()=>{
 const built=await rollup({input:'popup-test',plugins:[{
  name:'popup-test',resolveId(id){
   if(id==='popup-test'||id==='@uiw/react-codemirror'||id==='@codemirror/lang-css')return id;
   if(!id.startsWith('.')&&!id.startsWith('/'))return {id:require.resolve(id,{paths:[popup]}),external:true};
  },
  load(id){
   if(id==='popup-test')return `export {default as useStorageKeyState,useStorageState} from ${JSON.stringify(path.join(popup,'utilities/useStorageKeyState.js'))};export {default as AdvancedSection} from ${JSON.stringify(path.join(popup,'components/sections/AdvancedSection.js'))};`;
   // Substitute only the editor widget; exercise the real section and storage hook.
   if(id==='@uiw/react-codemirror')return 'import React from "react"; export default function Editor({value,onChange}){return React.createElement("textarea",{value,onChange:e=>onChange(e.target.value),"aria-label":"CSS"})}';
   if(id==='@codemirror/lang-css')return 'export const css=()=>[];';
  },
  transform(code,id){if(id.endsWith('.js')&&id.includes('/components/'))return swc.transformSync(code,{jsc:{parser:{syntax:'ecmascript',jsx:true},transform:{react:{runtime:'automatic'}}},module:{type:'es6'}}).code}
 }]});
 const {output}=await built.generate({format:'cjs'});await built.close();
 const filename=path.join(__dirname,'popup.generated.cjs');const mod=new Module(filename);mod.paths=Module._nodeModulePaths(popup);mod._compile(output[0].code,filename);api=mod.exports;
});
beforeEach(()=>{
 dom=new JSDOM('<div id="root"></div>',{url:'https://popup.invalid',pretendToBeVisual:true});
 global.window=dom.window;global.document=dom.window.document;
 container=document.getElementById('root');saved={};writes=[];listeners=new Set();
 global.chrome={runtime:{lastError:undefined},storage:{onChanged:{addListener:fn=>listeners.add(fn),removeListener:fn=>listeners.delete(fn)},local:{
  get(keys,cb){queueMicrotask(()=>cb(Object.fromEntries(keys.filter(k=>k in saved).map(k=>[k,saved[k]]))))},
  set(values,cb){const changes=Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{oldValue:saved[key],newValue:value}]));Object.assign(saved,values);writes.push(values);listeners.forEach(fn=>fn(changes,'local'));cb()}
 }}};
});
afterEach(()=>{act(()=>{ReactDOM.unmountComponentAtNode(container)});dom.window.close()});
async function mount(component){await act(async()=>{ReactDOM.render(component,container);await Promise.resolve()})}
test('opening settings hydrates without writing defaults or overwriting preferences',async()=>{
 saved.homeButton='off';
 function Control(){const [checked,setChecked]=api.useStorageKeyState('homeButton');return React.createElement('button',{onClick:()=>setChecked(!checked)},String(checked))}
 await mount(React.createElement(Control));assert.equal(container.textContent,'false');assert.equal(writes.length,0);
 act(()=>container.querySelector('button').click());assert.equal(saved.homeButton,'on');assert.equal(writes.length,1);
});
test('external settings updates reach mounted controls and listeners are cleaned up',async()=>{
 function Control(){const [checked]=api.useStorageKeyState('homeButton');return React.createElement('span',null,String(checked))}
 await mount(React.createElement(Control));assert.equal(container.textContent,'true');
 act(()=>listeners.forEach(fn=>fn({homeButton:{newValue:'off'}},'local')));assert.equal(container.textContent,'false');
 act(()=>{ReactDOM.unmountComponentAtNode(container)});assert.equal(listeners.size,0);
});
test('an early user change wins over a delayed initial storage read',async()=>{
 let initialCallback;chrome.storage.local.get=(keys,cb)=>initialCallback=cb;
 function Control(){const [checked,setChecked]=api.useStorageKeyState('homeButton');return React.createElement('button',{onClick:()=>setChecked(false)},String(checked))}
 await mount(React.createElement(Control));act(()=>container.querySelector('button').click());
 await act(async()=>{initialCallback({homeButton:'on'});await Promise.resolve()});assert.equal(container.textContent,'false');assert.equal(saved.homeButton,'off');
});
test('the actual CSS section preserves edits through collapse and immediate popup close',async()=>{
 await mount(React.createElement(api.AdvancedSection));
 act(()=>container.querySelector('button').click());
 act(()=>Simulate.change(container.querySelector('textarea'),{target:{value:'body { color: red; }'}}));
 assert.equal(saved.customCss,'body { color: red; }');
 act(()=>container.querySelector('button').click());act(()=>container.querySelector('button').click());
 assert.equal(container.querySelector('textarea').value,'body { color: red; }');
 act(()=>{ReactDOM.unmountComponentAtNode(container)});await mount(React.createElement(api.AdvancedSection));
 act(()=>container.querySelector('button').click());assert.equal(container.querySelector('textarea').value,'body { color: red; }');
});
