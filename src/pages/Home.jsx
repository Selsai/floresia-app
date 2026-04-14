import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import heroImage from '../assets/accueil-hero.png';
import chatbotIcon from '../assets/icons/iconChatbot.png';
import produit1 from '../assets/products/produit-1.png';
import produit2 from '../assets/products/produit-2.png';
import produit3 from '../assets/products/produit-3.png';
import produit4 from '../assets/products/produit-4.png';
import './Home.css';

export default function Home() {
  const [selectedOccasion, setSelectedOccasion] = useState('Tous');
  const [newsletter, setNewsletter] = useState({ email: '', subscribed: false });

  const occasions = ['Tous', 'Mariage', 'Anniversaire', 'Deuil', 'Naissance'];

  const products = [
    {
      id: 1,
      name: 'Bouquet Rosa Éternelle',
      price: 32,
      rating: 5,
      image: produit1,
      occasions: ['Mariage', 'Anniversaire']
    },
    {
      id: 2,
      name: 'Pivoines Douceur Rose',
      price: 45,
      rating: 5,
      image: produit2,
      occasions: ['Mariage', 'Naissance']
    },
    {
      id: 3,
      name: 'Champêtre Soleil d\'Été',
      price: 28,
      rating: 4,
      image: produit3,
      occasions: ['Anniversaire', 'Naissance']
    },
    {
      id: 4,
      name: 'Romantique Blanc Ivoire',
      price: 38,
      rating: 5,
      image: produit4,
      occasions: ['Mariage', 'Deuil']
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 fleurs de printemps pour égayer votre intérieur',
      category: 'Conseils',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Comment conserver un bouquet plus longtemps ?',
      category: 'Tutos',
      readTime: '4 min'
    },
    {
      id: 3,
      title: 'Signification des couleurs de roses',
      category: 'Déco',
      readTime: '3 min'
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletter.email) {
      setNewsletter({ ...newsletter, subscribed: true });
    }
  };

  return (
    <div className="home">
      
      {/* ═══════ HERO ═══════ */}
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

      {/* ═══════ FILTRES OCCASIONS ═══════ */}
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

      {/* ═══════ PRODUITS ═══════ */}
      <section className="products-section">
        <div className="container">
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} className="product-image" />
                </div>
                <div className="product-body">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{product.price},00 €</span>
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

      {/* ═══════ PERSONNALISATION ═══════ */}
      <section className="custom-section">
        <div className="custom-content">
          <h2 className="custom-title">Créez votre bouquet sur-mesure</h2>
          <p className="custom-sub">
            Choisissez vos fleurs préférées, vos couleurs, votre budget — 
            notre équipe compose votre bouquet unique avec amour.
          </p>
          <div className="custom-steps">
            <div className="custom-step">
              <div className="step-num">1</div>
              <span>Choisissez vos fleurs</span>
            </div>
            <div className="custom-step">
              <div className="step-num">2</div>
              <span>Sélectionnez les couleurs</span>
            </div>
            <div className="custom-step">
              <div className="step-num">3</div>
              <span>Définissez votre budget</span>
            </div>
            <div className="custom-step">
              <div className="step-num">4</div>
              <span>Recevez votre création</span>
            </div>
          </div>
          <Link to="/personnaliser" className="btn-custom">
            Personnaliser mon bouquet →
          </Link>
        </div>
      </section>

      {/* ═══════ BLOG ═══════ */}
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

      {/* ═══════ NEWSLETTER ═══════ */}
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

      {/* ═══════ CHATBOT FAB ═══════ */}
      <Link to="/chatbot" className="chatbot-fab" aria-label="Assistant chatbot">
        <img src={chatbotIcon} alt="Chatbot" />
      </Link>

    </div>
  );
}