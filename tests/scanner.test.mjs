import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

test('generated selector scan reads counts without network, storage, or clicks',()=>{
 const page=new JSDOM('<main role="main"><div data-testid="primaryColumn"></div></main>',{url:'https://x.com/home',runScripts:'outside-only'});
 const forbidden=()=>{throw new Error('Scanner must be read-only')};
 page.window.fetch=forbidden;page.window.HTMLElement.prototype.click=forbidden;
 Object.defineProperty(page.window,'localStorage',{get:forbidden});
 Object.defineProperty(page.window,'sessionStorage',{get:forbidden});
 page.window.console.table=()=>{};
 const result=page.window.eval(readFileSync(new URL('../diagnostics/scan-x.js',import.meta.url),'utf8'));
 assert.ok(result.length>30);assert.equal(result.find(row=>row.name==='mainColumn').matches,1);
 assert.ok(result.every(row=>row.result!=='invalid selector'));
 assert.equal(result.find(row=>row.name==='grokDrawer').result,'not present on this page');
 page.window.close();
});
