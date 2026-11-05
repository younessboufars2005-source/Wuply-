import { useEffect, useState } from 'react';
import { product, straps } from '../data/catalog';
import { translations } from '../i18n';
import { useCart } from '../utils/useCart';
import { addItem } from '../utils/cart.mjs';
import { configurationPrice, money, variants } from '../utils/pricing';
import type { Configuration, Locale } from '../types/catalog';
import { braceletMessages } from '../i18n/bracelets';
export default function Configurator({lang}: {lang: Locale}) {
 const t = translations[lang];
 const available = variants.filter(v => v.availability === 'available' || v.demoSelectable);
 const [strapId, setStrap] = useState(available[0]?.id || '');
 const [quantity, setQuantity] = useState(1);
 const [extras, setExtras] = useState<Record<string, number>>({});
 const [added, setAdded] = useState(false);
 const {setItems, ready, error} = useCart();
 const configuration: Configuration = {productId: product.id, ...(strapId ? {strapId} : {}), extras:Object.entries(extras).filter(([,n]) => n > 0).map(([variantId,quantity]) => ({variantId,quantity}))};
 const price = configurationPrice(configuration);
 const selected = variants.find(v => v.id === strapId);
 const bt = braceletMessages[lang];
 useEffect(() => {
   const requested = new URLSearchParams(window.location.search).get('strap');
   if (requested && variants.some(v => v.id === requested && (v.availability === 'available' || v.demoSelectable))) setStrap(requested);
 }, []);
 return <div className="configurator" id="configuration">
  <span className="eyebrow">{t.demo}</span><h2>{t.form}</h2>
  {selected?.image && <div className="selected-bracelet"><img className="variant-preview" src={selected.image.src} alt={selected.image.alt[lang]} width={selected.image.width} height={selected.image.height}/><p className="tiny">{bt.selected}</p><h3>{selected.name[lang]}</h3>{selected.description && <p>{selected.description[lang]}</p>}</div>}
  {available.length > 0 ? <fieldset><legend>{t.mainStrap}</legend>{straps.map(strap => <div className="bracelet-choices" key={strap.id}><h3>{strap.name[lang]}</h3><div className="bracelet-options">{strap.variants.filter(v => v.availability === 'available' || v.demoSelectable).map(v => <label key={v.id} className="bracelet-option"><input type="radio" name="strap" value={v.id} checked={strapId === v.id} onChange={() => {setStrap(v.id);setAdded(false);}}/>{v.image && <img src={v.image.src} alt="" width={v.image.width} height={v.image.height} loading="lazy"/>}<span>{v.name[lang]}</span></label>)}</div></div>)}</fieldset> : <p className="muted">{t.noVariants}</p>}
  {available.some(v => v.price?.validated) && <fieldset><legend>{t.extras}</legend>{available.filter(v => v.price?.validated).map(v => <label className="quantity-row" key={v.id}>{v.name[lang]}<input type="number" min="0" max="99" value={extras[v.id] || 0} onChange={e => {setExtras({...extras,[v.id]:Math.max(0,Math.min(99,Number(e.target.value)||0))});setAdded(false);}}/></label>)}</fieldset>}
  <label className="quantity-row">{t.quantity}<input type="number" min="1" max="99" value={quantity} onChange={e => {setQuantity(Math.max(1,Math.min(99,Math.floor(Number(e.target.value))||1)));setAdded(false);}}/></label>
  <div className="config-summary"><span className="tiny">{t.summary}</span><p>{product.name[lang]} × {quantity}</p>{selected && <p>{selected.name[lang]}</p>}{configuration.extras.map(e => <p key={e.variantId}>{variants.find(v => v.id === e.variantId)?.name[lang]} × {e.quantity}</p>)}<strong>{price === null ? t.priceHidden : money(price*quantity, lang)}</strong></div>
  <button className="button dark full" disabled={!ready} onClick={() => {setItems(items => addItem(items,configuration,quantity));setAdded(true);}}>{t.add}<span>+</span></button>
  {selected && <button className="button strap-add full" disabled={!ready} onClick={() => {setItems(items => addItem(items,{productId:product.id,itemType:'strap',strapId:selected.id,extras:[]},quantity));setAdded(true);}}>{bt.add}<span>+</span></button>}
  <p role="status" className="notice">{error ? t[error] : added ? t.added : t.local}</p>
  {added && <a className="text-link" href={`/${lang}/cart/`}>{t.cart} ↗</a>}
 </div>;
}
