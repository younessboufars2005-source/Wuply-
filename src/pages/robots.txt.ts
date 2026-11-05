import { site } from '../config/site';
export function GET() {
 return new Response(site.indexable && site.url ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml',site.url).href}\n` : 'User-agent: *\nDisallow: /\n', {headers:{'Content-Type':'text/plain'}});
}
