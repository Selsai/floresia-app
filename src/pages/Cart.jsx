import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiEdit2 } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 50 ? 0 : 5.90;
  const total = subtotal + deliveryFee;

  const handleEditCustomBouquet = (item) => {
    // Rediriger vers le configurateur avec les données du bouquet
    navigate('/personnaliser', { 
      state: { 
        editMode: true,
        cartItemId: item.id,
        config: item.customConfig 
      } 
    });
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-content">
            <FiShoppingBag className="empty-icon" />
            <h1>Votre panier est vide</h1>
            <p>Découvrez nos magnifiques bouquets et commencez vos achats</p>
            <Link to="/boutique" className="btn-continue-shopping">
              Découvrir la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      
      {/* HEADER */}
      <section className="cart-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link> / <span>Panier</span>
          </div>
          <h1 className="cart-title">Mon Panier</h1>
          <p className="cart-subtitle">
            {getTotalItems()} {getTotalItems() > 1 ? 'articles' : 'article'}
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="cart-layout">
        <div className="container">
          <div className="cart-grid">
            
            {/* LISTE DES PRODUITS */}
            <div className="cart-items">
              
              {/* Free delivery banner */}
              {subtotal < 50 && (
                <div className="delivery-banner">
                  <p>
                    🚚 Plus que <strong>{(50 - subtotal).toFixed(2)} €</strong> pour profiter de la 
                    <strong> livraison gratuite</strong> !
                  </p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  
                  {/* IMAGE - Clic désactivé pour bouquets personnalisés */}
                  {item.category === 'Personnalisé' ? (
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                  ) : (
                    <Link to={`/produit/${item.id}`} className="item-image">
                      <img src={item.image} alt={item.name} />
                    </Link>
                  )}

                  <div className="item-details">
                    {/* NOM - Clic désactivé pour bouquets personnalisés */}
                    {item.category === 'Personnalisé' ? (
                      <span className="item-name">{item.name}</span>
                    ) : (
                      <Link to={`/produit/${item.id}`} className="item-name">
                        {item.name}
                      </Link>
                    )}
                    
                    <p className="item-category">{item.category}</p>
                    
                    {/* DÉTAILS BOUQUET PERSONNALISÉ */}
                    {item.category === 'Personnalisé' && item.customConfig && (
                      <div className="custom-details">
                        {item.customConfig.occasionName && (
                          <p className="custom-occasion">
                            <strong>Occasion :</strong> {item.customConfig.occasionName}
                          </p>
                        )}
                        {item.customConfig.totalStems && (
                          <p className="custom-flowers">
                            <strong>Composition :</strong> {item.customConfig.totalStems} tiges
                          </p>
                        )}
                        {item.customConfig.secondaryFlowers && item.customConfig.secondaryFlowers.length > 0 && (
                          <p className="custom-secondary">
                            <strong>Compléments :</strong> {item.customConfig.secondaryFlowers.length} type{item.customConfig.secondaryFlowers.length > 1 ? 's' : ''}
                          </p>
                        )}
                        {item.customConfig.ribbonColor && (
                          <p className="custom-ribbon">
                            <strong>Ruban :</strong> {
                              item.customConfig.ribbonColor === 'red' ? 'Rouge' :
                              item.customConfig.ribbonColor === 'pink' ? 'Rose' :
                              item.customConfig.ribbonColor === 'white' ? 'Blanc' :
                              item.customConfig.ribbonColor === 'beige' ? 'Beige' :
                              item.customConfig.ribbonColor === 'gold' ? 'Doré' :
                              item.customConfig.ribbonColor === 'blue' ? 'Bleu' :
                              item.customConfig.ribbonColor === 'khaki' ? 'Vert kaki' :
                              item.customConfig.ribbonColor === 'multicolor' ? 'Multicolore' :
                              item.customConfig.ribbonColor
                            }
                          </p>
                        )}
                        {item.customConfig.message && (
                          <p className="custom-message">
                            <em>"{item.customConfig.message}"</em>
                          </p>
                        )}
                        
                        {/* BOUTON MODIFIER */}
                        <button 
                          className="btn-edit-custom"
                          onClick={() => handleEditCustomBouquet(item)}
                          title="Modifier ce bouquet"
                        >
                          <FiEdit2 /> Modifier la composition
                        </button>
                      </div>
                    )}
                    
                    {/* OCCASIONS POUR PRODUITS NORMAUX */}
                    {item.category !== 'Personnalisé' && item.occasions && (
                      <div className="item-occasions">
                        {item.occasions.slice(0, 2).map(occ => (
                          <span key={occ} className="occasion-tag">{occ}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* QUANTITÉ - Désactivée pour bouquets personnalisés */}
                  {item.category !== 'Personnalisé' && (
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuer quantité"
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Augmenter quantité"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <div className="item-price">
                    {(item.price * (item.quantity || 1)).toFixed(2)} €
                  </div>

                  <button 
                    className="item-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Retirer du panier"
                  >
                    <FiTrash2 />
                  </button>

                </div>
              ))}

              <Link to="/boutique" className="continue-shopping-link">
                ← Continuer mes achats
              </Link>

            </div>

            {/* RÉSUMÉ DE COMMANDE */}
            <div className="cart-summary">
              <h2>Résumé de la commande</h2>
              
              <div className="summary-line">
                <span>Sous-total ({getTotalItems()} articles)</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>

              <div className="summary-line">
                <span>Livraison</span>
                <span className={deliveryFee === 0 ? 'free' : ''}>
                  {deliveryFee === 0 ? 'GRATUIT' : `${deliveryFee.toFixed(2)} €`}
                </span>
              </div>

              {deliveryFee === 0 && (
                <div className="free-delivery-notice">
                  ✓ Vous bénéficiez de la livraison gratuite !
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-total">
                <span>Total TTC</span>
                <span className="total-amount">{total.toFixed(2)} €</span>
              </div>

              <button className="btn-checkout">
                Passer la commande
                <FiArrowRight />
              </button>

              <div className="payment-methods">
                <p>Paiement sécurisé</p>
                <div className="payment-icons">
                  💳 🔒
                </div>
              </div>

              <div className="summary-features">
                <div className="feature-item">
                  <span>🚚</span>
                  <p>Livraison express 24h</p>
                </div>
                <div className="feature-item">
                  <span>🌸</span>
                  <p>Fraîcheur garantie</p>
                </div>
                <div className="feature-item">
                  <span>📦</span>
                  <p>Emballage soigné</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* REASSURANCE */}
      <section className="cart-reassurance">
        <div className="container">
          <div className="reassurance-grid">
            <div className="reassurance-item">
              <div className="reassurance-icon">🚚</div>
              <h3>Livraison rapide</h3>
              <p>Express en 24h partout en France</p>
            </div>
            <div className="reassurance-item">
              <div className="reassurance-icon">💳</div>
              <h3>Paiement sécurisé</h3>
              <p>Transactions 100% protégées</p>
            </div>
            <div className="reassurance-item">
              <div className="reassurance-icon">🌸</div>
              <h3>Fraîcheur garantie</h3>
              <p>Remboursement si non satisfait</p>
            </div>
            <div className="reassurance-item">
              <div className="reassurance-icon">💬</div>
              <h3>Service client</h3>
              <p>Disponible 7j/7 par chat</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}