// Advertising assets are kept separate from the exact catalogue photographs.
export interface EditorialVisual { src: string; width: number; height: number; generated: boolean }
export const visuals: Partial<Record<'hero'|'classic'|'original'|'lifestyle'|'personal'|'detail'|'everyday'|'office'|'desk'|'turquoise', EditorialVisual>> = {
 hero:{src:'/images/wearable/hero/black-band.webp',width:315,height:274,generated:true},
 classic:{src:'/images/wearable/collections/classic.webp',width:342,height:221,generated:true},
 original:{src:'/images/wearable/collections/original.webp',width:304,height:221,generated:true},
 personal:{src:'/images/wearable/collections/colour-composition.webp',width:297,height:221,generated:true},
 lifestyle:{src:'/images/wearable/lifestyle/training.webp',width:302,height:274,generated:true},
 everyday:{src:'/images/wearable/lifestyle/everyday.webp',width:302,height:274,generated:true},
 office:{src:'/images/wearable/lifestyle/office.webp',width:254,height:219,generated:true},
 detail:{src:'/images/wearable/details/textile.webp',width:242,height:219,generated:true},
 desk:{src:'/images/wearable/details/on-desk.webp',width:255,height:219,generated:true},
 turquoise:{src:'/images/wearable/products/turquoise-editorial.webp',width:247,height:219,generated:true},
};
export const visualAlt = {
 fr:{hero:'Composition publicitaire : bracelet noir sur une roche sombre.',classic:'Composition publicitaire de bracelets classiques aux couleurs variées.',original:'Composition publicitaire des bracelets à motifs horloge, ours, bus et faucon.',lifestyle:'Scène sportive générée : homme portant un bracelet noir au poignet.',everyday:'Scène générée : femme portant un bracelet beige à l’extérieur.',office:'Scène générée : bracelet bleu porté avec une chemise blanche.',personal:'Composition publicitaire de bracelets beige, bleu marine et bordeaux.',detail:'Vue publicitaire rapprochée de textures textiles bleue, bordeaux et beige.',desk:'Composition publicitaire d’un bracelet noir posé près d’un ordinateur.',turquoise:'Composition publicitaire d’un bracelet turquoise à motif horloge.'},
 en:{hero:'Advertising composition: black band on a dark rock.',classic:'Advertising composition of classic bands in several colours.',original:'Advertising composition of clock, bear, bus and falcon patterned bands.',lifestyle:'Generated sports scene: man wearing a black band on his wrist.',everyday:'Generated scene: woman wearing a beige band outdoors.',office:'Generated scene: blue band worn with a white shirt.',personal:'Advertising composition of beige, navy and burgundy bands.',detail:'Advertising close-up of blue, burgundy and beige textile textures.',desk:'Advertising composition of a black band beside a laptop.',turquoise:'Advertising composition of a turquoise clock-pattern band.'},
 ar:{hero:'تكوين إعلاني لحزام أسود على صخرة داكنة.',classic:'تكوين إعلاني لأحزمة كلاسيكية بألوان متنوعة.',original:'تكوين إعلاني لأحزمة بنقش ساعة ودب وحافلة وصقر.',lifestyle:'مشهد رياضي مولد لرجل يرتدي حزامًا أسود على معصمه.',everyday:'مشهد مولد لامرأة ترتدي حزامًا بيج في الخارج.',office:'مشهد مولد لحزام أزرق مع قميص أبيض.',personal:'تكوين إعلاني لأحزمة بيج وأزرق داكن وعنابي.',detail:'لقطة إعلانية مقربة لأنسجة زرقاء وعنابية وبيج.',desk:'تكوين إعلاني لحزام أسود بجانب حاسوب محمول.',turquoise:'تكوين إعلاني لحزام فيروزي بنقشة ساعة.'},
};
