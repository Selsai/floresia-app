import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch, FiArrowUp } from 'react-icons/fi';
import produit1 from '../assets/products/produit-1.png';
import produit2 from '../assets/products/produit-2.png';
import produit3 from '../assets/products/produit-3.png';
import produit4 from '../assets/products/produit-4.png';
import produit5 from '../assets/products/produit-5.png';
import produit6 from '../assets/products/produit-6.png';
import produit7 from '../assets/products/produit-7.png';
import produit8 from '../assets/products/produit-8.png';
import produit9 from '../assets/products/produit-9.png';
import produit10 from '../assets/products/produit-10.png';
import produit11 from '../assets/products/produit-11.png';
import produit12 from '../assets/products/produit-12.png';
import iconeCiseau from '../assets/icons/icone-ciseau.png';
import './Shop.css';

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedOccasion, setSelectedOccasion] = useState('Toutes');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('populaire');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Base de données des produits avec compositions corrigées
  const allProducts = [
    {
      id: 1,
      name: 'Bouquet Rosa Éternelle',
      price: 32,
      category: 'Roses',
      occasions: ['Mariage', 'Anniversaire', 'Saint-Valentin', 'Remerciement'],
      rating: 5,
      bestseller: true,
      image: produit1,
      description: 'Roses roses délicates avec eucalyptus et gypsophile'
    },
    {
      id: 2,
      name: 'Jardin de Pivoines',
      price: 52,
      category: 'Pivoines',
      occasions: ['Anniversaire', 'Naissance', 'Mariage'],
      rating: 5,
      bestseller: true,
      image: produit2,
      description: 'Pivoines roses, tulipes roses/blanches et chrysanthèmes verts'
    },
    {
      id: 3,
      name: 'Douceur Printanière',
      price: 45,
      category: 'Pivoines',
      occasions: ['Mariage', 'Naissance', 'Anniversaire'],
      rating: 5,
      new: true,
      image: produit3,
      description: 'Pivoines roses, tulipes blanches, renoncules et marguerites'
    },
    {
      id: 4,
      name: 'Éclat Corail',
      price: 38,
      category: 'Bouquets mixtes',
      occasions: ['Mariage', 'Anniversaire'],
      rating: 5,
      image: produit4,
      description: 'Pivoines corail, roses jaunes/blanches et astilbe orange'
    },
    {
      id: 5,
      name: 'Mariage Rustique-Chic',
      price: 65,
      category: 'Bouquets mixtes',
      occasions: ['Mariage', 'Anniversaire'],
      rating: 5,
      image: produit5,
      description: 'Pivoines roses/blanches, renoncules, chardons et eucalyptus'
    },
    {
      id: 6,
      name: 'Luxe Roses & Lys',
      price: 58,
      category: 'Roses',
      occasions: ['Mariage', 'Remerciement', 'Deuil'],
      rating: 5,
      new: true,
      image: produit6,
      description: 'Roses blanches, lys blancs et eucalyptus élégant'
    },
    {
      id: 7,
      name: 'Saint-Valentin Passionné',
      price: 48,
      category: 'Roses',
      occasions: ['Saint-Valentin', 'Anniversaire', 'Mariage'],
      rating: 5,
      bestseller: true,
      image: produit7,
      description: 'Roses rouges veloutées, eucalyptus et gypsophile'
    },
    {
      id: 8,
      name: 'Anniversaire Pétillant',
      price: 42,
      category: 'Fleurs sauvages',
      occasions: ['Anniversaire', 'Félicitations', 'Remerciement'],
      rating: 4,
      image: produit8,
      description: 'Tournesols, gerberas multicolores et delphiniums bleus'
    },
    {
      id: 9,
      name: 'Naissance Doux',
      price: 48,
      category: 'Bouquets mixtes',
      occasions: ['Naissance', 'Remerciement'],
      rating: 5,
      new: true,
      image: produit9,
      description: 'Pivoines roses/blanches, renoncules, lys et chardons bleus'
    },
    {
      id: 10,
      name: 'Remerciement Sincère',
      price: 44,
      category: 'Bouquets mixtes',
      occasions: ['Remerciement', 'Anniversaire'],
      rating: 5,
      image: produit10,
      description: 'Roses blanches/crème, hydrangéas, lys et eucalyptus'
    },
    {
      id: 11,
      name: 'Condoléances Apaisant',
      price: 40,
      category: 'Bouquets mixtes',
      occasions: ['Deuil'],
      rating: 5,
      image: produit11,
      description: 'Roses blanches, hydrangéas, lys et chrysanthèmes verts'
    },
    {
      id: 12,
      name: 'Félicitations Festif',
      price: 50,
      category: 'Bouquets mixtes',
      occasions: ['Félicitations', 'Anniversaire', 'Remerciement'],
      rating: 5,
      image: produit12,
      description: 'Pivoines fuchsia, iris bleus, œillets orange et branches'
    }
  ];

  const categories = ['Tous', 'Roses', 'Pivoines', 'Fleurs sauvages', 'Bouquets mixtes'];
  const occasions = ['Toutes', 'Mariage', 'Anniversaire', 'Naissance', 'Deuil', 'Saint-Valentin', 'Remerciement', 'Félicitations'];

  // Filtrage des produits
  const filteredProducts = allProducts.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchOccasion = selectedOccasion === 'Toutes' || product.occasions.includes(selectedOccasion);
    const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchSearch && matchCategory && matchOccasion && matchPrice;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'prix-asc':
        return a.price - b.price;
      case 'prix-desc':
        return b.price - a.price;
      case 'nom':
        return a.name.localeCompare(b.name);
      default: // populaire
        return b.rating - a.rating;
    }
  });

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tous');
    setSelectedOccasion('Toutes');
    setPriceRange([0, 100]);
    setSortBy('populaire');
  };

  return (
    <div className="shop">
      
      {/* HEADER */}
      <section className="shop-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link> / <span>Boutique</span>
          </div>
          <h1 className="shop-title">Notre Boutique Florale</h1>
          <p className="shop-subtitle">
            {sortedProducts.length} {sortedProducts.length > 1 ? 'créations disponibles' : 'création disponible'}
          </p>
        </div>
      </section>

      {/* SEARCH BAR */}
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
            <option value="populaire">Les plus populaires</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nom">Nom A-Z</option>
          </select>
        </div>
      </section>

      {/* LAYOUT PRINCIPAL */}
      <div className="shop-layout">
        
        {/* SIDEBAR FILTRES */}
        <aside className="shop-sidebar">
          
          <div className="filter-section">
            <h3 className="filter-title">Catégories</h3>
            <div className="filter-options">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
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
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="price-slider"
              />
              <p className="price-description">
                De <strong>0 €</strong> à <strong>{priceRange[1]} €</strong>
              </p>
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <h3 className="filter-title">Occasion</h3>
            <div className="occasion-chips">
              {occasions.map(occ => (
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

          <div className="filter-divider" />

          <button className="reset-btn" onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </aside>

        {/* GRILLE PRODUITS */}
        <div className="shop-main">
          
          {sortedProducts.length === 0 ? (
            <div className="no-results">
              <p>😔 Aucun produit ne correspond à vos critères</p>
              <button onClick={resetFilters} className="reset-link">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {sortedProducts.map(product => (
                <div key={product.id} className="product-card">
                  
                  {/* Badges */}
                  <div className="product-badges">
                    {product.bestseller && <span className="badge bestseller">Best-seller</span>}
                    {product.new && <span className="badge new">Nouveau</span>}
                  </div>

                  {/* Image - CLIQUABLE */}
                  <Link to={`/produit/${product.id}`} className="product-image-wrap">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <button className="wishlist-btn" aria-label="Ajouter aux favoris">
                      <FiHeart />
                    </button>
                  </Link>

                  {/* Corps */}
                  <div className="product-body">
                    <div className="product-occasions">
                      {product.occasions.slice(0, 2).join(' • ')}
                    </div>
                    <Link to={`/produit/${product.id}`}>
                      <h3 className="product-name">{product.name}</h3>
                    </Link>
                    <p className="product-description">{product.description}</p>
                    <div className="product-rating">
                      {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                    </div>
                    <div className="product-footer">
                      <span className="product-price">{product.price},00 €</span>
                      <Link to={`/produit/${product.id}`} className="btn-add-cart">
                        <FiShoppingCart size={16} />
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* BANNIÈRE PERSONNALISATION */}
      <section className="custom-banner">
        <div className="container">
          <div className="custom-banner-content">
            <div className="custom-icon">
              <img src={iconeCiseau} alt="Personnalisation" />
            </div>
            <div className="custom-text">
              <h2>Créez votre bouquet sur-mesure</h2>
              <p>Choisissez vos fleurs, couleurs et budget — nous composons votre création unique</p>
            </div>
            <Link to="/personnaliser" className="custom-btn">
              Personnaliser →
            </Link>
          </div>
        </div>
      </section>

      {/* BOUTON RETOUR EN HAUT */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Retour en haut"
      >
        <FiArrowUp />
      </button>

    </div>
  );
}