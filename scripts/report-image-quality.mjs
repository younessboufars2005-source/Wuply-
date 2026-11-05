import fs from 'node:fs/promises';
import sharp from 'sharp';
const families=JSON.parse(await fs.readFile('src/data/image-renditions.json','utf8'));
const rows=[];
for(const [original,family] of Object.entries(families)) {
 const before=await sharp(`public${original}`).metadata();
 const beforeBytes=(await fs.stat(`public${original}`)).size;
 const versions=[];
 for(const entry of family.entries)versions.push({...entry,bytes:(await fs.stat(`public${entry.src}`)).size});
 const isHero=original.includes('/hero/');
 const isMotif=/original-|original.webp|turquoise/.test(original);
 const display=isHero?0:/on-desk|turquoise-editorial/.test(original)?160:family.maxDisplayWidth;
 rows.push({
  original,originalExport:{width:before.width,height:before.height,bytes:beforeBytes,format:before.format},
  source:family.source,sourceCrop:{width:family.sourceWidth,height:family.sourceHeight},
  role:isHero?'retired-small-hero':family.role,
  displayMaximumCssPixels:display,
  displayMeasurement:'CSS limit, not a browser measurement',
  renderedAspectRatio:family.role==='catalogue'?'3:4 white canvas':`${family.sourceWidth}:${family.sourceHeight}`,
  retinaAtMaximum:isHero?'not displayed':versions.at(-1).width>=display*2?'covered':'higher-resolution source still needed',
  embeddedText:isMotif?'decorative motif lettering preserved':'no commercial headline identified on inspected sheet',
  exportSettings:family.role==='catalogue'?'WebP 96 for >=270 px, 90 for smaller files; PNG source; no content enlargement':'WebP 94; direct PNG crop; no enlargement',
  versions,
 });
}
await fs.writeFile('docs/image-quality-audit.json',JSON.stringify({
 scope:'All 29 currently configured catalogue and editorial photographs; original sheets and ZIP extractions inspected separately.',
 sourceLimits:'Classics: 286px-wide sheet cells. Originals: 470px-wide sheet cells. Advertising: 242–342px-wide sheet cells. No HD hero found.',
 hero:'No low-resolution full-width image emitted. Desktop/mobile picture structure is ready in src/config/hero.ts.',
 photos:rows,
},null,2)+'\n');
console.log(`${rows.length} photos audited; ${rows.reduce((n,r)=>n+r.versions.length,0)} responsive files. See docs/image-quality-audit.json`);
