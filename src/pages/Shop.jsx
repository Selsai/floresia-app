import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch, FiArrowUp } from 'react-icons/fi';
import { productsApi, favoritesApi, CUSTOM_BOUQUET_PRODUCT_ID } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import iconeCiseau from '../assets/icons/icone-ciseau.png';
import './Shop.css';

const CATEGORY_LABELS = {
  MARIAGE: 'Mariage',
  ANNIVERSAIRE: 'Anniversaire',
  SAINT_VALENTIN: 'Saint-Valentin',
  NAISSANCE: 'Naissance',
  DEUIL: 'Deuil',
  ANNIVERSAIRE_ENTREPRISE: "Anniversaire d'entreprise",
  AUTRE: 'Autre',
};

export default function Shop() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('nom');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    productsApi
      .list()
      .then((data) => setProducts(data.filter((p) => p.id !== CUSTOM_BOUQUET_PRODUCT_ID)))
      .catch((err) => setProductsError(err.message))
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    favoritesApi
      .list(token)
      .then((favs) => setFavoriteIds(new Set(favs.map((f) => f.productId))))
      .catch(() => {});
  }, [isAuthenticated, token]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Créez un compte Floresia pour ajouter vos bouquets préférés en favoris', {
        actionLabel: 'Se connecter',
        onAction: () => navigate('/compte'),
        duration: 4000,
      });
      return;
    }

    const isFav = favoriteIds.has(productId);
    try {
      if (isFav) {
        await favoritesApi.remove(productId, token);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await favoritesApi.add(productId, token);
        setFavoriteIds((prev) => new Set(prev).add(productId));
        showToast('Ajouté à vos favoris');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['Tous', ...Object.keys(CATEGORY_LABELS)];

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchSearch && matchCategory && matchPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'prix-asc': return a.price - b.price;
      case 'prix-desc': return b.price - a.price;
      default: return a.name.localeCompare(b.name);
    }
  });

  const handlePriceChange = (e) => setPriceRange([0, parseInt(e.target.value)]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tous');
    setPriceRange([0, 100]);
    setSortBy('nom');
  };

  return (
    <div className="shop">
      <section className="shop-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Accueil</Link> / <span>Boutique</span></div>
          <h1 className="shop-title">Notre Boutique Florale</h1>
          <p className="shop-subtitle">
            {sortedProducts.length} {sortedProducts.length > 1 ? 'créations disponibles' : 'création disponible'}
          </p>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un bouquet, une fleur, une occasion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="nom">Nom A-Z</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </div>
      </section>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">Occasion</h3>
            <div className="filter-options">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'Tous' ? 'Tous' : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <h3 className="filter-title">Budget</h3>
            <div className="price-filter">
              <div className="price-labels">
                <span>0 €</span>
                <span className="price-current">{priceRange[1]} €</span>
              </div>
              <input type="range" min="0" max="100" value={priceRange[1]} onChange={handlePriceChange} className="price-slider" />
              <p className="price-description">De <strong>0 €</strong> à <strong>{priceRange[1]} €</strong></p>
            </div>
          </div>

          <div className="filter-divider" />

          <button className="reset-btn" onClick={resetFilters}>Réinitialiser les filtres</button>
        </aside>

        <div className="shop-main">
          {productsError && <p className="error-message">{productsError}</p>}
          {productsLoading && <p>Chargement des produits…</p>}

          {!productsLoading && sortedProducts.length === 0 ? (
            <div className="no-results">
              <p>Aucun produit ne correspond à vos critères</p>
              <button onClick={resetFilters} className="reset-link">Réinitialiser les filtres</button>
            </div>
          ) : (
            <div className="products-grid">
              {sortedProducts.map((product) => {
                const isFav = favoriteIds.has(product.id);
                return (
                  <div key={product.id} className="product-card">
                    <Link to={`/produit/${product.id}`} className="product-image-wrap">
                      <img src={product.imageUrl} alt={product.name} className="product-image" />
                    </Link>
                    <button
                      className={`wishlist-btn ${isFav ? 'active' : ''}`}
                      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      onClick={(e) => handleToggleFavorite(e, product.id)}
                    >
                      <FiHeart fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                    <div className="product-body">
                      <div className="product-occasions">{CATEGORY_LABELS[product.category]}</div>
                      <Link to={`/produit/${product.id}`}>
                        <h3 className="product-name">{product.name}</h3>
                      </Link>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-price">{product.price.toFixed(2)} €</span>
                        <Link to={`/produit/${product.id}`} className="btn-add-cart">
                          <FiShoppingCart size={16} /> Voir
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <section className="custom-banner">
        <div className="container">
          <div className="custom-banner-content">
            <div className="custom-icon"><img src={iconeCiseau} alt="Personnalisation" /></div>
            <div className="custom-text">
              <h2>Créez votre bouquet sur-mesure</h2>
              <p>Choisissez vos fleurs, couleurs et budget — nous composons votre création unique</p>
            </div>
            <button
              className="custom-wishlist-btn"
              aria-label={favoriteIds.has(CUSTOM_BOUQUET_PRODUCT_ID) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              onClick={(e) => handleToggleFavorite(e, CUSTOM_BOUQUET_PRODUCT_ID)}
            >
              <FiHeart fill={favoriteIds.has(CUSTOM_BOUQUET_PRODUCT_ID) ? 'currentColor' : 'none'} />
            </button>
            <Link to="/personnaliser" className="custom-btn">Personnaliser →</Link>
          </div>
        </div>
      </section>

      <button className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`} onClick={scrollToTop} aria-label="Retour en haut">
        <FiArrowUp />
      </button>
    </div>
  );
}