export const CART_KEY = 'wearable-cart-v1';
export function normalizeCart(raw, productId, variantIds = []) {
  if (!Array.isArray(raw)) throw new Error('Invalid cart');
  const validQuantity = n => Number.isInteger(n) && n >= 1 && n <= 99;
  return raw.slice(0, 50).filter(item => item && item.configuration?.productId === productId && validQuantity(item.quantity))
    .map(item => ({ quantity: item.quantity, configuration: {
      productId,
      ...(variantIds.includes(item.configuration.strapId) ? { strapId: item.configuration.strapId } : {}),
      extras: (Array.isArray(item.configuration.extras) ? item.configuration.extras : [])
        .filter(e => e && variantIds.includes(e.variantId) && validQuantity(e.quantity))
        .filter((e, i, arr) => arr.findIndex(x => x.variantId === e.variantId) === i)
        .map(e => ({ variantId: e.variantId, quantity: e.quantity }))
    }}));
}
export function configurationKey(configuration) {
  return JSON.stringify([configuration.productId, configuration.strapId || '', [...configuration.extras].sort((a,b) => a.variantId.localeCompare(b.variantId))]);
}
export function addItem(items, configuration, quantity) {
  const key = configurationKey(configuration);
  const existing = items.findIndex(i => configurationKey(i.configuration) === key);
  return existing < 0 ? [...items, { configuration, quantity }] : items.map((item,i) => i === existing ? {...item, quantity: Math.min(99, item.quantity + quantity)} : item);
}
