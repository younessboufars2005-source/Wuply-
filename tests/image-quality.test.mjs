import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {heroMedia,usableHero} from '../src/config/hero.ts';
const families=JSON.parse(await fs.readFile(new URL('../src/data/image-renditions.json',import.meta.url),'utf8'));

test('all catalogue and editorial responsive files match descriptors and never exceed source width',async()=>{
 assert.equal(Object.keys(families).length,29);
 for(const family of Object.values(families)) {
  const largest=family.entries.at(-1);
  assert.ok(largest.width<=family.sourceWidth);
  assert.ok(family.maxDisplayWidth<=largest.width);
  for(const entry of family.entries) {
   const meta=await sharp(fileURLToPath(new URL(`../public${entry.src}`,import.meta.url))).metadata();
   assert.equal(meta.width,entry.width);assert.equal(meta.height,entry.height);
   assert.equal(meta.format,'webp');
   if(family.role==='catalogue')assert.equal(meta.width/meta.height,3/4);
  }
 }
});
test('small contact-sheet crops cannot become full-width hero photography',()=>{
 assert.equal(usableHero({src:'/small.webp',width:315,height:274}),false);
 assert.equal(usableHero({src:'/wide.webp',width:1920,height:1080}),true);
 assert.equal(usableHero({src:'/portrait.webp',width:1080,height:1440},true),true);
 assert.equal(heroMedia.desktop,null,'No suitable high-resolution source was supplied');
 assert.equal(heroMedia.mobile,null);
});
