// detail-meta : metadonnees des pages.
export function updateDetailMeta({ path, title, description, indexable }) {
  document.title = title;
  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) descriptionTag.setAttribute('content', description);

  let robotsTag = document.querySelector('meta[name="robots"]');
  if (!robotsTag) {
    robotsTag = document.createElement('meta');
    robotsTag.name = 'robots';
    document.head.appendChild(robotsTag);
  }
  robotsTag.content = indexable ? 'index,follow' : 'noindex';

  document.querySelector('link[rel="canonical"]')?.remove();
  const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, '');
  if (siteUrl && indexable) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    const base = import.meta.env.BASE_URL.replace(/^\/|\/$/g, '');
    canonical.href = siteUrl + (base ? '/' + base : '') + path;
    document.head.appendChild(canonical);
  }
}
