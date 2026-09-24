// PageMeta : titres et descriptions SEO.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pages = {
  '/': ['Florésia | Bouquets et inspirations florales', 'Découvrez les bouquets, conseils floraux et compositions personnalisées du projet pédagogique Florésia.'],
  '/boutique': ['Bouquets | Florésia', 'Parcourez les bouquets de démonstration Florésia et trouvez une inspiration pour chaque occasion.'],
  '/personnaliser': ['Composer un bouquet | Florésia', 'Imaginez un bouquet personnalisé avec les fleurs et feuillages du catalogue de démonstration Florésia.'],
  '/blog': ['Conseils et inspirations florales | Florésia', 'Retrouvez les articles et conseils du blog Florésia autour des fleurs et des bouquets.'],
  '/communaute': ['Communauté florale | Florésia', 'Découvrez les avis et les créations partagés dans la communauté de démonstration Florésia.'],
  '/contact': ['Contact | Florésia', 'Contactez la responsable du projet pédagogique Florésia et trouvez les informations relatives aux données.'],
  '/mentions-legales': ['Mentions légales | Florésia', 'Consultez les informations sur l’édition et l’hébergement du projet Florésia.'],
  '/cgv': ['Conditions de la démonstration | Florésia', 'Comprenez le fonctionnement de la boutique fictive, du paiement de test et des commandes simulées Florésia.'],
  '/confidentialite': ['Confidentialité | Florésia', 'Découvrez les données et les services utilisés par la démonstration Florésia.'],
  '/cookies': ['Cookies et stockage local | Florésia', 'Comprenez les données conservées dans votre navigateur par le projet Florésia.'],
  '/compte': ['Mon compte | Florésia', 'Gérez votre compte Florésia.'],
  '/panier': ['Votre panier | Florésia', 'Consultez votre panier de démonstration Florésia.'],
  '/admin': ['Administration | Florésia', 'Espace réservé à la modération du projet.'],
  '/commande/succes': ['Suivi du paiement | Florésia', 'Vérifiez le statut de votre commande de démonstration.'],
  '/commande/annulee': ['Paiement interrompu | Florésia', 'Reprenez votre panier de démonstration.'],
  '/mot-de-passe-oublie': ['Mot de passe oublié | Florésia', 'Demandez un lien de récupération de votre compte.'],
  '/reinitialiser-mot-de-passe': ['Nouveau mot de passe | Florésia', 'Réinitialisez le mot de passe de votre compte.'],
  '/verification-email': ['Vérification email | Florésia', 'Vérifiez votre adresse email.'],
};

const privatePrefixes = ['/compte', '/panier', '/commande/', '/admin', '/mot-de-passe-oublie', '/reinitialiser-mot-de-passe', '/verification-email'];

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname === '/rgpd' ? '/confidentialite' : pathname;
    const isPrivatePage = privatePrefixes.some(prefix => normalizedPath.startsWith(prefix));
    const isPublicPage = !isPrivatePage && (Boolean(pages[normalizedPath]) || normalizedPath.startsWith('/produit/') || normalizedPath.startsWith('/blog/'));
    const [title, description] = pages[normalizedPath]
      || (normalizedPath.startsWith('/produit/') ? ['Bouquet | Florésia', 'Découvrez ce bouquet du catalogue Florésia.']
        : normalizedPath.startsWith('/blog/') ? ['Article du blog | Florésia', 'Lisez un article du blog Florésia.']
          : ['Page introuvable | Florésia', 'Cette page n’existe pas sur Florésia.']);

    document.title = title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', description);

    const setMeta = (selector, attribute, value) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        const [name, key] = attribute;
        tag.setAttribute(name, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    };
    setMeta('meta[property="og:title"]', ['property', 'og:title'], title);
    setMeta('meta[property="og:description"]', ['property', 'og:description'], description);
    setMeta('meta[name="twitter:title"]', ['name', 'twitter:title'], title);
    setMeta('meta[name="twitter:description"]', ['name', 'twitter:description'], description);

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', isPublicPage ? 'index,follow' : 'noindex');

    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) canonicalTag.remove();
    const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, '');
    if (siteUrl && isPublicPage) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      const base = import.meta.env.BASE_URL.replace(/^\/|\/$/g, '');
      canonical.href = siteUrl + (base ? '/' + base : '') + (normalizedPath === '/' ? '/' : normalizedPath);
      document.head.appendChild(canonical);
      setMeta('meta[property="og:url"]', ['property', 'og:url'], canonical.href);
    }
  }, [pathname]);

  return null;
}
