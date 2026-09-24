// Account : profil, adresses et commandes.
import { formatPrice } from '../../utils/price';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { User as FiUser, Package as FiPackage, MapPin as FiMapPin, Heart as FiHeart, Settings as FiSettings, LogOut as FiLogOut, Mail as FiMail, Lock as FiLock, Eye as FiEye, EyeOff as FiEyeOff, Phone as FiPhone, CalendarDays as FiCalendar, Pencil as FiEdit2, Trash2 as FiTrash2, X as FiX, DollarSign as FiDollarSign } from 'lucide-react';
import { useAuth } from '../../context/auth/auth-context';
import { useConfirm } from '../../context/confirm/confirm-context';
import { useCart } from '../../context/cart/cart-context';
import {
  addressesApi,
  ordersApi,
  favoritesApi,
  authApi,
} from '../../services/api';
import AddressAutocomplete from '../../components/address/AddressAutocomplete';
import './Account.css';

const EMPTY_ADDRESS_FORM = {
  label: '',
  fullName: '',
  street: '',
  complement: '',
  city: '',
  zipCode: '',
  country: 'France',
  phone: '',
  isDefault: false,
  lat: null,
  lng: null,
};

const PASSWORD_RULES =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:(?:\+33|0)[1-9](?:[ .-]?\d{2}){4})$/;

const STATUS_LABELS = {
  PENDING: { label: 'En attente', color: 'orange' },
  PAID: { label: 'Payée', color: 'blue' },
  PROCESSING: { label: 'En préparation', color: 'orange' },
  SHIPPED: { label: 'Expédiée', color: 'blue' },
  DELIVERED: { label: 'Livrée', color: 'green' },
  CANCELLED: { label: 'Annulée', color: 'red' },
};

export default function Account() {
  const navigate = useNavigate();
  const {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    getRememberedEmail,
  } = useAuth();
  const { confirm } = useConfirm();
  const { addToCart } = useCart();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // connexion uniquement
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authError, setAuthError] = useState('');
  const [addressFormError, setAddressFormError] = useState('');
  const [signupErrors, setSignupErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  const switchAuthMode = (signup) => {
    setIsSignup(signup);
    setAuthError('');
    setSignupErrors({});
    setTermsError('');
  };

  const [loginData, setLoginData] = useState({
    email: getRememberedEmail(),
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(!!getRememberedEmail());

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // ==========================
  // Adresses
  // ==========================

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM);

  // ==========================
  // Commandes
  // ==========================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // ==========================
  // Favoris
  // ==========================

  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState('');

  // ==========================
  // Paramètres — profil
  // ==========================

  const [profileDraft, setProfileDraft] = useState(null);
  const defaultProfile = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  };
  const profileForm = profileDraft && profileDraft.userId === user?.id
    ? profileDraft.fields
    : defaultProfile;
  const setProfileForm = (update) => {
    setProfileDraft({
      userId: user?.id,
      fields: typeof update === 'function' ? update(profileForm) : update,
    });
  };

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileEmailError, setProfileEmailError] = useState('');

  // ==========================
  // Paramètres — mot de passe
  // ==========================

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;



    addressesApi
      .list(token)
      .then(setAddresses)
      .catch((err) => setAddressesError(err.message))
      .finally(() => setAddressesLoading(false));



    ordersApi
      .list(token)
      .then(setOrders)
      .catch((err) => setOrdersError(err.message))
      .finally(() => setOrdersLoading(false));



    favoritesApi
      .list(token)
      .then(setFavorites)
      .catch((err) => setFavoritesError(err.message))
      .finally(() => setFavoritesLoading(false));
  }, [isAuthenticated, token]);



  const openAddAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({ ...EMPTY_ADDRESS_FORM });
    setShowAddressForm(true);
  };

  const openEditAddressForm = (address) => {
    setEditingAddressId(address.id);

    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      street: address.street,
      complement: address.complement || '',
      city: address.city,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault,
      lat: address.lat ?? null,
      lng: address.lng ?? null,
    });

    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({ ...EMPTY_ADDRESS_FORM });
    setAddressFormError('');
  };

  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();

    setAddressesError('');
    setAddressFormError('');

    if (!addressForm.street.trim() || !/^750(0[1-9]|1[0-9]|20)$/.test(addressForm.zipCode) || !Number.isFinite(addressForm.lat) || !Number.isFinite(addressForm.lng)) {
      setAddressFormError('Sélectionnez une adresse précise dans la liste proposée, à Paris.');
      return;
    }

    if (!PHONE_REGEX.test(addressForm.phone)) {
      setAddressFormError(
        'Numéro de téléphone français invalide (ex: 06 12 34 56 78).'
      );
      return;
    }

    try {
      if (editingAddressId) {
        const updated = await addressesApi.update(
          editingAddressId,
          addressForm,
          token
        );

        setAddresses((prev) =>
          prev.map((address) =>
            address.id === editingAddressId ? updated : address
          )
        );
      } else {
        const created = await addressesApi.create(addressForm, token);

        setAddresses((prev) => [...prev, created]);
      }

      closeAddressForm();
    } catch (err) {
      setAddressesError(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    const ok = await confirm({
      title: 'Supprimer cette adresse',
      message: 'Cette action est définitive.',
    });

    if (!ok) return;

    setAddressesError('');

    try {
      await addressesApi.remove(id, token);
      setAddresses((prev) =>
        prev.filter((address) => address.id !== id)
      );
    } catch (err) {
      setAddressesError(err.message);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    setAddressesError('');

    try {
      const updated = await addressesApi.update(addressId, { isDefault: true }, token);

      setAddresses((prev) =>
        prev.map((address) => ({ ...address, isDefault: address.id === updated.id }))
      );
    } catch (err) {
      setAddressesError(err.message);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    setFavoritesError('');

    try {
      await favoritesApi.remove(productId, token);

      setFavorites((prev) =>
        prev.filter((favorite) => favorite.productId !== productId)
      );
    } catch (err) {
      setFavoritesError(err.message);
    }
  };

  const handleAddFavoriteToCart = (product) => {
    addToCart(product, 1);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileError('');
    setProfileSuccess('');
    setProfileEmailError('');

    if (!EMAIL_REGEX.test(profileForm.email)) {
      setProfileEmailError('Adresse email invalide (ex: nom@exemple.com).');
      return;
    }

    setProfileLoading(true);

    try {
      const updated = await authApi.updateProfile(profileForm, token);
      updateUser(updated);
      setProfileSuccess('Profil mis à jour avec succès.');
    } catch (err) {
      if (/email|e-mail|courriel/i.test(err.message || '')) {
        setProfileEmailError(err.message);
      } else {
        setProfileError(err.message);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(
        'Les deux mots de passe ne correspondent pas.'
      );
      return;
    }

    if (!PASSWORD_RULES.test(passwordForm.newPassword)) {
      setPasswordError(
        'Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial.'
      );
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.changePassword(passwordForm, token);

      setPasswordSuccess(
        'Mot de passe modifié avec succès.'
      );

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

    const handleLogin = async (e) => {
      e.preventDefault();
      setAuthError('');

      const result = await login(
        loginData.email,
        loginData.password,
        rememberMe
      );

      if (!result.success) {
        setAuthError(result.error);
      }
    };

    const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    setTermsError('');

    if (!acceptTerms) {
      setTermsError(
        "Vous devez accepter les conditions d'utilisation pour continuer."
      );
      return;
    }

    const errors = {};

    if (!EMAIL_REGEX.test(signupData.email)) {
      errors.email = 'Adresse email invalide (ex: nom@exemple.com).';
    }

    if (!PHONE_REGEX.test(signupData.phone)) {
      errors.phone =
        'Numéro de téléphone français invalide (ex: 06 12 34 56 78).';
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword =
        'Les mots de passe ne correspondent pas.';
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});

    const result = await register(signupData);

    if (!result.success) {
      setSignupErrors({ form: result.error });
    } else {
      navigate('/verification-email', {
        state: { email: signupData.email },
      });
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <div className="account-auth-container">
          <h1 className="visually-hidden">Compte Florésia : connexion ou inscription</h1>
          <div className="auth-toggle">
            <button
              className={!isSignup ? 'active' : ''}
              onClick={() => switchAuthMode(false)}
            >
              Connexion
            </button>

            <button
              className={isSignup ? 'active' : ''}
              onClick={() => switchAuthMode(true)}
            >
              Inscription
            </button>
          </div>

          {!isSignup ? (
          <form className="auth-form" onSubmit={handleLogin}>
          <h2>Connexion</h2>
          <p className="auth-subtitle">Ravis de vous revoir !</p>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <FiMail />
              <input
                type="email"
                placeholder="votre@email.com"
                className={authError ? 'input-error' : ''}
                value={loginData.email}
                onChange={(e) => {
                  setLoginData({ ...loginData, email: e.target.value });
                  if (authError) setAuthError('');
                }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-with-icon">
              <FiLock />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={authError ? 'input-error' : ''}
                value={loginData.password}
                onChange={(e) => {
                  setLoginData({ ...loginData, password: e.target.value });
                  if (authError) setAuthError('');
                }}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Se souvenir de moi
            </label>
          </div>

          {authError && <p className="field-error">{authError}</p>}

          <Link to="/mot-de-passe-oublie" className="forgot-password">Mot de passe oublié ?</Link>

          <button type="submit" className="btn-submit">
            Se connecter
          </button>

          <p className="auth-switch">
            Pas encore de compte ?{' '}
            <button type="button" onClick={() => switchAuthMode(true)}>
              Créer un compte
            </button>
          </p>
        </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <h2>Inscription</h2>

              <p className="auth-subtitle">
                Rejoignez la famille Floresia !
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>

                  <input
                    type="text"
                    placeholder="Sophie"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nom</label>

                  <input
                    type="text"
                    placeholder="Martin"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>

                <div className="input-with-icon">
                  <FiMail />

                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className={signupErrors.email ? 'input-error' : ''}
                    value={signupData.email}
                    onChange={(e) => {
                      setSignupData({
                        ...signupData,
                        email: e.target.value,
                      });
                      if (signupErrors.email) {
                        setSignupErrors({ ...signupErrors, email: '' });
                      }
                    }}
                    required
                  />
                </div>
                {signupErrors.email && (
                  <p className="field-error">{signupErrors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label>Téléphone</label>

                <div className="input-with-icon">
                  <FiPhone />

                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className={signupErrors.phone ? 'input-error' : ''}
                    value={signupData.phone}
                    onChange={(e) => {
                      setSignupData({
                        ...signupData,
                        phone: e.target.value,
                      });
                      if (signupErrors.phone) {
                        setSignupErrors({ ...signupErrors, phone: '' });
                      }
                    }}
                    required
                  />
                </div>
                {signupErrors.phone && (
                  <p className="field-error">{signupErrors.phone}</p>
                )}
              </div>

              <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={signupErrors.confirmPassword ? 'input-error' : ''}
                  value={signupData.confirmPassword}
                  onChange={(e) => {
                    setSignupData({ ...signupData, confirmPassword: e.target.value });
                    if (signupErrors.confirmPassword) setSignupErrors({ ...signupErrors, confirmPassword: '' });
                  }}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {signupErrors.confirmPassword && (
                <p className="field-error">{signupErrors.confirmPassword}</p>
              )}
            </div>

              <div className="terms-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (termsError) setTermsError('');
                  }}
                />
                <span>J’ai lu les <Link to="/cgv">conditions de la démonstration</Link> et la <Link to="/confidentialite">politique de confidentialité</Link></span>
              </label>
              {termsError && (
                <p className="field-error">{termsError}</p>
              )}
            </div>

              {signupErrors.form && (
                <p className="auth-error" role="alert">{signupErrors.form}</p>
              )}

              <button type="submit" className="btn-submit">
                Créer mon compte
              </button>

              <p className="auth-switch">
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthMode(false)}
                >
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  const totalSpent = orders
    .filter((order) => order.status !== 'CANCELLED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="account-page logged-in">
      <div className="container">
        <div className="account-header">
          <h1>Mon Compte</h1>
        </div>

        {!user.isEmailVerified && (
          <div className="verify-email-banner">
            <span>Votre adresse email n'est pas encore vérifiée.</span>
            <Link to="/verification-email" state={{ email: user.email }}>
              Vérifier mon email →
            </Link>
          </div>
        )}

          <div className="account-layout">
          <aside className="account-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>

            <h3>
              {user.firstName} {user.lastName}
            </h3>

            <p>{user.email}</p>

            {user.createdAt && (
              <span className="member-badge">
                <FiCalendar /> Membre depuis{' '}
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}

            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut /> Déconnexion
            </button>
          </div>

            <nav className="account-nav">
              <button
                className={
                  activeTab === 'dashboard' ? 'active' : ''
                }
                onClick={() => setActiveTab('dashboard')}
              >
                <FiUser /> Tableau de bord
              </button>

              <button
                className={
                  activeTab === 'orders' ? 'active' : ''
                }
                onClick={() => setActiveTab('orders')}
              >
                <FiPackage /> Mes commandes
              </button>

              <button
                className={
                  activeTab === 'addresses' ? 'active' : ''
                }
                onClick={() => setActiveTab('addresses')}
              >
                <FiMapPin /> Adresses
              </button>

              <button
                className={
                  activeTab === 'favorites' ? 'active' : ''
                }
                onClick={() => setActiveTab('favorites')}
              >
                <FiHeart /> Favoris
              </button>

              <button
                className={
                  activeTab === 'settings' ? 'active' : ''
                }
                onClick={() => setActiveTab('settings')}
              >
                <FiSettings /> Mon Profil
              </button>
            </nav>
          </aside>

          <div className="account-main">
            {activeTab === 'dashboard' && (
              <div className="dashboard-content">
                <h2>Bienvenue, {user.firstName} !</h2>

                <div className="stats-grid">
                  <div className="stat-card">
                    <FiPackage className="stat-icon" />
                    <div className="stat-value">
                      {orders.length}
                    </div>
                    <div className="stat-label">
                      Commandes
                    </div>
                  </div>

                  <div className="stat-card">
                    <FiHeart className="stat-icon" />
                    <div className="stat-value">
                      {favorites.length}
                    </div>
                    <div className="stat-label">
                      Favoris
                    </div>
                  </div>

                  <div className="stat-card">
                    <FiDollarSign className="stat-icon" />
                    <div className="stat-value">
                      {formatPrice(totalSpent)}
                    </div>
                    <div className="stat-label">
                      Dépensé
                    </div>
                  </div>
                </div>

                <div className="dashboard-section">
                  <h3>Dernières commandes</h3>

                  {ordersLoading && <p>Chargement…</p>}

                  {!ordersLoading && orders.length === 0 && (
                    <p>Aucune commande pour le moment.</p>
                  )}

                  <div className="recent-orders">
                    {orders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="order-mini"
                      >
                        <div className="order-info">
                          <strong>
                            #{order.id.slice(-8).toUpperCase()}
                          </strong>

                          <span>
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString('fr-FR')}
                          </span>
                        </div>

                        <div
                          className={`order-status status-${
                            STATUS_LABELS[order.status]?.color
                          }`}
                        >
                          {STATUS_LABELS[order.status]?.label ||
                            order.status}
                        </div>

                        <div className="order-total">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {orders.length > 0 && (
                    <button
                      className="btn-link"
                      onClick={() => setActiveTab('orders')}
                    >
                      Voir toutes mes commandes →
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-content">
                <h2>Mes Commandes</h2>

                {ordersError && (
                  <p className="auth-error">{ordersError}</p>
                )}

                {ordersLoading && <p>Chargement…</p>}

                {!ordersLoading && orders.length === 0 && (
                  <p>
                    Vous n'avez pas encore passé de commande.
                  </p>
                )}

                <div className="orders-list">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="order-card"
                    >
                      <div className="order-header">
                        <div>
                          <h3>
                            Commande #
                            {order.id.slice(-8).toUpperCase()}
                          </h3>

                          <p>
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString('fr-FR')}{' '}
                            • {order.items.length} article(s)
                          </p>
                        </div>

                        <span
                          className={`status-badge status-${
                            STATUS_LABELS[order.status]?.color
                          }`}
                        >
                          {STATUS_LABELS[order.status]?.label ||
                            order.status}
                        </span>
                      </div>

                      <div className="order-items-mini">
                        {order.items.map((item) => (
                          <p key={item.id}>
                            {item.quantity}× {item.product.name}
                          </p>
                        ))}
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          Total :{' '}
                          <strong>
                            {formatPrice(order.totalAmount)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="addresses-content">
                <div className="section-header">
                  <h2>Mes Adresses</h2>

                  <button
                    className="btn-primary"
                    onClick={openAddAddressForm}
                  >
                    + Ajouter une adresse
                  </button>
                </div>

                {addressesError && (
                  <p className="auth-error">{addressesError}</p>
                )}

                {addressesLoading && (
                  <p>Chargement des adresses…</p>
                )}

                {showAddressForm && (
                  <div className="address-form-overlay">
                    <form
                      className="address-form"
                      onSubmit={handleAddressFormSubmit}
                    >
                      <div className="address-form-header">
                        <h3>
                          {editingAddressId
                            ? 'Modifier l’adresse'
                            : 'Nouvelle adresse'}
                        </h3>

                        <button
                          type="button"
                          className="btn-icon"
                          onClick={closeAddressForm}
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Libellé</label>

                        <input
                          type="text"
                          placeholder="Domicile, Travail…"
                          value={addressForm.label}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              label: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Nom complet</label>

                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              fullName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Adresse (Paris uniquement) *
                        </label>

                        <AddressAutocomplete
                          initialValue={addressForm.street ? `${addressForm.street}, ${addressForm.zipCode} ${addressForm.city}` : ''}
                          onClear={() => {
                            setAddressForm((current) => ({ ...current, street: '', city: '', zipCode: '', lat: null, lng: null }));
                            setAddressFormError('');
                          }}
                          onSelect={({
                            street,
                            city,
                            zipCode,
                            lat,
                            lng,
                          }) => {
                            setAddressForm((current) => ({
                              ...current,
                              street,
                              city,
                              zipCode,
                              lat,
                              lng,
                            }));
                            setAddressFormError('');
                          }}
                        />
                        {addressFormError.startsWith('Sélectionnez une adresse') && <p className="field-error" role="alert">{addressFormError}</p>}
                      </div>

                      <div className="form-group">
                        <label>
                          Complément d'adresse (optionnel)
                        </label>

                        <input
                          type="text"
                          placeholder="Bâtiment B, 3ème étage, appt 12, code 1234A…"
                          value={addressForm.complement}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              complement: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Pays</label>

                        <input
                          type="text"
                          value={addressForm.country}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Téléphone *</label>

                        <input
                          type="tel"
                          placeholder="06 12 34 56 78"
                          className={
                            addressFormError.startsWith('Numéro')
                              ? 'input-error'
                              : ''
                          }
                          value={addressForm.phone}
                          onChange={(e) => {
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            });

                            if (addressFormError) {
                              setAddressFormError('');
                            }
                          }}
                          required
                        />

                        {addressFormError.startsWith('Numéro') && (
                          <p className="field-error">
                            {addressFormError}
                          </p>
                        )}
                      </div>

                      <div className="form-group form-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                isDefault: e.target.checked,
                              })
                            }
                          />
                          <span>Adresse par défaut</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="btn-submit"
                      >
                        {editingAddressId
                          ? 'Enregistrer les modifications'
                          : 'Ajouter l’adresse'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="addresses-grid">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="address-card"
                    >
                      {address.isDefault && (
                        <span className="default-badge">
                          Par défaut
                        </span>
                      )}

                      <h3>{address.label}</h3>

                      <p>
                        <strong>{address.fullName}</strong>
                      </p>

                      <p>{address.street}</p>

                      {address.complement && (
                        <p className="address-complement">
                          {address.complement}
                        </p>
                      )}

                      <p>
                        {address.zipCode} {address.city}
                      </p>

                      <p>{address.country}</p>

                      {address.phone && (
                        <p>{address.phone}</p>
                      )}

                      <div className="address-actions">
                        <button
                          className="btn-icon"
                          onClick={() => openEditAddressForm(address)}
                        >
                          <FiEdit2 /> Modifier
                        </button>

                        <button
                          className="btn-icon danger"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <FiTrash2 /> Supprimer
                        </button>
                      </div>

                      {!address.isDefault && (
                        <button
                          className="btn-set-default"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          Définir comme adresse de livraison
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!addressesLoading &&
                  addresses.length === 0 && (
                    <p>
                      Aucune adresse enregistrée pour le moment.
                    </p>
                  )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="favorites-content">
                <h2>Mes Favoris</h2>

                {favoritesError && (
                  <p className="auth-error">{favoritesError}</p>
                )}

                {favoritesLoading && <p>Chargement…</p>}

                {!favoritesLoading &&
                  favorites.length === 0 && (
                    <p>
                      Vous n'avez pas encore de favoris.
                    </p>
                  )}

                <div className="favorites-grid">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="favorite-card"
                    >
                      <button
                        className="remove-favorite"
                        onClick={() =>
                          handleRemoveFavorite(
                            favorite.productId
                          )
                        }
                        aria-label="Retirer des favoris"
                      >
                        <FiX />
                      </button>

                      <Link
                        to={`/produit/${favorite.productId}`}
                      >
                        <img
                          src={favorite.product.imageUrl}
                          alt={favorite.product.name}
                        />
                      </Link>

                      <h3>{favorite.product.name}</h3>

                      <p className="price">
                        {formatPrice(favorite.product.price)}
                      </p>

                      <button
                        className="btn-add-cart"
                        onClick={() =>
                          handleAddFavoriteToCart(
                            favorite.product
                          )
                        }
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-content">
                <h2>Mon Profil</h2>

                <div className="settings-section">
                  <h3>Informations personnelles</h3>

                  {profileError && (
                    <p className="auth-error" role="alert">{profileError}</p>
                  )}

                  {profileSuccess && (
                    <p className="auth-success">
                      {profileSuccess}
                    </p>
                  )}

                  <form
                    className="settings-form"
                    onSubmit={handleProfileSubmit}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label>Prénom</label>

                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Nom</label>

                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email</label>

                      <input
                        type="email"
                        className={profileEmailError ? 'input-error' : ''}
                        value={profileForm.email}
                        onChange={(e) => {
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          });
                          if (profileEmailError) {
                            setProfileEmailError('');
                          }
                        }}
                        required
                      />

                      {profileEmailError && (
                        <p className="field-error field-error--prominent" role="alert">{profileEmailError}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Téléphone</label>

                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={profileLoading}
                      style={{ maxWidth: 280 }}
                    >
                      {profileLoading
                        ? 'Enregistrement…'
                        : 'Enregistrer les modifications'}
                    </button>
                  </form>
                </div>

                <div className="settings-section">
                  <h3>Changer le mot de passe</h3>

                  <p
                    style={{
                      color: 'var(--text-mid)',
                      fontSize: '0.9rem',
                      marginBottom: '20px',
                    }}
                  >
                    Minimum 12 caractères, avec une majuscule,
                    un chiffre et un caractère spécial.
                  </p>

                  {passwordError && (
                    <p className="auth-error">
                      {passwordError}
                    </p>
                  )}

                  {passwordSuccess && (
                    <p className="auth-success">
                      {passwordSuccess}
                    </p>
                  )}

                  <form
                    className="settings-form"
                    onSubmit={handlePasswordSubmit}
                  >
                    <div className="form-group">
                      <label>Mot de passe actuel</label>

                      <div className="input-with-icon">
                        <FiLock />

                        <input
                          type={
                            showCurrentPassword
                              ? 'text'
                              : 'password'
                          }
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />

                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() =>
                            setShowCurrentPassword(
                              !showCurrentPassword
                            )
                          }
                        >
                          {showCurrentPassword ? (
                            <FiEyeOff />
                          ) : (
                            <FiEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Nouveau mot de passe</label>

                      <div className="input-with-icon">
                        <FiLock />

                        <input
                          type={
                            showNewPassword
                              ? 'text'
                              : 'password'
                          }
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          required
                        />

                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() =>
                            setShowNewPassword(
                              !showNewPassword
                            )
                          }
                        >
                          {showNewPassword ? (
                            <FiEyeOff />
                          ) : (
                            <FiEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Confirmer le nouveau mot de passe
                      </label>

                      <div className="input-with-icon">
                        <FiLock />

                        <input
                          type={
                            showNewPassword
                              ? 'text'
                              : 'password'
                          }
                          value={
                            passwordForm.confirmPassword
                          }
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={passwordLoading}
                      style={{ maxWidth: 280 }}
                    >
                      {passwordLoading
                        ? 'Modification…'
                        : 'Changer le mot de passe'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
