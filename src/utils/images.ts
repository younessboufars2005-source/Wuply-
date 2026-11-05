import data from '../data/image-renditions.json';
interface Image {src:string;width:number;height:number}
interface Family {entries:Image[];maxDisplayWidth:number;sourceWidth:number;sourceHeight:number;role:string;source:string}
const families=data as Record<string,Family>;
export function photoProps(image:Image, displayWidth?:number) {
 const family=families[image.src];
 const entries=family?.entries || [image];
 const largest=entries[entries.length-1];
 const maximum=Math.min(displayWidth || family?.maxDisplayWidth || image.width,family?.maxDisplayWidth || image.width);
 return {
  src:largest.src,srcSet:entries.map(e=>`${e.src} ${e.width}w`).join(', '),
  sizes:`(max-width: ${maximum+44}px) calc(100vw - 44px), ${maximum}px`,
  width:largest.width,height:largest.height,
  style:{'--photo-max':`${maximum}px`} as Record<string,string>,
 };
}
