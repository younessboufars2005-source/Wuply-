import fs from 'node:fs/promises';
import sharp from 'sharp';

const root = 'assets/inbox/wearable-visuals/visuels';
const jobs = [
 ['publicitaires_hero_lifestyle.png','hero/black-band',{left:0,top:0,width:315,height:274}],
 ['collections.png','collections/classic',{left:0,top:1,width:342,height:221}],
 ['collections.png','collections/original',{left:665,top:1,width:304,height:221}],
 ['collections.png','collections/colour-composition',{left:975,top:1,width:297,height:221}],
 ['publicitaires_hero_lifestyle.png','lifestyle/training',{left:925,top:0,width:302,height:274}],
 ['publicitaires_hero_lifestyle.png','lifestyle/everyday',{left:1234,top:0,width:302,height:274}],
 ['details_matieres.png','lifestyle/office',{left:0,top:2,width:254,height:219}],
 ['details_matieres.png','details/textile',{left:1294,top:2,width:242,height:219}],
 ['details_matieres.png','details/on-desk',{left:262,top:2,width:255,height:219}],
 ['details_matieres.png','products/turquoise-editorial',{left:526,top:2,width:247,height:219}],
];
const manifest = [];
for (const [source,name,crop] of jobs) {
 const dest = `public/images/wearable/${name}.webp`;
 await fs.mkdir(dest.slice(0,dest.lastIndexOf('/')), {recursive:true});
 await sharp(`${root}/${source}`).extract(crop).webp({quality:92,effort:6}).toFile(dest);
 manifest.push({source,crop,src:dest.replace('public',''),width:crop.width,height:crop.height,generated:true});
}
await fs.writeFile('assets/inbox/wearable-visuals/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${manifest.length} distinct editorial crops at their native resolution. No catalogue variants changed.`);
