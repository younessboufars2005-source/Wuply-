import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {visuals,visualAlt} from '../src/data/visuals.ts';
import {fileURLToPath} from 'node:url';
test('editorial assets remain separate from exact product variants, with native dimensions and localized alt text',async()=>{
 assert.equal(Object.keys(visuals).length,10);
 for(const [key,visual] of Object.entries(visuals)) {
  assert.ok(visual.generated);
  assert.ok(visual.src.startsWith('/images/wearable/'));
  const image=fileURLToPath(new URL(`../public${visual.src}`,import.meta.url));
  const metadata=await sharp(image).metadata();
  assert.equal(metadata.width,visual.width);assert.equal(metadata.height,visual.height);
  for(const lang of ['fr','en','ar']) assert.ok(visualAlt[lang][key]);
 }
 const catalog=JSON.parse(await fs.readFile(new URL('../src/data/catalog.json',import.meta.url),'utf8'));
 for(const variant of catalog.straps.flatMap(s=>s.variants)) assert.ok(variant.image.src.startsWith('/images/bracelets/'));
});
