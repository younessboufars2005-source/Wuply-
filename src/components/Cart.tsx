import {useCart} from '../utils/useCart';
import {product} from '../data/catalog';
import {translations} from '../i18n';
import {configurationPrice,money,variants} from '../utils/pricing';
import type {Locale} from '../types/catalog';
export default function Cart({lang}: {lang:Locale}) {
 const t = translations[lang]; const {items,setItems,error,ready} = useCart();
 const amounts = items.map(item => configurationPrice(item.configuration));
 const total = amounts.some(n => n === null) ? null : amounts.reduce<number>((sum,n,i) => sum + (n || 0)*items[i].quantity,0);
 return <div aria-busy={!ready}>
 {error && <p role="alert">{t[error]}</p>}
 {!items.length ? <div className="empty-state"><span className="empty-symbol" aria-hidden="true">◒</span><h2>{t.empty}</h2><p>{t.emptyText}</p><a className="button dark" href={`/${lang}/product/`}>{t.discover}<span>↗</span></a></div> : <div className="cart-layout"><div>{items.map((item,i) => <article className="cart-item" key={i}><div className="cart-item-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</div><div><h2>{product.name[lang]}</h2>{item.configuration.strapId && <p>{variants.find(v => v.id === item.configuration.strapId)?.name[lang]}</p>}{item.configuration.extras.map(extra => <p key={extra.variantId}>{variants.find(v => v.id === extra.variantId)?.name[lang]} × {extra.quantity}</p>)}<p className="muted">{amounts[i] === null ? t.priceHidden : money(amounts[i]!*item.quantity,lang)}</p><button className="remove" onClick={() => setItems(items.filter((_,j) => j!==i))}>{t.remove}</button></div><label className="cart-quantity">{t.quantity}<input type="number" min="1" max="99" value={item.quantity} onChange={e => setItems(items.map((current,j) => j===i ? {...current,quantity:Math.max(1,Math.min(99,Math.floor(Number(e.target.value))||1))} : current))}/></label></article>)}</div><aside className="cart-summary"><h2>{t.summary}</h2><div className="summary-line"><span>{t.subtotal}</span><strong>{total === null ? t.priceHidden : money(total,lang)}</strong></div>{total === null && <p>{t.totalUnknown}</p>}<p className="notice">{t.local}</p><a className="button dark full" href={`/${lang}/checkout/`}>{t.checkout}<span>↗</span></a><p className="tiny">{t.disabled}</p></aside></div>}
 </div>;
}
