// Read lossless source sheets, never resize a small WebP back up.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const catalog=JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
const crops=JSON.parse(await fs.readFile('assets/inbox/bracelets/crop-manifest.json','utf8'));
const editorials=JSON.parse(await fs.readFile('assets/inbox/wearable-visuals/manifest.json','utf8'));
const families={};
await fs.mkdir('public/images/bracelets/responsive',{recursive:true});
await fs.mkdir('public/images/wearable/responsive',{recursive:true});
for(const variant of catalog.straps.flatMap(s=>s.variants)) {
 const source=crops.find(c=>c.id===variant.id);
 if(!source)throw new Error(`Missing exact source for ${variant.id}`);
 const max=variant.id.startsWith('original-')?360:270;
 const widths=[90,180,270,...(max===360?[360]:[])];
 const entries=[];
 for(const width of widths) {
  const height=width*4/3;
  const sourceCrop=await sharp(source.source).extract(source.crop)
   .resize({width:Math.round(width*.94),height:Math.round(height*.94),fit:'inside',withoutEnlargement:true}).png().toBuffer();
  const src=`/images/bracelets/responsive/${variant.id}-${width}.webp`;
  await sharp({create:{width,height,channels:3,background:'#fff'}})
   .composite([{input:sourceCrop,gravity:'centre'}]).webp({quality:width>=270?96:90,smartSubsample:true}).toFile(`public${src}`);
  entries.push({src,width,height});
 }
 families[variant.image.src]={entries,maxDisplayWidth:270,sourceWidth:source.crop.width,sourceHeight:source.crop.height,role:'catalogue',source:source.source};
}
for(const editorial of editorials) {
 const widths=[120,Math.min(240,editorial.width),editorial.width].filter((w,i,a)=>a.indexOf(w)===i);
 const entries=[];
 for(const width of widths) {
  const height=Math.round(width*editorial.height/editorial.width);
  const src=`/images/wearable/responsive/${editorial.src.split('/').pop().replace('.webp','')}-${width}.webp`;
  await sharp(`assets/inbox/wearable-visuals/visuels/${editorial.source}`).extract(editorial.crop)
   .resize({width,withoutEnlargement:true}).webp({quality:94,smartSubsample:true}).toFile(`public${src}`);
  entries.push({src,width,height});
 }
 families[editorial.src]={entries,maxDisplayWidth:editorial.width,sourceWidth:editorial.width,sourceHeight:editorial.height,role:'editorial',source:editorial.source};
}
await fs.writeFile('src/data/image-renditions.json',JSON.stringify(families,null,2)+'\n');
console.log(`Prepared native-or-smaller responsive families for ${Object.keys(families).length} images. Originals untouched.`);
