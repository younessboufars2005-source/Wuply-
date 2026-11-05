// Deterministic crops. ImageGen supplied only the small metal repairs;
// all textile, outlines, motifs and other pixels come from the original sheets.
import fs from 'node:fs/promises';
import sharp from 'sharp';

const inbox = 'assets/inbox/bracelets';
const output = 'public/images/bracelets';
await fs.mkdir(output, {recursive:true});
const source = await sharp(`${inbox}/bracelets_15_couleurs.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
const repair = await sharp(`${inbox}/metal-retouched.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
if (source.info.width !== repair.info.width || source.info.height !== repair.info.height) throw new Error('Repair sheet dimensions differ');
const repaired = Buffer.from(source.data);
// Masks cover only each engraved W, with a feathered boundary on the metal.
for (const y of [217,553,891]) for (const x of [280,566,853,1138,1426]) {
  for (let dy=-13;dy<=13;dy++) for(let dx=-15;dx<=15;dx++) {
    const weight = Math.min(1,Math.max(0,(15-Math.abs(dx))/4),Math.max(0,(13-Math.abs(dy))/4));
    const offset = ((y+dy)*source.info.width+x+dx)*3;
    for(let c=0;c<3;c++) {
      // Match the original lighting on both sides of the repair, row by row,
      // to avoid a rectangular change in the metal's brightness.
      const left=((y+dy)*source.info.width+x-20)*3+c;
      const right=((y+dy)*source.info.width+x+20)*3+c;
      const t=(dx+20)/40;
      const correction=(source.data[left]-repair.data[left])*(1-t)+(source.data[right]-repair.data[right])*t;
      const restored=Math.min(255,Math.max(0,repair.data[offset+c]+correction));
      repaired[offset+c]=Math.round(source.data[offset+c]*(1-weight)+restored*weight);
    }
  }
}
await sharp(repaired,{raw:source.info}).png().toFile(`${inbox}/classic-logo-repaired.png`);
const classic = [
 ['noir-noir','Noir','Black','أسود'],['marine-noir','Bleu marine','Navy','أزرق داكن'],
 ['bordeaux-noir','Bordeaux','Burgundy','عنابي'],['orange-noir','Orange','Orange','برتقالي'],
 ['turquoise-noir','Turquoise','Turquoise','فيروزي'],['gris-noir','Gris clair','Light grey','رمادي فاتح'],
 ['beige-noir','Beige','Beige','بيج'],['marron-noir','Marron','Brown','بني'],
 ['olive-noir','Vert olive','Olive green','أخضر زيتوني'],['bleu-clair-noir','Bleu clair','Light blue','أزرق فاتح'],
 ['beige-dore','Beige','Beige','بيج'],['marron-dore','Marron','Brown','بني'],
 ['noir-dore','Noir','Black','أسود'],['gris-dore','Gris clair','Light grey','رمادي فاتح'],
 ['bordeaux-dore','Bordeaux','Burgundy','عنابي'],
];
const names = {fr:'Collection Classique',en:'Classic Collection',ar:'المجموعة الكلاسيكية'};
const originals = [
 ['turquoise-horloge','Turquoise · Horloge','Turquoise · Clock','فيروزي · ساعة','Turquoise, motif horloge et finition métallique grise.','Turquoise, clock design and grey metal finish.','فيروزي بنقشة ساعة وتشطيب معدني رمادي.'],
 ['marine-ours','Bleu marine · Ours','Navy · Bear','أزرق داكن · دب','Bleu marine, motif ours et finition métallique noire.','Navy, bear design and black metal finish.','أزرق داكن بنقشة دب وتشطيب معدني أسود.'],
 ['blanc-londres','Blanc · Bus londonien','White · London bus','أبيض · حافلة لندن','Blanc, motif bus londonien et finition métallique grise.','White, London bus design and grey metal finish.','أبيض بنقشة حافلة لندن وتشطيب معدني رمادي.'],
 ['noir-faucon','Noir · Faucon','Black · Falcon','أسود · صقر','Noir, motif faucon et finition métallique noire.','Black, falcon design and black metal finish.','أسود بنقشة صقر وتشطيب معدني أسود.'],
];
const columns = [60,350,638,930,1218];
const rows = [{top:0,height:345},{top:345,height:333},{top:678,height:346}];
const manifest=[];
async function exportImage(file, rect, id) {
  const crop = await sharp(file).extract(rect).resize({width:324,height:438,fit:'contain',background:'#fff'}).toBuffer();
  await sharp({create:{width:360,height:480,channels:3,background:'#fff'}}).composite([{input:crop,gravity:'centre'}]).webp({quality:92,smartSubsample:true}).toFile(`${output}/${id}.webp`);
  manifest.push({id,source:file,crop:rect});
}
const classicVariants=[];
for (let i=0;i<classic.length;i++) {
 const [slug,fr,en,ar]=classic[i]; const gold=i>=10;
 const id=`classique-${slug}`;
 const name={fr:`${fr} · ${gold?'finition dorée':'finition noire'}`,en:`${en} · ${gold?'gold-tone finish':'black finish'}`,ar:`${ar} · ${gold?'تشطيب ذهبي':'تشطيب أسود'}`};
 const description={fr:`Textile ${fr.toLowerCase()}, partie métallique à finition ${gold?'dorée':'noire'}.`,en:`${en} textile, ${gold?'gold-tone':'black'} metal finish.`,ar:`نسيج ${ar} مع تشطيب معدني ${gold?'ذهبي':'أسود'}.`};
 await exportImage(`${inbox}/classic-logo-repaired.png`,{left:columns[i%5],top:rows[Math.floor(i/5)].top,width:286,height:rows[Math.floor(i/5)].height},id);
 classicVariants.push({id,name,description,availability:'unavailable',demoSelectable:true,image:{src:`/images/bracelets/${id}.webp`,alt:name,width:360,height:480}});
}
const originalVariants=[];
for(let i=0;i<originals.length;i++) {
 const [slug,fr,en,ar,dfr,den,dar]=originals[i];const id=`original-${slug}`;
 const name={fr,en,ar};
 await exportImage(`${inbox}/bracelets_4_modeles_originaux.png`,{left:i%2===0?205:830,top:i<2?8:518,width:470,height:i<2?503:498},id);
 originalVariants.push({id,name,description:{fr:dfr,en:den,ar:dar},availability:'unavailable',demoSelectable:true,image:{src:`/images/bracelets/${id}.webp`,alt:name,width:360,height:480}});
}
const catalog=JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
// Idempotent merge: preserve other collections and existing commercial fields.
for(const collection of [{id:'classique',name:names,variants:classicVariants},{id:'originale',name:{fr:'Collection Originale',en:'Original Collection',ar:'المجموعة الأصلية'},variants:originalVariants}]) {
 const index=catalog.straps.findIndex(s=>s.id===collection.id);
 if(index<0) catalog.straps.push(collection);
 else {
  const existing=catalog.straps[index];
  collection.variants=collection.variants.map(v=>({...v,...existing.variants.find(old=>old.id===v.id),image:v.image}));
  catalog.straps[index]={...existing,...collection,variants:[...collection.variants,...existing.variants.filter(v=>!collection.variants.some(newV=>newV.id===v.id))]};
 }
}
await fs.writeFile('src/data/catalog.json',JSON.stringify(catalog,null,2)+'\n');
await fs.writeFile(`${inbox}/crop-manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${manifest.length} product images; catalogue merged without changing product or prices.`);
