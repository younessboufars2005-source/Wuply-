export type Locale = 'fr' | 'en' | 'ar';
export type Localized = Record<Locale, string>;
export interface ProductImage { src: string; alt: Localized; width: number; height: number }
export interface Price { amount: number; currency: 'MAD'; validated: boolean }
export type Availability = 'available' | 'unavailable';
export interface Variant { id: string; name: Localized; description?: Localized; image?: ProductImage; availability: Availability; demoSelectable?: boolean; price?: Price }
export interface Strap { id: string; name: Localized; variants: Variant[] }
export interface Product { id: string; name: Localized; images: ProductImage[]; price?: Price; availability: Availability }
export interface Configuration { productId: string; itemType?: 'strap'; strapId?: string; extras: { variantId: string; quantity: number }[] }
export interface CartItem { configuration: Configuration; quantity: number }
export interface Address { fullName: string; email: string; phone: string; city: string; street: string; postalCode: string }
export interface PaymentMethod { id: 'online' | 'cash-on-delivery'; enabled: boolean }
