import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiPackage,
  FiAward,
  FiArrowLeft,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  productsApi,
  favoritesApi,
  CUSTOM_BOUQUET_PRODUCT_ID,
} from '../services/api';
import './ProductDetail.css';

const CATEGORY_LABELS = {
  MARIAGE: 'Mariage',
  ANNIVERSAIRE: 'Anniversaire',
  SAINT_VALENTIN: 'Saint-Valentin',
  NAISSANCE: 'Naissance',
  DEUIL: 'Deuil',
  ANNIVERSAIRE_ENTREPRISE: "Anniversaire d'entreprise",
  AUTRE: 'Autre',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (id === CUSTOM_BOUQUET_PRODUCT_ID) {
      setError('Produit introuvable');
      setLoading(false);
      return;
    }

    productsApi
      .getOne(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !token || !product) {
      return;
    }

    favoritesApi
      .list(token)
      .then((favs) =>
        setIsFavorite(favs.some((fav) => fav.productId === product.id))
      )
      .catch(() => {});
  }, [isAuthenticated, token, product]);

  if (loading) {
    return (
      <div className="container">
        <p>Chargement…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <h1>Produit introuvable</h1>
        <Link to="/boutique">Retour à la boutique</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/panier');
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      showToast(
        'Créez un compte Floresia pour ajouter vos bouquets préférés en favoris',
        {
          actionLabel: 'Se connecter',
          onAction: () => navigate('/compte'),
          duration: 4000,
        }
      );

      return;
    }

    setFavLoading(true);

    try {
      if (isFavorite) {
        await favoritesApi.remove(product.id, token);
        setIsFavorite(false);
      } else {
        await favoritesApi.add(product.id, token);
        setIsFavorite(true);
        showToast('Ajouté à vos favoris');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Accueil</Link> /{' '}
          <Link to="/boutique">Boutique</Link> /{' '}
          <span>{product.name}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <FiArrowLeft /> Retour
        </button>
      </div>

      <section className="product-main">
        <div className="container">
          <div className="product-layout">
            <div className="product-gallery">
              <div className="main-image">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                />
              </div>
            </div>

            <div className="product-info">
              <div className="product-occasions-tags">
                <span className="occasion-tag">
                  {CATEGORY_LABELS[product.category]}
                </span>
              </div>

              <h1 className="product-title">{product.name}</h1>

              <p className="product-description">
                {product.description}
              </p>

              <div className="product-price-line">
                <span className="price">
                  {product.price.toFixed(2)} €
                </span>

                <span className="price-note">
                  Livraison en 24h
                </span>
              </div>

              <div className="quantity-selector">
                <label>Quantité</label>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    readOnly
                  />

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="btn-add-cart-large"
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart />
                  Ajouter au panier —{' '}
                  {(product.price * quantity).toFixed(2)} €
                </button>

                <button
                  className={`btn-wishlist-large ${
                    isFavorite ? 'active' : ''
                  }`}
                  onClick={toggleFavorite}
                  disabled={favLoading}
                  aria-label={
                    isFavorite
                      ? 'Retirer des favoris'
                      : 'Ajouter aux favoris'
                  }
                >
                  <FiHeart
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="product-services">
                <div className="service-item">
                  <FiTruck />

                  <div>
                    <strong>Livraison express 24h</strong>
                    <p>Gratuite dès 50€ d'achat</p>
                  </div>
                </div>

                <div className="service-item">
                  <FiPackage />

                  <div>
                    <strong>Emballage soigné</strong>
                    <p>Vos fleurs arrivent protégées</p>
                  </div>
                </div>

                <div className="service-item">
                <FiAward />

                <div>
                  <strong>Fleurs sélectionnées</strong>
                  <p>Composées le jour de votre commande</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}