import { useEffect, useState } from 'react';
import { product, straps } from '../data/catalog';
import { translations } from '../i18n';
import { storefront } from '../i18n/storefront';
import { braceletMessages } from '../i18n/bracelets';
import { useCart } from '../utils/useCart';
import { addItem } from '../utils/cart.mjs';
import { configurationPrice, money, variants } from '../utils/pricing';
import type { Configuration, Locale } from '../types/catalog';
import {photoProps} from '../utils/images';
import ArrowIcon from './ArrowIcon';

export default function Configurator({lang}: {lang: Locale}) {
 const t = translations[lang];
 const s = storefront[lang];
 const bt = braceletMessages[lang];
 const available = variants.filter(v => v.availability === 'available' || v.demoSelectable);
 const [strapId, setStrap] = useState(available[0]?.id || '');
 const [quantity, setQuantity] = useState(1);
 const [extras, setExtras] = useState<Record<string, number>>({});
 const [added, setAdded] = useState(false);
 const {setItems, ready, error} = useCart();
 const selected = variants.find(v => v.id === strapId);
 const collection = straps.find(c => c.variants.some(v => v.id === strapId));
 const configuration: Configuration = {
   productId: product.id, ...(strapId ? {strapId} : {}),
   extras: Object.entries(extras).filter(([,n]) => n > 0).map(([variantId,quantity]) => ({variantId,quantity})),
 };
 const strapConfiguration: Configuration = {productId:product.id,itemType:'strap',strapId,extras:[]};
 const strapPrice = configurationPrice(strapConfiguration);
 const devicePrice = configurationPrice(configuration);

 useEffect(() => {
   const requested = new URLSearchParams(window.location.search).get('strap');
   if (requested && variants.some(v => v.id === requested && (v.availability === 'available' || v.demoSelectable))) setStrap(requested);
 }, []);

 function choose(id: string) {
   setStrap(id); setAdded(false);
   const url = new URL(window.location.href);
   url.searchParams.set('strap',id);
   window.history.replaceState(null,'',url);
 }
 function add(configuration: Configuration) {
   setItems(items => addItem(items,configuration,quantity)); setAdded(true);
 }

 return <div className="configurator premium-configurator" id="configuration">
  <div className="config-gallery">
   {selected?.image && <figure><img className="variant-preview native-photo" {...photoProps(selected.image)} alt={selected.image.alt[lang]} loading="eager" fetchPriority="high"/><figcaption>{s.real}</figcaption></figure>}
   <div className="gallery-note"><span>01 / {String(available.length).padStart(2,'0')}</span><span>{s.colors}</span></div>
  </div>
  <div className="config-panel">
   <span className="eyebrow">{collection?.name[lang] || t.form}</span>
   <h2>{selected?.name[lang] || t.form}</h2>
   {selected?.description && <p className="variant-description">{selected.description[lang]}</p>}
   <p className="product-price">{strapPrice === null ? t.priceHidden : money(strapPrice*quantity,lang)}</p>
   {available.length ? <fieldset className="variant-fieldset"><legend>{s.colors}</legend>
    {straps.map(strap => <details className="bracelet-choices" key={strap.id} open={collection?.id === strap.id}>
     <summary>{strap.name[lang]}<span>{String(strap.variants.length).padStart(2,'0')} +</span></summary>
     <div className="bracelet-options">{strap.variants.filter(v => v.availability === 'available' || v.demoSelectable).map(v =>
      <label key={v.id} className="bracelet-option"><input type="radio" name="strap" value={v.id} checked={strapId === v.id} onChange={() => choose(v.id)}/>
       {v.image && <img className="native-photo" {...photoProps(v.image,72)} alt="" loading="lazy"/>}<span>{v.name[lang]}</span>
      </label>)}</div>
    </details>)}
   </fieldset> : <p className="muted">{t.noVariants}</p>}
   <label className="quantity-row">{t.quantity}<input type="number" min="1" max="99" value={quantity} onChange={e => {setQuantity(Math.max(1,Math.min(99,Math.floor(Number(e.target.value))||1)));setAdded(false);}}/></label>
   {selected && <button className="button light full" disabled={!ready} onClick={() => add(strapConfiguration)}>{bt.add}<ArrowIcon /></button>}
   <p role="status" className="notice">{error ? t[error] : added ? t.added : t.local}</p>
   {added && <a className="text-link" href={`/${lang}/cart/`}>{t.cart}<ArrowIcon /></a>}
   <p className="compatibility-note">{s.compatibility}</p>
   <details className="device-options"><summary>{s.device}<span>+</span></summary>
    {available.some(v => v.price?.validated) && <fieldset><legend>{t.extras}</legend>{available.filter(v => v.price?.validated).map(v => <label className="quantity-row" key={v.id}>{v.name[lang]}<input type="number" min="0" max="99" value={extras[v.id] || 0} onChange={e => {setExtras({...extras,[v.id]:Math.max(0,Math.min(99,Math.floor(Number(e.target.value))||0))});setAdded(false);}}/></label>)}</fieldset>}
    <div className="config-summary"><span className="tiny">{t.summary}</span><p>{product.name[lang]} × {quantity}</p>{selected && <p>{selected.name[lang]}</p>}{configuration.extras.map(e => <p key={e.variantId}>{variants.find(v => v.id === e.variantId)?.name[lang]} × {e.quantity}</p>)}<strong>{devicePrice === null ? t.priceHidden : money(devicePrice*quantity,lang)}</strong></div>
    <button className="button strap-add full" disabled={!ready} onClick={() => add(configuration)}>{s.deviceAdd}<span>+</span></button>
   </details>
  </div>
 </div>;
}
