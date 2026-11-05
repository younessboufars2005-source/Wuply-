import data from './catalog.json';
import type { Product, Strap } from '../types/catalog';
export const product = data.product as Product;
export const straps = data.straps as Strap[];
