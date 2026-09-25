// Rôle : Page et interactions de cette fonctionnalité.
// Home : accueil, inspirations et selections.
import { formatPrice } from '../../utils/price';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Flower2, Sparkles } from 'lucide-react';
import { productsApi, articlesApi, CUSTOM_BOUQUET_PRODUCT_ID } from '../../services/api';
import { ProductGridSkeleton, ArticleGridSkeleton } from '../../components/loading/LoadingSkeleton';
import './Home.css';

const occasions = [
  { label: 'Tous', category: null },
  { label: 'Mariage', category: 'MARIAGE' },
  { label: 'Anniversaire', category: 'ANNIVERSAIRE' },
  { label: 'Naissance', category: 'NAISSANCE' },
  { label: 'Deuil', category: 'DEUIL' },
];

const heroImage = '/accueil-hero.webp';

export default function Home() {
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    productsApi.list()
      .then((data) => { if (active) setProducts((Array.isArray(data) ? data : []).filter((product) => product.id !== CUSTOM_BOUQUET_PRODUCT_ID)); })
      .catch(() => { if (active) setProductsError('Les bouquets sont momentanément indisponibles.'); })
      .finally(() => { if (active) setProductsLoading(false); });
    articlesApi.list()
      .then((articles) => { if (active) setBlogPosts(Array.isArray(articles) ? articles.slice(0, 3) : []); })
      .catch(() => { if (active) setBlogPosts([]); })
      .finally(() => { if (active) setArticlesLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleProducts = (selectedOccasion
    ? products.filter((product) => product.category === selectedOccasion)
    : products).slice(0, 4);

  return (
    <div className="home">
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-content">
          <p className="hero-eyebrow"><Flower2 size={16} aria-hidden="true" /> Bienvenue dans l'univers Florésia</p>
          <h1 id="home-title" className="hero-title">Les fleurs ont tant <em>à raconter.</em></h1>
          <p className="hero-sub">Des bouquets inspirants et un atelier de personnalisation pour imaginer la composition qui vous ressemble.</p>
          <div className="hero-actions">
            <Link to="/boutique" className="hero-cta">Explorer les bouquets <ArrowUpRight size={19} aria-hidden="true" /></Link>
            <Link to="/personnaliser" className="hero-secondary">Créer le mien <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <p className="hero-note">Une expérience florale créée pour un projet pédagogique.</p>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-image-frame"><img src={heroImage} alt="Bouquet de fleurs porté avec élégance" className="hero-image" fetchPriority="high" /></div>
          <span className="hero-image-stamp" aria-hidden="true"><Sparkles size={20} /> À votre image</span>
        </div>
      </section>

      <section className="products-section" aria-labelledby="bouquets-title">
        <div className="container">
          <div className="section-heading">
            <div><p className="section-eyebrow">La collection</p><h2 id="bouquets-title" className="home-section-title">Un bouquet pour chaque émotion</h2></div>
            <Link to="/boutique" className="section-more">Voir toute la collection <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="occasions-filters" aria-label="Filtrer les bouquets par occasion">
            {occasions.map(({ label, category }) => (
              <button key={label} type="button" className={`occasion-chip ${selectedOccasion === category ? 'active' : ''}`} onClick={() => setSelectedOccasion(category)} aria-pressed={selectedOccasion === category}>{label}</button>
            ))}
          </div>
          {productsLoading && <ProductGridSkeleton variant="home" count={4} />}
          {productsError && <p className="collection-state" role="alert">{productsError} <Link to="/boutique">Ouvrir la boutique</Link></p>}
          {!productsLoading && !productsError && visibleProducts.length === 0 && <p className="collection-state">Aucun bouquet pour cette occasion pour le moment. <button type="button" onClick={() => setSelectedOccasion(null)}>Voir tous les bouquets</button></p>}
          {!productsLoading && !productsError && <div className="home-products-grid">
            {visibleProducts.map((product) => (
              <article key={product.id} className="home-product-card">
                <Link to={`/produit/${product.id}`} className="home-product-card__link">
                  <div className="home-product-image-wrap"><img src={product.imageUrl} alt={product.name} className="home-product-image" loading="lazy" onLoad={(event) => event.currentTarget.classList.add('is-loaded')} onError={(event) => event.currentTarget.classList.add('is-loaded')} /></div>
                  <div className="home-product-body"><span className="home-product-kicker">Création Florésia</span><h3 className="home-product-name">{product.name}</h3><div className="home-product-footer"><span className="home-product-price">{formatPrice(product.price)}</span><span className="home-product-arrow"><ArrowUpRight size={20} aria-hidden="true" /></span></div></div>
                </Link>
              </article>
            ))}
          </div>}
        </div>
      </section>

      <section className="custom-section" aria-labelledby="custom-title">
        <div className="custom-content">
          <p className="custom-eyebrow"><span className="custom-eyebrow__icon" aria-hidden="true" /> L'atelier Florésia</p>
          <h2 id="custom-title" className="custom-title">Votre bouquet, votre histoire.</h2>
          <p className="custom-sub">Choisissez les fleurs, ajoutez quelques touches végétales si vous le souhaitez, puis découvrez votre composition avant de poursuivre le parcours de démonstration.</p>
          <div className="custom-steps">
            <div className="custom-step"><span className="step-num">01</span><span>Choisissez vos fleurs</span></div>
            <div className="custom-step"><span className="step-num">02</span><span>Ajoutez vos touches</span></div>
            <div className="custom-step"><span className="step-num">03</span><span>Admirez le résultat</span></div>
          </div>
          <Link to="/personnaliser" className="btn-custom">Composer mon bouquet <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="blog-section" aria-labelledby="home-blog-title">
        <div className="container">
          <div className="section-heading"><div><p className="section-eyebrow">À feuilleter</p><h2 id="home-blog-title" className="home-section-title">Le journal floral</h2><p className="home-section-sub">Des idées, des gestes et des histoires à partager.</p></div><Link to="/blog" className="section-more">Tous les articles <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          {articlesLoading ? <ArticleGridSkeleton count={3} /> : blogPosts.length > 0 ? <div className="home-blog-grid">{blogPosts.map((post) => <article key={post.id} className="home-blog-card"><span className="home-blog-category">{post.category}</span><h3 className="home-blog-title">{post.title}</h3><p className="home-blog-excerpt">{post.excerpt}</p><Link to={`/blog/${post.id}`} className="home-blog-link">Lire l'article <ArrowRight size={17} aria-hidden="true" /></Link></article>)}</div> : <p className="collection-state">Les prochains articles apparaîtront ici. <Link to="/blog">Explorer le journal</Link></p>}
        </div>
      </section>
      <section className="closing-section"><div className="container closing-content"><div><p className="section-eyebrow">Envie d'essayer ?</p><h2>La prochaine création commence avec vous.</h2></div><Link to="/personnaliser">Entrer dans l'atelier <ArrowUpRight size={19} aria-hidden="true" /></Link></div></section>
    </div>
  );
}
