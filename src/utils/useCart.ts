import { useEffect, useState } from 'react';
import { product, straps } from '../data/catalog';
import type { CartItem } from '../types/catalog';
import { CART_KEY, normalizeCart } from './cart.mjs';
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<'storageError' | 'clearError' | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(normalizeCart(JSON.parse(raw), product.id, straps.flatMap(s => s.variants.map(v => v.id))));
    } catch { setError('clearError'); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
    catch { setError('storageError'); }
  }, [items, ready]);
  return { items, setItems, ready, error };
}
