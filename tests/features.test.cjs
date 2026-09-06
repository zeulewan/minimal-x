const {test, before, beforeEach, afterEach} = require('node:test');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');
let api, dom, saved, writes, resizeObservers;
before(async()=>{api=await require('./runtime.cjs')()});
beforeEach(()=>{
 dom=new JSDOM('<html><head><title>Home / X</title><link rel="shortcut icon" href="https://x.com/twitter.ico"></head><body></body></html>',{url:'https://x.com/home'});
 for(const key of ['window','document','MutationObserver','sessionStorage'])global[key]=dom.window[key];
 saved={};writes=[];resizeObservers=[];
 global.chrome={runtime:{getURL:p=>'https://extension.invalid/'+p,lastError:undefined},storage:{local:{
  get(keys,cb){cb(Object.fromEntries(keys.filter(k=>k in saved).map(k=>[k,saved[k]])))},
  set(values,cb){writes.push(values);Object.assign(saved,values);cb()}
 }}};
 global.ResizeObserver=class{
  constructor(cb){this.callback=cb;resizeObservers.push(this)}
  observe(target){this.target=target}
  disconnect(){this.target=null}
 };
});
afterEach(()=>dom.window.close());
const tick=()=>new Promise(r=>setTimeout(r,0));
function tabs(items){
 document.body.innerHTML='<div data-testid="primaryColumn"><div role="tablist" data-testid="ScrollSnap-List">'+items.map(([name,selected,href])=>`<div role="presentation"><a role="tab" aria-selected="${!!selected}" ${href?`href="${href}"`:''}><span>${name}</span></a></div>`).join('')+'</div></div>';
 const nodes=[...document.querySelectorAll('[role=tab]')];
 nodes.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();nodes.forEach(n=>n.setAttribute('aria-selected',String(n===t)))}));
 return nodes;
}
test('all rapid independent settings persist and each promise reports its write',async()=>{
 const requested=[{stickyHeader:'off'},{homeButton:'off'},{exploreButton:'off'}];
 assert.deepEqual(await Promise.all(requested.map(api.setStorage)),requested);
 assert.deepEqual(saved,Object.assign({},...requested));assert.equal(writes.length,3);
});
test('shared storage returns defaults and surfaces runtime errors',async()=>{
 assert.equal(await api.getStorage('timelineWidth'),700);
 assert.deepEqual(await api.getStorage(['homeButton','customCss']),{homeButton:'on',customCss:''});
 chrome.runtime.lastError={message:'Quota exceeded'};
 await assert.rejects(api.setStorage({customCss:'x'}),/Quota exceeded/);
 await assert.rejects(api.getStorage('customCss'),/Quota exceeded/);
});
test('Following selects by identity after reorder, then leaves it selected',()=>{
 const nodes=tabs([['Following',false],['My list',true],['For you',false]]);
 api.changeFollowingTimeline('on');assert.equal(nodes[0].getAttribute('aria-selected'),'true');
 api.changeFollowingTimeline('on');assert.equal(nodes[1].getAttribute('aria-selected'),'false');
});
test('Following supports localized text when the link identifies the feed',()=>{
 const nodes=tabs([['Para ti',true],['Siguiendo',false,'/home?f=live']]);
 api.changeFollowingTimeline('on');assert.equal(nodes[1].getAttribute('aria-selected'),'true');
});
test('Following does not switch search/profile tabs or an unidentified Home tab',()=>{
 for(const pathname of ['/search','/someone','/home']){
  dom.reconfigure({url:'https://x.com'+pathname});const nodes=tabs([['Top',true],['Latest',false]]);
  api.changeFollowingTimeline('on');assert.equal(nodes[0].getAttribute('aria-selected'),'true');
 }
});
test('custom CSS works offline, survives unrelated settings, and can be cleared',async()=>{
 api.changeCustomCss('body { color: red; }');
 await api.applyStaticFeatures({homeButton:'off'});
 assert.equal(document.getElementById('custom-css').textContent,'body { color: red; }');
 assert.equal(document.head.lastElementChild.id,'custom-css');
 api.changeCustomCss('');assert.equal(document.getElementById('custom-css').textContent,'');
});
test('stylesheet setup never fetches remote code and is idempotent',async()=>{
 const originalFetch=global.fetch;global.fetch=()=>{throw new Error('unexpected remote dependency')};
 try{await api.addStylesheets();await api.addStylesheets();assert.equal(document.querySelectorAll('link[id^=mt-]').length,1)}finally{global.fetch=originalFetch}
});
test('unchanged style application emits no DOM mutation and preserves custom cascade',async()=>{
 api.changeCustomCss('body {color: red}');api.addStyles('test','body {color: blue}');
 let mutations=0;const observer=new MutationObserver(records=>mutations+=records.length);
 observer.observe(document.head,{subtree:true,childList:true,characterData:true});
 for(let i=0;i<100;i++)api.addStyles('test','body {color: blue}');
 await tick();assert.equal(mutations,0);assert.equal(document.head.lastElementChild.id,'custom-css');observer.disconnect();
});
test('Grok reuses handlers/observers, supports late drawers, and disconnects on disable',()=>{
 const clickHandlers=new Set();const add=document.addEventListener.bind(document),remove=document.removeEventListener.bind(document);
 document.addEventListener=(t,fn,...rest)=>{if(t==='click')clickHandlers.add(fn);add(t,fn,...rest)};
 document.removeEventListener=(t,fn,...rest)=>{if(t==='click')clickHandlers.delete(fn);remove(t,fn,...rest)};
 document.body.innerHTML='<button><svg><path></path></svg></button>';
 document.querySelector('path').setAttribute('d',api.selectors.grokSvg.match(/d="([^"]+)"/)[1]);
 api.enableGrokDrawerOnGrokButtonClick('on');document.querySelector('button').click();
 document.body.insertAdjacentHTML('beforeend','<div data-testid="GrokDrawer"><div data-testid="GrokDrawerHeader"><span>A</span><span>B</span></div></div>');
 for(let i=0;i<100;i++)api.enableGrokDrawerOnGrokButtonClick('on');
 assert.equal(clickHandlers.size,1);assert.equal(resizeObservers.length,1);
 const drawer=document.querySelector('[data-testid=GrokDrawer]');assert.ok(drawer.classList.contains('mt-grok-drawer-enabled'));
 const header=drawer.firstElementChild;header.innerHTML='<button>Closed</button>';
 resizeObservers[0].callback([{target:header}]);assert.ok(!drawer.classList.contains('mt-grok-drawer-enabled'));
 api.enableGrokDrawerOnGrokButtonClick('off');assert.equal(clickHandlers.size,0);assert.equal(resizeObservers[0].target,null);
});
test('title notifications can be disabled and re-enabled without stale observers',async()=>{
 api.changeTitleNotifications('off');document.title='(3) Home / X';await tick();assert.equal(document.title,'Home / X');
 api.changeTitleNotifications('on');assert.equal(document.title,'(3) Home / X');
 document.title='(4) Home / X';await tick();assert.equal(document.title,'(4) Home / X');
});
test('title processing safely handles a missing favicon and replaced title node',async()=>{
 document.querySelector('link').remove();api.changeTitleNotifications('off');
 const title=document.createElement('title');title.textContent='(5) Notifications / X';document.querySelector('title').replaceWith(title);
 await tick();assert.equal(document.title,'Notifications / X');
});
test('mutation filtering examines every record and every changed node',()=>{
 const style=document.createElement('style');style.id='mt-style-example';const post=document.createElement('article');
 const record=(nodes,target=document.body)=>({target,addedNodes:nodes,removedNodes:[]});
 assert.equal(api.isMutationSkippable([record([style],document.head),record([post])]),false);
 assert.equal(api.isMutationSkippable([record([style,post])]),false);
 assert.equal(api.isMutationSkippable([record([style],document.head)]),true);
 assert.equal(api.isMutationSkippable([record([post],document.createElement('nav'))]),false);
});
test('search handlers do not accumulate and a missing placeholder is safe',()=>{
 document.body.innerHTML='<div data-testid="sidebarColumn"><form role="search"><input></form></div>';
 const handlers=new Map();const add=document.addEventListener.bind(document);
 document.addEventListener=(type,fn,options)=>{if(!handlers.has(type))handlers.set(type,new Set());handlers.get(type).add(fn);add(type,fn,options)};
 for(let i=0;i<100;i++)api.addSmallerSearchBarStyle();
 assert.equal(handlers.get('click').size,1);assert.equal(handlers.get('focusin').size,1);
});
test('all supported timeline widths are applied and invalid values leave them unchanged',()=>{
 for(const width of [600,650,700,750,800]){api.changeTimelineWidth(width);assert.match(document.getElementById('mt-style-timelineWidth').textContent,new RegExp(`width: ${width}px`))}
 api.changeTimelineWidth('bad');assert.match(document.getElementById('mt-style-timelineWidth').textContent,/800px/);
});
test('the complete content-script lifecycle initializes offline and applies setting changes',async()=>{
 const {rollup}=require('rollup');const path=require('path');
 const bundle=await rollup({input:path.join(__dirname,'../content-scripts/src/index.js')});
 const {output}=await bundle.generate({format:'iife'});await bundle.close();
 const page=new JSDOM('<html><head><title>Home / X</title></head><body><main role="main"><div data-testid="primaryColumn"></div></main></body></html>',{url:'https://x.com/home',runScripts:'outside-only'});
 const values={};const listeners=[];const failures=[];
 page.window.chrome={runtime:{getURL:p=>'https://extension.invalid/'+p},storage:{onChanged:{addListener:fn=>listeners.push(fn)},local:{get(keys,cb){cb(Object.fromEntries(keys.filter(k=>k in values).map(k=>[k,values[k]])))}}}};
 page.window.fetch=()=>{throw new Error('Startup must work offline')};
 page.window.console.error=(...args)=>failures.push(args.join(' '));
 page.window.eval(output[0].code);
 await new Promise(r=>setTimeout(r,80));
 assert.ok(page.window.document.getElementById('mt-style-timelineWidth'));
 values.customCss='body { color: red; }';await listeners[0]({customCss:{newValue:values.customCss}},'local');
 values.homeButton='off';await listeners[0]({homeButton:{newValue:'off'}},'local');
 assert.equal(page.window.document.getElementById('custom-css').textContent,values.customCss);
 assert.ok(page.window.document.getElementById('mt-style-home'));
 await new Promise(r=>setTimeout(r,80));assert.deepEqual(failures,[]);
 page.window.close();
});

test('Hide For You follows tab identity and removes hiding outside Home',()=>{
 const nodes=tabs([['Following',false],['My list',true],['For you',false]]);
 api.changeHideForYouTimeline('on');
 assert.equal(nodes[0].getAttribute('aria-selected'),'true');
 assert.ok(nodes[2].parentElement.classList.contains('mt-for-you-tab'));
 assert.ok(!nodes[0].parentElement.classList.contains('mt-for-you-tab'));
 dom.reconfigure({url:'https://x.com/search'});
 api.changeHideForYouTimeline('on');
 assert.equal(document.querySelector('.mt-for-you-tab'),null);
 assert.equal(document.getElementById('mt-style-hideForYouTimeline'),null);
});
test('Hide For You can be disabled without leaving hidden tabs',()=>{
 const nodes=tabs([['For you',true],['Following',false]]);
 api.changeHideForYouTimeline('on');api.changeHideForYouTimeline('off');
 assert.equal(document.querySelector('.mt-for-you-tab'),null);
 assert.equal(document.getElementById('mt-style-hideForYouTimeline'),null);
});
