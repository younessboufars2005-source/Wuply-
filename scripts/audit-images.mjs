import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const files=[];
async function walk(dir) {
 for(const e of await fs.readdir(dir,{withFileTypes:true})) {
  const file=path.join(dir,e.name);
  if(e.isDirectory()) await walk(file);
  else if(/\.(png|webp|jpe?g|avif)$/i.test(file)) {
   const bytes=await fs.readFile(file); const m=await sharp(bytes).metadata();
   files.push({file:file.replaceAll('\\','/'),width:m.width,height:m.height,format:m.format,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
 }
}
await walk('public/images');await walk('assets/inbox');
await fs.writeFile('assets/inbox/image-inventory.json',JSON.stringify(files,null,2)+'\n');
console.log(`${files.length} images inspected. Complete inventory: assets/inbox/image-inventory.json`);
console.log(files.filter(f=>f.file.startsWith('public/')).map(f=>`${f.file}: ${f.width}x${f.height}, ${f.format}, ${f.bytes} bytes`).join('\n'));
