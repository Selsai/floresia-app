// Rôle : Composant réutilisable de l’interface.
// detail-meta : metadonnees des pages.
export function updateDetailMeta({ path, title, description, image, indexable, type = 'website' }) {
  document.title = title;
  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) descriptionTag.setAttribute('content', description);

  const setMeta = (selector, attribute, value) => {
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute[0], attribute[1]);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', value);
  };
  setMeta('meta[property="og:title"]', ['property', 'og:title'], title);
  setMeta('meta[property="og:description"]', ['property', 'og:description'], description);
  setMeta('meta[property="og:type"]', ['property', 'og:type'], type);
  setMeta('meta[name="twitter:title"]', ['name', 'twitter:title'], title);
  setMeta('meta[name="twitter:description"]', ['name', 'twitter:description'], description);
  if (image) {
    setMeta('meta[property="og:image"]', ['property', 'og:image'], image);
    setMeta('meta[name="twitter:image"]', ['name', 'twitter:image'], image);
  }

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
    setMeta('meta[property="og:url"]', ['property', 'og:url'], canonical.href);
  }
}
