export function toSlug(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '-')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function productPath(product) {
  return `/produit/${toSlug(product?.name)}`;
}

export function articlePath(article) {
  return `/blog/${toSlug(article?.title)}`;
}

export function matchesSlugOrId(item, routeValue, labelKey) {
  if (!item || !routeValue) return false;
  return item.id === routeValue || toSlug(item[labelKey]) === toSlug(routeValue);
}
