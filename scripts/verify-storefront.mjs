// Run after npm run build. Validates generated routes, assets and internal links.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root = path.resolve('dist');
const catalog = JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
let pages=0, links=0, images=0;
for (const lang of ['fr','en','ar']) {
 for (const route of ['', 'catalog/', 'product/', 'cart/', 'checkout/']) {
  const pathname=`/${lang}/${route}`;
  const html=await fs.readFile(path.join(root,pathname,'index.html'),'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${pathname}: unique H1`);
  assert.ok(html.includes(`lang="${lang}"`));
  if(lang==='ar') assert.ok(html.includes('dir="rtl"'));
  if(route==='catalog/') {
   assert.equal((html.match(/class="bracelet-card"/g)||[]).length,19);
   for(const v of catalog.straps.flatMap(s=>s.variants)) assert.ok(html.includes(v.image.src));
  }
  if(route==='product/') assert.equal((html.match(/name="strap"/g)||[]).length,19);
  if(!route) assert.ok(!html.includes('<astro-island'),'Homepage remains static');
  for(const [,href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
   const url=new URL(href.replaceAll('&amp;','&'),`http://localhost${pathname}`);
   if(url.origin!=='http://localhost') continue;
   const target=path.join(root,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');
   await fs.access(target);
   if(url.hash) {
    const targetHtml=await fs.readFile(target,'utf8');
    assert.ok(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${pathname}: missing anchor ${href}`);
   }
   links++;
  }
  for(const [,src,width,height] of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*width="(\d+)"[^>]*height="(\d+)"/g)) {
   if(!src.startsWith('/')) continue;
   const meta=await sharp(path.join(root,src)).metadata();
   assert.equal(Number(width)/Number(height),meta.width/meta.height,`${src}: declared aspect ratio`);
   images++;
  }
  pages++;
 }
}
assert.ok(!((await fs.readdir('dist/images/bracelets')).some(f=>f.endsWith('.zip'))),'No raw source archive in published assets');
console.log(`Verified ${pages} localized pages, ${links} internal links/anchors and ${images} image references.`);
