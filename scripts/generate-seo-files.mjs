// Rôle : Script utilitaire du build Florésia.
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
const site = env.VITE_SITE_URL?.replace(/\/+$/, '');
if (!site) {
  console.log('SEO: VITE_SITE_URL absent; no public sitemap or robots.txt generated.');
  process.exit(0);
}
const url = new URL(site);
if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
  throw new Error('VITE_SITE_URL must be an HTTPS origin, for example https://floresia.fr');
}
const base = (env.VITE_BASE_PATH || '/').replace(/^\/+|\/+$/g, '');
const routes = ['/', '/boutique', '/personnaliser', '/blog', '/communaute', '/contact', '/mentions-legales', '/cgv', '/confidentialite', '/cookies'];
const api = env.VITE_API_URL?.replace(/\/+$/, '');
if (api) {
  try {
    const [productsResponse, articlesResponse] = await Promise.all([
      fetch(`${api}/products`),
      fetch(`${api}/articles`),
    ]);
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      routes.push(...products
        .filter(product => product?.id && product.id !== 'cmtxj1mhg000c99uhklj59h39')
        .map(product => `/produit/${encodeURIComponent(product.id)}`));
    }
    if (articlesResponse.ok) {
      const articles = await articlesResponse.json();
      routes.push(...articles
        .filter(article => article?.id)
        .map(article => `/blog/${encodeURIComponent(article.id)}`));
    }
  } catch (error) {
    console.warn(`SEO: dynamic catalogue routes unavailable (${error.message}); fixed routes were still generated.`);
  }
}
const publicUrl = (route) => site + (base ? '/' + base : '') + route;
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + routes.map(route => `  <url><loc>${publicUrl(route)}</loc></url>`).join('\n')
  + '\n</urlset>\n';
await writeFile(resolve('dist/sitemap.xml'), sitemap, 'utf8');
await writeFile(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${publicUrl('/sitemap.xml')}\n`, 'utf8');
console.log(`SEO: sitemap.xml and robots.txt generated for ${site}.`);
