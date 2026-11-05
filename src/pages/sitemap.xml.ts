import { site } from '../config/site';
import { locales } from '../i18n';
export function GET() {
 const urls = site.url && site.indexable ? locales.flatMap(l => ['', 'product/'].map(path => `<url><loc>${new URL(`/${l}/${path}`,site.url).href.replaceAll('&','&amp;')}</loc></url>`)).join('') : '';
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {headers:{'Content-Type':'application/xml'}});
}
