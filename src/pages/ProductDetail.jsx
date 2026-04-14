import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiTruck, FiPackage, FiAward, FiArrowLeft, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
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
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Base de données des produits avec compositions corrigées
  const allProducts = [
    {
      id: 1,
      name: 'Bouquet Rosa Éternelle',
      price: 32,
      category: 'Roses',
      occasions: ['Mariage', 'Anniversaire', 'Saint-Valentin', 'Remerciement'],
      rating: 5,
      reviewsCount: 28,
      bestseller: true,
      image: produit1,
      images: [produit1],
      description: 'Roses roses délicates avec eucalyptus et gypsophile',
      longDescription: 'Un bouquet romantique composé de roses roses délicates, sublimées par des touches d\'eucalyptus et de gypsophile. Parfait pour exprimer vos sentiments les plus tendres.',
      composition: ['Roses roses (15 tiges)', 'Eucalyptus', 'Gypsophile', 'Feuillage vert'],
      dimensions: '35cm de hauteur × 25cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Coupez les tiges en biseau avant de les mettre dans l\'eau',
        'Changez l\'eau tous les 2 jours',
        'Placez le bouquet dans un endroit frais, à l\'abri du soleil direct',
        'Retirez les feuilles qui trempent dans l\'eau',
        'Durée de vie : 7 à 10 jours'
      ]
    },
    {
      id: 2,
      name: 'Jardin de Pivoines',
      price: 52,
      category: 'Pivoines',
      occasions: ['Anniversaire', 'Naissance', 'Mariage'],
      rating: 5,
      reviewsCount: 42,
      bestseller: true,
      image: produit2,
      images: [produit2],
      description: 'Pivoines roses, tulipes roses/blanches et chrysanthèmes verts',
      longDescription: 'Un véritable jardin en bouquet ! Des pivoines généreuses accompagnées de tulipes fraîches et de touches de vert pour un ensemble vibrant.',
      composition: ['Pivoines roses (8 tiges)', 'Tulipes roses et blanches (10 tiges)', 'Chrysanthèmes verts (5 tiges)', 'Touches de marguerites', 'Feuillage varié'],
      dimensions: '42cm de hauteur × 32cm de diamètre',
      vase: 'Vase en verre inclus',
      care: [
        'Les tulipes continuent de pousser dans l\'eau',
        'Recoupez les tiges tous les 2 jours',
        'Gardez au frais (15-18°C idéal)',
        'Changez l\'eau quotidiennement',
        'Durée de vie : 6 à 10 jours'
      ]
    },
    {
      id: 3,
      name: 'Douceur Printanière',
      price: 45,
      category: 'Pivoines',
      occasions: ['Mariage', 'Naissance', 'Anniversaire'],
      rating: 5,
      reviewsCount: 34,
      new: true,
      image: produit3,
      images: [produit3],
      description: 'Pivoines roses, tulipes blanches, renoncules et marguerites',
      longDescription: 'Un bouquet printanier aux couleurs douces. Les pivoines roses s\'harmonisent avec les tulipes blanches et les touches de marguerites.',
      composition: ['Pivoines roses (6 tiges)', 'Tulipes blanches (8 tiges)', 'Renoncules (6 tiges)', 'Marguerites', 'Feuillage'],
      dimensions: '40cm de hauteur × 30cm de diamètre',
      vase: 'Vase en verre inclus',
      care: [
        'Les pivoines s\'ouvrent en 2-3 jours',
        'Changez l\'eau quotidiennement',
        'Évitez les courants d\'air',
        'Température idéale : 18-20°C',
        'Durée de vie : 5 à 8 jours'
      ]
    },
    {
      id: 4,
      name: 'Éclat Corail',
      price: 38,
      category: 'Bouquets mixtes',
      occasions: ['Mariage', 'Anniversaire'],
      rating: 5,
      reviewsCount: 21,
      image: produit4,
      images: [produit4],
      description: 'Pivoines corail, roses jaunes/blanches et astilbe orange',
      longDescription: 'Un bouquet aux couleurs chaudes et pétillantes. Les pivoines corail rayonnent aux côtés des roses et de l\'astilbe orangé.',
      composition: ['Pivoines corail (5 tiges)', 'Roses jaunes et blanches (8 tiges)', 'Astilbe orange', 'Renoncules blanches', 'Feuillage'],
      dimensions: '38cm de hauteur × 28cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Coupez les tiges régulièrement',
        'Changez l\'eau tous les 2 jours',
        'Évitez l\'exposition directe au soleil',
        'Retirez les fleurs fanées',
        'Durée de vie : 7 à 10 jours'
      ]
    },
    {
      id: 5,
      name: 'Mariage Rustique-Chic',
      price: 65,
      category: 'Bouquets mixtes',
      occasions: ['Mariage', 'Anniversaire'],
      rating: 5,
      reviewsCount: 18,
      image: produit5,
      images: [produit5],
      description: 'Pivoines roses/blanches, renoncules, chardons et eucalyptus',
      longDescription: 'Le bouquet de mariée par excellence. Un savant mélange de fleurs nobles et de feuillages champêtres pour un style rustique-chic inoubliable.',
      composition: ['Pivoines roses et blanches (6 tiges)', 'Renoncules pastel (8 tiges)', 'Chardons bleus', 'Eucalyptus', 'Fougère', 'Ficelle de jute et dentelle'],
      dimensions: '45cm de hauteur × 30cm de diamètre',
      vase: 'Non inclus (bouquet à tenir)',
      care: [
        'Idéal pour une cérémonie de 4-6 heures',
        'Vaporisez légèrement d\'eau avant la cérémonie',
        'Conservez au frais jusqu\'au dernier moment',
        'Peut être remis dans l\'eau après la cérémonie',
        'Durée de vie : 5 à 8 jours après remise en eau'
      ]
    },
    {
      id: 6,
      name: 'Luxe Roses & Lys',
      price: 58,
      category: 'Roses',
      occasions: ['Mariage', 'Remerciement', 'Deuil'],
      rating: 5,
      reviewsCount: 25,
      new: true,
      image: produit6,
      images: [produit6],
      description: 'Roses blanches, lys blancs et eucalyptus élégant',
      longDescription: 'Un bouquet luxueux qui respire l\'élégance. Les roses et lys blancs symbolisent la pureté et la noblesse des sentiments.',
      composition: ['Roses blanches premium (15 tiges)', 'Lys blancs orientaux (5 tiges)', 'Eucalyptus', 'Feuillage vert structuré'],
      dimensions: '50cm de hauteur × 35cm de diamètre',
      vase: 'Vase en verre inclus',
      care: [
        'Retirez les étamines des lys pour éviter les taches',
        'Changez l\'eau tous les 2 jours',
        'Les lys s\'ouvrent progressivement',
        'Parfum intense : aérez la pièce',
        'Durée de vie : 10 à 14 jours'
      ]
    },
    {
      id: 7,
      name: 'Saint-Valentin Passionné',
      price: 48,
      category: 'Roses',
      occasions: ['Saint-Valentin', 'Anniversaire', 'Mariage'],
      rating: 5,
      reviewsCount: 56,
      bestseller: true,
      image: produit7,
      images: [produit7],
      description: 'Roses rouges veloutées, eucalyptus et gypsophile',
      longDescription: 'Exprimez votre passion avec ce bouquet ardent. Des roses rouges profondes sublimées par des touches romantiques pour déclarer votre flamme.',
      composition: ['Roses rouges Red Naomi (20 tiges)', 'Eucalyptus', 'Gypsophile', 'Fougère', 'Ruban de satin rouge et dentelle'],
      dimensions: '45cm de hauteur × 30cm de diamètre',
      vase: 'Non inclus (bouquet à tenir)',
      care: [
        'Les roses rouges sont robustes',
        'Changez l\'eau tous les 3 jours',
        'Évitez les sources de chaleur',
        'Recoupez les tiges en biseau',
        'Durée de vie : 10 à 15 jours'
      ]
    },
    {
      id: 8,
      name: 'Anniversaire Pétillant',
      price: 42,
      category: 'Fleurs sauvages',
      occasions: ['Anniversaire', 'Félicitations', 'Remerciement'],
      rating: 4,
      reviewsCount: 31,
      image: produit8,
      images: [produit8],
      description: 'Tournesols, gerberas multicolores et delphiniums bleus',
      longDescription: 'Un bouquet joyeux et coloré pour célébrer la vie ! Des couleurs vives et un mélange de fleurs champêtres pour apporter du soleil.',
      composition: ['Tournesols (3 tiges)', 'Gerberas multicolores (8 tiges)', 'Delphiniums bleus (5 tiges)', 'Pivoines fuchsia', 'Renoncules', 'Feuillage varié', 'Ruban coloré et étiquette'],
      dimensions: '40cm de hauteur × 35cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Les tournesols boivent beaucoup d\'eau',
        'Remplissez le vase généreusement',
        'Changez l\'eau tous les 2 jours',
        'Exposition lumineuse recommandée',
        'Durée de vie : 7 à 10 jours'
      ]
    },
    {
      id: 9,
      name: 'Naissance Doux',
      price: 48,
      category: 'Bouquets mixtes',
      occasions: ['Naissance', 'Remerciement'],
      rating: 5,
      reviewsCount: 19,
      new: true,
      image: produit9,
      images: [produit9],
      description: 'Pivoines roses/blanches, renoncules, lys et chardons bleus',
      longDescription: 'Un bouquet tendre pour accueillir un nouveau-né. Des teintes pastel douces et délicates pour célébrer ce moment unique.',
      composition: ['Pivoines roses et blanches (6 tiges)', 'Renoncules roses (8 tiges)', 'Lys blancs (4 tiges)', 'Chardons bleus', 'Eucalyptus', 'Ruban rose poudré et étiquette'],
      dimensions: '38cm de hauteur × 28cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Bouquet délicat, manipuler avec soin',
        'Changez l\'eau quotidiennement',
        'Température fraîche recommandée',
        'Profitez du parfum subtil',
        'Durée de vie : 6 à 9 jours'
      ]
    },
    {
      id: 10,
      name: 'Remerciement Sincère',
      price: 44,
      category: 'Bouquets mixtes',
      occasions: ['Remerciement', 'Anniversaire'],
      rating: 5,
      reviewsCount: 22,
      image: produit10,
      images: [produit10],
      description: 'Roses blanches/crème, hydrangéas, lys et eucalyptus',
      longDescription: 'Exprimez votre gratitude avec élégance. Un bouquet raffiné aux teintes douces pour remercier avec sincérité.',
      composition: ['Roses blanches et crème (10 tiges)', 'Hydrangéas (2 têtes)', 'Lys blancs (3 tiges)', 'Renoncules', 'Eucalyptus', 'Étiquette'],
      dimensions: '42cm de hauteur × 30cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Les hydrangéas sont gourmands en eau',
        'Immergez complètement les tiges dans l\'eau 1h',
        'Changez l\'eau tous les 2 jours',
        'Vaporisez les têtes d\'hydrangéas',
        'Durée de vie : 8 à 12 jours'
      ]
    },
    {
      id: 11,
      name: 'Condoléances Apaisant',
      price: 40,
      category: 'Bouquets mixtes',
      occasions: ['Deuil'],
      rating: 5,
      reviewsCount: 15,
      image: produit11,
      images: [produit11],
      description: 'Roses blanches, hydrangéas, lys et chrysanthèmes verts',
      longDescription: 'Un hommage sobre et respectueux. Des fleurs blanches pour exprimer votre soutien et votre compassion dans les moments difficiles.',
      composition: ['Roses blanches (12 tiges)', 'Hydrangéas (2 têtes)', 'Lys blancs (3 tiges)', 'Chrysanthèmes verts', 'Eucalyptus', 'Feuillage sobre'],
      dimensions: '45cm de hauteur × 28cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Livré avec carte de condoléances',
        'Changez l\'eau tous les 2-3 jours',
        'Placez dans un endroit calme',
        'Retirez les fleurs fanées',
        'Durée de vie : 10 à 14 jours'
      ]
    },
    {
      id: 12,
      name: 'Félicitations Festif',
      price: 50,
      category: 'Bouquets mixtes',
      occasions: ['Félicitations', 'Anniversaire', 'Remerciement'],
      rating: 5,
      reviewsCount: 27,
      image: produit12,
      images: [produit12],
      description: 'Pivoines fuchsia, iris bleus, œillets orange et branches',
      longDescription: 'Célébrez les réussites avec panache ! Un bouquet coloré et festif pour marquer les grandes occasions et les accomplissements.',
      composition: ['Pivoines fuchsia (6 tiges)', 'Iris bleus (8 tiges)', 'Œillets orange (10 tiges)', 'Branches fleuries', 'Feuillage printanier'],
      dimensions: '48cm de hauteur × 32cm de diamètre',
      vase: 'Non inclus',
      care: [
        'Bouquet généreux et coloré',
        'Changez l\'eau tous les 2 jours',
        'Exposition lumineuse idéale',
        'Recoupez les tiges régulièrement',
        'Durée de vie : 8 à 12 jours'
      ]
    }
  ];

  // Avis clients fictifs
  const reviews = [
    {
      id: 1,
      name: 'Sophie M.',
      rating: 5,
      date: '15 janvier 2025',
      comment: 'Magnifique bouquet, les fleurs étaient fraîches et ont duré plus d\'une semaine. La livraison était rapide et soignée. Je recommande vivement !'
    },
    {
      id: 2,
      name: 'Thomas D.',
      rating: 5,
      date: '8 janvier 2025',
      comment: 'Commandé pour l\'anniversaire de ma femme, elle était ravie ! Les couleurs sont encore plus belles qu\'en photo.'
    },
    {
      id: 3,
      name: 'Marie L.',
      rating: 4,
      date: '2 janvier 2025',
      comment: 'Très beau bouquet, conforme à la description. Seul petit bémol : j\'aurais aimé qu\'il soit un peu plus grand pour le prix.'
    },
    {
      id: 4,
      name: 'Alexandre R.',
      rating: 5,
      date: '28 décembre 2024',
      comment: 'Service impeccable, bouquet sublime. C\'est la troisième fois que je commande chez Floresia et je ne suis jamais déçu.'
    }
  ];

  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
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

  const similarProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const averageRating = product.rating;

  return (
    <div className="product-detail">
      
      {/* BREADCRUMB */}
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Accueil</Link> / <Link to="/boutique">Boutique</Link> / <span>{product.name}</span>
        </div>
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft /> Retour
        </button>
      </div>

      {/* MAIN PRODUCT */}
      <section className="product-main">
        <div className="container">
          <div className="product-layout">
            
            {/* GALERIE IMAGES */}
            <div className="product-gallery">
              <div className="main-image">
                <img src={product.images[selectedImage]} alt={product.name} />
                {product.bestseller && <span className="badge bestseller">Best-seller</span>}
                {product.new && <span className="badge new">Nouveau</span>}
              </div>
            </div>

            {/* INFOS PRODUIT */}
            <div className="product-info">
              <div className="product-occasions-tags">
                {product.occasions.map(occ => (
                  <span key={occ} className="occasion-tag">{occ}</span>
                ))}
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating-line">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < averageRating ? 'filled' : ''} />
                  ))}
                </div>
                <span className="rating-text">
                  {averageRating}/5 · {product.reviewsCount} avis
                </span>
              </div>

              <p className="product-description">{product.longDescription}</p>

              <div className="product-price-line">
                <span className="price">{product.price},00 €</span>
                <span className="price-note">Livraison en 24h</span>
              </div>

              {/* QUANTITÉ */}
              <div className="quantity-selector">
                <label>Quantité</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="product-actions">
                <button className="btn-add-cart-large" onClick={handleAddToCart}>
                  <FiShoppingCart />
                  Ajouter au panier — {(product.price * quantity).toFixed(2)} €
                </button>
                <button className="btn-wishlist-large">
                  <FiHeart />
                </button>
              </div>

              {/* SERVICES */}
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
                    <strong>Fraîcheur garantie</strong>
                    <p>Remboursement si non satisfait</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DÉTAILS */}
      <section className="product-details-section">
        <div className="container">
          <div className="details-tabs">
            
            <div className="detail-card">
              <h3>🌸 Composition</h3>
              <ul>
                {product.composition.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="detail-meta"><strong>Dimensions :</strong> {product.dimensions}</p>
              <p className="detail-meta"><strong>Vase :</strong> {product.vase}</p>
            </div>

            <div className="detail-card">
              <h3>💧 Conseils d'entretien</h3>
              <ul>
                {product.care.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="detail-card">
              <h3>🚚 Livraison & retours</h3>
              <ul>
                <li>Livraison express en 24h partout en France</li>
                <li>Livraison gratuite dès 50€ d'achat</li>
                <li>Créneau de livraison personnalisable</li>
                <li>Emballage recyclable et écologique</li>
                <li>Carte message personnalisée offerte</li>
                <li>Garantie fraîcheur : remboursement sous 48h si non satisfait</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section className="reviews-section">
        <div className="container">
          <h2 className="section-title">Avis clients</h2>
          <div className="reviews-summary">
            <div className="rating-big">
              <span className="rating-number">{averageRating}</span>
              <div className="stars-big">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < averageRating ? 'filled' : ''} />
                ))}
              </div>
              <p>{product.reviewsCount} avis vérifiés</p>
            </div>
          </div>
          
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author">
                    <div className="author-avatar">{review.name.charAt(0)}</div>
                    <div>
                      <strong>{review.name}</strong>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < review.rating ? 'filled' : ''} />
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUITS SIMILAIRES */}
      {similarProducts.length > 0 && (
        <section className="similar-products">
          <div className="container">
            <h2 className="section-title">Vous aimerez aussi</h2>
            <div className="similar-grid">
              {similarProducts.map(p => (
                <Link to={`/produit/${p.id}`} key={p.id} className="similar-card">
                  <div className="similar-image">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <h3>{p.name}</h3>
                  <p className="similar-price">{p.price},00 €</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}