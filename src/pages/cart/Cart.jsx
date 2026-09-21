// Cart : panier, livraison et paiement.
import { formatPrice } from '../../utils/price';
// Cart.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart/cart-context';
import { useAuth } from '../../context/auth/auth-context';
import { addressesApi, ordersApi, paymentApi, CUSTOM_BOUQUET_PRODUCT_ID } from '../../services/api';
import { fetchNearbyFlorists } from '../../data/stores';
import { Trash2 as FiTrash2, ShoppingBag as FiShoppingBag, ArrowRight as FiArrowRight, Pencil as FiEdit2, Truck as FiTruck, CreditCard as FiCreditCard, Lock as FiLock, MapPin as FiMapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Cart.css';

// Icône personnalisée en forme de fleur, aux couleurs Florésia
// Icône personnalisée : pin vert avec une fleur rose dessinée en SVG
const floristIcon = L.divIcon({
  className: 'florist-marker',
  html: `
    <div style="
      width: 38px;
      height: 38px;
      background: var(--florist-pin);
      border: 3px solid var(--white);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 8px var(--map-shadow);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        style="transform: rotate(45deg);"
        aria-hidden="true"
      >
        <g fill="var(--florist-petal)">
          <circle cx="12" cy="7" r="3.2" />
          <circle cx="17" cy="12" r="3.2" />
          <circle cx="12" cy="17" r="3.2" />
          <circle cx="7" cy="12" r="3.2" />
        </g>
        <circle cx="12" cy="12" r="3" fill="var(--florist-center)" />
      </svg>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated, token, user } = useAuth();

  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY');
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  // États pour le chargement des fleuristes
  const [storesLoadedFor, setStoresLoadedFor] = useState(null);
  const [storesError, setStoresError] = useState('');

  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === 'PICKUP' ? 0 : (subtotal >= 50 ? 0 : 5.90);
  const total = subtotal + deliveryFee;

  useEffect(() => {
  if (!isAuthenticated || !token) return;
  addressesApi
    .list(token)
    .then((addresses) => {
      setUserAddresses(addresses);
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    })
    .catch(() => {});
}, [isAuthenticated, token]);

const selectedAddress = userAddresses.find((a) => a.id === selectedAddressId) || null;
const storesLoading = deliveryMethod === 'PICKUP' && Boolean(selectedAddress?.lat && selectedAddress?.lng) && storesLoadedFor !== selectedAddress.id;

  useEffect(() => {
  if (deliveryMethod !== 'PICKUP' || !selectedAddress?.lat || !selectedAddress?.lng) return;

  let active = true;
  fetchNearbyFlorists(selectedAddress.lat, selectedAddress.lng)
    .then((stores) => {
      if (!active) return;
      setStoresError('');
      setNearbyStores(stores);
      setSelectedStoreId(stores[0]?.id ?? null);
    })
    .catch((err) => { if (active) setStoresError(err.message); })
    .finally(() => { if (active) setStoresLoadedFor(selectedAddress.id); });
  return () => { active = false; };
}, [deliveryMethod, selectedAddress]);

  const handleEditCustomBouquet = (item) => {
    navigate('/personnaliser', { state: { editMode: true, cartItemId: item.id, config: item.customConfig } });
  };

  const handleCheckout = async () => {
    setCheckoutError('');

    if (!isAuthenticated) {
      navigate('/compte');
      return;
    }

    if (deliveryMethod === 'PICKUP' && !selectedStoreId) {
      setCheckoutError('Sélectionnez un magasin pour le retrait.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const addresses = await addressesApi.list(token);
      if (addresses.length === 0) {
        setCheckoutError('Veuillez renseigner une adresse par défaut dans votre profil avant de passer commande.');
        setCheckoutLoading(false);
        return;
      }
      const address = addresses.find((a) => a.id === selectedAddressId) || addresses.find((a) => a.isDefault) || addresses[0];

      const order = await ordersApi.create(
        {
          addressId: address.id,
          deliveryMethod,
          pickupStoreId: deliveryMethod === 'PICKUP' ? selectedStoreId : undefined,
          items: cart.map((item) => {
            if (item.category === 'Personnalisé') {
              const cfg = item.customConfig || {};
              const flowersList = (cfg.selectedFlowers || [])
                .map((f) => `${f.quantity}x ${f.name}`)
                .join(', ');

              return {
                productId: CUSTOM_BOUQUET_PRODUCT_ID,
                quantity: item.quantity || 1,
                customBouquet: {
                  flowers: [
                    ...(cfg.selectedFlowers || []).map(f => ({ flowerId: f.id, quantity: f.quantity })),
                    ...(cfg.secondaryFlowers || []).map(id => ({ flowerId: id, quantity: 1 })),
                  ],
                  occasionName: cfg.occasionName,
                  ribbonColor: cfg.ribbonColor,
                  message: cfg.message,
                },
                customNote: `Occasion: ${cfg.occasionName || '-'} | Fleurs: ${flowersList || '-'} | Ruban: ${cfg.ribbonColor || '-'}${cfg.message ? ' | Message: ' + cfg.message : ''}`,
              };
            }

            return {
              productId: item.id,
              quantity: item.quantity || 1,
            };
          }),
        },
        token
      );

      const { checkoutUrl } = await paymentApi.createCheckoutSession(order.id, token);
      sessionStorage.setItem('floresia-checkout', JSON.stringify({ orderId: order.id, cart: JSON.stringify(cart) }));
      window.location.href = checkoutUrl;
    } catch (err) {
      setCheckoutError(err.message);
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-content">
            <FiShoppingBag className="empty-icon" />
            <h1>Votre panier est vide</h1>
            <p>Découvrez nos magnifiques bouquets et commencez vos achats</p>
            <Link to="/boutique" className="btn-continue-shopping">Découvrir la boutique</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="cart-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Accueil</Link> / <span>Panier</span></div>
          <h1 className="cart-title">Votre panier</h1>
          <p className="cart-subtitle">{getTotalItems()} {getTotalItems() > 1 ? 'articles' : 'article'}</p>
        </div>
      </section>

      <div className="cart-layout">
        <div className="container">
          <div className="cart-grid">
            <div className="cart-items">
              {deliveryMethod === 'DELIVERY' && subtotal < 50 && (
                <div className="delivery-banner">
                  <p><FiTruck className="delivery-icon" /> Plus que <strong>{formatPrice(50 - subtotal)}</strong> pour profiter de la <strong> livraison gratuite</strong> !</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.category === 'Personnalisé' ? (
                    <div className="item-image"><img src={item.image} alt={item.name} /></div>
                  ) : (
                    <Link to={`/produit/${item.id}`} className="item-image">
                      <img src={item.imageUrl || item.image} alt={item.name} />
                    </Link>
                  )}

                  <div className="item-details">
                    {item.category === 'Personnalisé' ? (
                      <span className="item-name">{item.name}</span>
                    ) : (
                      <Link to={`/produit/${item.id}`} className="item-name">{item.name}</Link>
                    )}

                    <p className="item-category">{item.category}</p>

                    {item.category === 'Personnalisé' && item.customConfig && (
                      <div className="custom-details">
                        {item.customConfig.occasionName && (
                          <p className="custom-occasion"><strong>Occasion :</strong> {item.customConfig.occasionName}</p>
                        )}
                        {item.customConfig.totalStems && (
                          <p className="custom-flowers"><strong>Composition :</strong> {item.customConfig.totalStems} tiges</p>
                        )}
                        <button className="btn-edit-custom" onClick={() => handleEditCustomBouquet(item)} title="Modifier ce bouquet">
                          <FiEdit2 /> Modifier la composition
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="cart-item-footer">
                    {item.category !== 'Personnalisé' && (
                      <div className="item-quantity">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuer quantité">−</button>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" aria-label={`Quantité de ${item.name}`} value={item.quantity} onChange={(e) => { if (/^\d+$/.test(e.target.value)) updateQuantity(item.id, Math.max(1, Number(e.target.value))); }} />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Augmenter quantité">+</button>
                      </div>
                    )}
                    <div className="item-price">{formatPrice(item.price * (item.quantity || 1))}</div>
                  </div>

                  <button className="item-remove" onClick={() => removeFromCart(item.id)} aria-label="Retirer du panier">
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <Link to="/boutique" className="continue-shopping-link">← Continuer mes achats</Link>
            </div>

            <div className="cart-summary">
              <h2>Résumé de la commande</h2>

              <div className="delivery-method-choice">
                <button
                  type="button"
                  className={deliveryMethod === 'DELIVERY' ? 'active' : ''}
                  onClick={() => setDeliveryMethod('DELIVERY')}
                >
                  <FiTruck /> Livraison à domicile
                </button>
                <button
                  type="button"
                  className={deliveryMethod === 'PICKUP' ? 'active' : ''}
                  onClick={() => setDeliveryMethod('PICKUP')}
                >
                  <FiMapPin /> Retrait en boutique
                </button>
              </div>

              {deliveryMethod === 'PICKUP' && (
                <div className="pickup-section">
                  <p className="pickup-warning">Retrait simulé pour la démonstration : les fleuristes affichés ne sont pas des partenaires de Florésia. Aucune commande ne peut y être récupérée.</p>
                  {userAddresses.length === 0 ? (
                    <p className="pickup-warning">
                      Ajoutez une adresse dans votre compte pour voir les fleuristes les plus proches.
                    </p>
                  ) : (
                    <>
                      {userAddresses.length > 1 && (
                        <div className="form-group">
                          <label>Rechercher autour de :</label>
                          <select
                            value={selectedAddressId || ''}
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                            className="address-select"
                          >
                            {userAddresses.map((addr) => (
                              <option key={addr.id} value={addr.id}>
                                {addr.label} — {addr.street}, {addr.zipCode} {addr.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {!selectedAddress?.lat ? (
                        <p className="pickup-warning">
                          Cette adresse n'a pas de coordonnées enregistrées. Modifiez-la via l'autocomplete pour activer la recherche.
                        </p>
                      ) : (
                        <>
                          <div className="pickup-map">
                            <MapContainer
                              center={[48.8566, 2.3522]}
                              zoom={12}
                              style={{ height: 200, width: '100%', borderRadius: 12 }}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                              />
                              {nearbyStores.map((store) => (
                                <Marker key={store.id} position={[store.lat, store.lng]} icon={floristIcon}>
                                  <Popup>
                                    <strong>{store.name}</strong><br />
                                    {store.address && <>{store.address}<br /></>}
                                    {store.distance.toFixed(1)} km
                                  </Popup>
                                </Marker>
                              ))}
                            </MapContainer>
                          </div>

                          {storesLoading && <p className="pickup-warning">Recherche des fleuristes à proximité…</p>}
                          {storesError && <p className="pickup-warning">{storesError}</p>}

                          {!storesLoading && nearbyStores.length > 0 && (
                            <p className="pickup-count">
                              {nearbyStores.length} {nearbyStores.length > 1 ? 'fleuristes trouvés' : 'fleuriste trouvé'} à proximité
                            </p>
                          )}

                          <div className="store-list">
                            {nearbyStores.map((store) => (
                              <label key={store.id} className="store-option">
                                <input
                                  type="radio"
                                  name="store"
                                  checked={selectedStoreId === store.id}
                                  onChange={() => setSelectedStoreId(store.id)}
                                />
                                <div>
                                  <strong>{store.name}</strong>
                                  <span>{store.address ? `${store.address} — ` : ''}{store.distance.toFixed(1)} km</span>
                                </div>
                              </label>
                            ))}
                          </div>

                          <p className="pickup-free-notice">✓ Retrait gratuit en boutique</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="summary-line">
                <span>Sous-total ({getTotalItems()} articles)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-line">
                <span>{deliveryMethod === 'PICKUP' ? 'Retrait' : 'Livraison'}</span>
                <span className={deliveryFee === 0 ? 'free' : ''}>
                  {deliveryFee === 0 ? 'GRATUIT' : formatPrice(deliveryFee)}
                </span>
              </div>

              {deliveryMethod === 'DELIVERY' && deliveryFee === 0 && (
                <div className="free-delivery-notice">✓ Vous bénéficiez de la livraison gratuite !</div>
              )}

              <div className="summary-divider" />

              <div className="summary-total">
                <span>Total TTC</span>
                <span className="total-amount">{formatPrice(total)}</span>
              </div>

                {checkoutError && (
                <p className="auth-error">
                  {checkoutError}{' '}
                  {checkoutError.includes('adresse') && (
                    <Link to="/compte" className="checkout-error-link">Aller à mon profil →</Link>
                  )}
                  {checkoutError.includes('email') && (
                    <Link to="/verification-email" state={{ email: user?.email }} className="checkout-error-link">
                      Vérifier mon email →
                    </Link>
                  )}
                </p>
              )}
              <p className="pickup-warning">Commande de démonstration : paiement Stripe en mode test uniquement. N’utilisez pas de vraie carte bancaire. <Link to="/cgv">Voir les conditions</Link>.</p>
              <button className="btn-checkout" onClick={handleCheckout} disabled={checkoutLoading}>
                {checkoutLoading ? 'Redirection…' : 'Passer la commande'}
                <FiArrowRight />
              </button>

              <div className="payment-methods">
                <p>Paiement sécurisé</p>
                <div className="payment-icons"><FiCreditCard /> <FiLock /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
