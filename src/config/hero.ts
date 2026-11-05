// Add actual high-resolution photography here when supplied.
// The existing 315x274 crop is intentionally NOT a full-screen background.
export interface HeroPhotograph {
 src:string; width:number; height:number;
 sources?:{src:string;width:number}[];
 position?:string;
}
export const heroMedia: {
 desktop:HeroPhotograph|null;
 mobile:HeroPhotograph|null;
} = {desktop:null,mobile:null};
export function usableHero(image:HeroPhotograph|null, mobile=false) {
 return !!image && image.width >= (mobile?900:1920) && image.height >= (mobile?1200:900);
}
