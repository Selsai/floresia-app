import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import heroImage from '../assets/accueil-hero.png';
import { productsApi, CUSTOM_BOUQUET_PRODUCT_ID } from '../services/api';
import './Home.css';

export default function Home() {
  const [selectedOccasion, setSelectedOccasion] = useState('Tous');
  const [newsletter, setNewsletter] = useState({ email: '', subscribed: false });
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  const occasions = ['Tous', 'Mariage', 'Anniversaire', 'Deuil', 'Naissance'];

useEffect(() => {
  productsApi
    .list()
    .then((data) => setProducts(data.filter((p) => p.id !== CUSTOM_BOUQUET_PRODUCT_ID)))
    .catch((err) => setProductsError(err.message))
    .finally(() => setProductsLoading(false));
}, []);

  const blogPosts = [
    { id: 1, title: '10 fleurs de printemps pour égayer votre intérieur', category: 'Conseils', readTime: '5 min' },
    { id: 2, title: 'Comment conserver un bouquet plus longtemps ?', category: 'Tutos', readTime: '4 min' },
    { id: 3, title: 'Signification des couleurs de roses', category: 'Déco', readTime: '3 min' }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletter.email) {
      setNewsletter({ ...newsletter, subscribed: true });
    }
  };

  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Sublimer la Vie avec des Fleurs</h1>
          <p className="hero-sub">
            Découvrez notre collection de bouquets artisanaux créés avec passion.
            Chaque création raconte une histoire unique.
          </p>
          <Link to="/boutique" className="hero-cta">
            Découvrir nos jolies bouquets →
          </Link>
        </div>
        <div className="hero-image-wrap">
          <img src={heroImage} alt="Femme tenant un bouquet de fleurs" className="hero-image" />
        </div>
      </section>

      <section className="occasions-section">
        <div className="container">
          <h2 className="section-title">Trouvez le bouquet parfait</h2>
          <div className="occasions-filters">
            {occasions.map((occ) => (
              <button
                key={occ}
                className={`occasion-chip ${selectedOccasion === occ ? 'active' : ''}`}
                onClick={() => setSelectedOccasion(occ)}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {productsError && <p className="error-message">{productsError}</p>}
          {productsLoading && <p>Chargement des produits…</p>}

          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                </div>
                <div className="product-body">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-footer">
                    <span className="product-price">{product.price.toFixed(2)} €</span>
                    <div className="product-actions">
                      <button className="btn-icon" aria-label="Ajouter aux favoris">
                        <FiHeart />
                      </button>
                      <button className="btn-add-cart">
                        <FiShoppingCart size={16} />
                        Panier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="custom-section">
        <div className="custom-content">
          <h2 className="custom-title">Créez votre bouquet sur-mesure</h2>
          <p className="custom-sub">
            Choisissez vos fleurs préférées, vos couleurs, votre budget —
            notre équipe compose votre bouquet unique avec amour.
          </p>
          <div className="custom-steps">
            <div className="custom-step"><div className="step-num">1</div><span>Choisissez vos fleurs</span></div>
            <div className="custom-step"><div className="step-num">2</div><span>Sélectionnez les couleurs</span></div>
            <div className="custom-step"><div className="step-num">3</div><span>Définissez votre budget</span></div>
            <div className="custom-step"><div className="step-num">4</div><span>Recevez votre création</span></div>
          </div>
          <Link to="/personnaliser" className="btn-custom">
            Personnaliser mon bouquet →
          </Link>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <h2 className="section-title">Le Blog Floresia</h2>
          <p className="section-sub">Conseils, astuces et inspirations florales</p>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <div key={post.id} className="blog-card">
                <span className="blog-category">{post.category}</span>
                <h3 className="blog-title">{post.title}</h3>
                <div className="blog-meta">
                  <span>📖 {post.readTime}</span>
                  <Link to={`/blog/${post.id}`} className="blog-link">Lire →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          {!newsletter.subscribed ? (
            <div className="newsletter-content">
              <h2 className="newsletter-title">Restez inspiré</h2>
              <p className="newsletter-sub">
                Recevez nos conseils floraux et nos offres exclusives chaque semaine
              </p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={newsletter.email}
                  onChange={(e) => setNewsletter({ ...newsletter, email: e.target.value })}
                  required
                />
                <button type="submit">S'abonner</button>
              </form>
              <p className="rgpd-note">
                Conformément au RGPD, vos données sont protégées.
                <Link to="/rgpd"> En savoir plus</Link>
              </p>
            </div>
          ) : (
            <div className="subscribed-msg">
              ✅ Merci pour votre inscription ! Vous recevrez bientôt nos inspirations florales.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}