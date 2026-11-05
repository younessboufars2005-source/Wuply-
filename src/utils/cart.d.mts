import type { CartItem, Configuration } from '../types/catalog';
export const CART_KEY: string;
export function normalizeCart(raw: unknown, productId: string, variantIds?: string[]): CartItem[];
export function configurationKey(configuration: Configuration): string;
export function addItem(items: CartItem[], configuration: Configuration, quantity: number): CartItem[];
