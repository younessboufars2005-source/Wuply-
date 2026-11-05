import { product, straps } from '../data/catalog';
import { site } from '../config/site';
import type { Configuration, Locale } from '../types/catalog';
export const variants = straps.flatMap(s => s.variants);
export function configurationPrice(c: Configuration): number | null {
  if (!site.showPrices || !product.price?.validated) return null;
  let total = product.price.amount;
  for (const extra of c.extras) {
    const variant = variants.find(v => v.id === extra.variantId);
    if (!variant?.price?.validated) return null;
    total += variant.price.amount * extra.quantity;
  }
  return total;
}
export function money(amount: number, lang: Locale) {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-MA' : 'en-MA', {style:'currency', currency:'MAD'}).format(amount);
}
