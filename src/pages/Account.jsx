import { useState } from 'react';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiSettings, FiLogOut, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './Account.css';

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' 
  });

  const userData = {
    firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@email.com',
    phone: '06 12 34 56 78', memberSince: 'Février 2024', totalOrders: 12, totalSpent: '648€'
  };

  const orders = [
    { id: 'CMD-2026-001', date: '3 mars 2026', status: 'Livrée', total: '59.90€', items: 2, statusColor: 'green' },
    { id: 'CMD-2026-002', date: '14 février 2026', status: 'En cours', total: '89.90€', items: 1, statusColor: 'orange' },
    { id: 'CMD-2026-003', date: '28 janvier 2026', status: 'Livrée', total: '45.00€', items: 3, statusColor: 'green' }
  ];

  const addresses = [
    { id: 1, label: 'Domicile', name: 'Sophie Martin', street: '25 Rue de la Paix', city: '75002 Paris', phone: '06 12 34 56 78', isDefault: true },
    { id: 2, label: 'Travail', name: 'Sophie Martin', street: '12 Avenue des Champs-Élysées', city: '75008 Paris', phone: '06 12 34 56 78', isDefault: false }
  ];

  const favorites = [
    { id: 1, name: 'Bouquet Romance Éternelle', price: '59.90€', image: '/src/assets/produit-1.png' },
    { id: 5, name: 'Jardin Secret', price: '69.90€', image: '/src/assets/produit-5.png' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      alert('Connexion réussie ! Bienvenue Sophie 👋');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    setIsLoggedIn(true);
    setIsSignup(false);
    alert('Compte créé ! Bienvenue 🌸');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    alert('Déconnexion réussie 👋');
  };

  if (!isLoggedIn) {
    return (
      <div className="account-page">
        <div className="account-auth-container">
          <div className="auth-toggle">
            <button className={!isSignup ? 'active' : ''} onClick={() => setIsSignup(false)}>Connexion</button>
            <button className={isSignup ? 'active' : ''} onClick={() => setIsSignup(true)}>Inscription</button>
          </div>

          {!isSignup ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>Connexion</h2>
              <p className="auth-subtitle">Ravis de vous revoir ! 🌸</p>
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <FiMail />
                  <input type="email" placeholder="votre@email.com" value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <div className="input-with-icon">
                  <FiLock />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <a href="#" className="forgot-password">Mot de passe oublié ?</a>
              <button type="submit" className="btn-submit">Se connecter</button>
              <p className="auth-switch">Pas encore de compte ? <button type="button" onClick={() => setIsSignup(true)}>Créer un compte</button></p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <h2>Inscription</h2>
              <p className="auth-subtitle">Rejoignez la famille Floresia ! 🌸</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Sophie" value={signupData.firstName}
                    onChange={(e) => setSignupData({...signupData, firstName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Martin" value={signupData.lastName}
                    onChange={(e) => setSignupData({...signupData, lastName: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <FiMail />
                  <input type="email" placeholder="votre@email.com" value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <div className="input-with-icon">
                  <FiPhone />
                  <input type="tel" placeholder="06 12 34 56 78" value={signupData.phone}
                    onChange={(e) => setSignupData({...signupData, phone: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <div className="input-with-icon">
                  <FiLock />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <div className="input-with-icon">
                  <FiLock />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn-submit">Créer mon compte</button>
              <p className="auth-switch">Déjà un compte ? <button type="button" onClick={() => setIsSignup(false)}>Se connecter</button></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="account-page logged-in">
      <div className="container">
        <div className="account-header">
          <h1>Mon Compte</h1>
          <button className="btn-logout" onClick={handleLogout}><FiLogOut /> Déconnexion</button>
        </div>

        <div className="account-layout">
          <aside className="account-sidebar">
            <div className="user-card">
              <div className="user-avatar">{userData.firstName.charAt(0)}{userData.lastName.charAt(0)}</div>
              <h3>{userData.firstName} {userData.lastName}</h3>
              <p>{userData.email}</p>
              <span className="member-badge"><FiCalendar /> Membre depuis {userData.memberSince}</span>
            </div>
            <nav className="account-nav">
              <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                <FiUser /> Tableau de bord
              </button>
              <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                <FiPackage /> Mes commandes
              </button>
              <button className={activeTab === 'addresses' ? 'active' : ''} onClick={() => setActiveTab('addresses')}>
                <FiMapPin /> Adresses
              </button>
              <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>
                <FiHeart /> Favoris
              </button>
              <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                <FiSettings /> Paramètres
              </button>
            </nav>
          </aside>

          <main className="account-main">
            {activeTab === 'dashboard' && (
              <div className="dashboard-content">
                <h2>Bienvenue, {userData.firstName} ! 👋</h2>
                <div className="stats-grid">
                  <div className="stat-card"><FiPackage className="stat-icon" /><div className="stat-value">{userData.totalOrders}</div><div className="stat-label">Commandes</div></div>
                  <div className="stat-card"><FiHeart className="stat-icon" /><div className="stat-value">{favorites.length}</div><div className="stat-label">Favoris</div></div>
                  <div className="stat-card"><span className="stat-icon">💰</span><div className="stat-value">{userData.totalSpent}</div><div className="stat-label">Dépensé</div></div>
                </div>
                <div className="dashboard-section">
                  <h3>Dernières commandes</h3>
                  <div className="recent-orders">
                    {orders.slice(0, 2).map(order => (
                      <div key={order.id} className="order-mini">
                        <div className="order-info"><strong>#{order.id}</strong><span>{order.date}</span></div>
                        <div className="order-status" style={{ color: order.statusColor }}>{order.status}</div>
                        <div className="order-total">{order.total}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-link" onClick={() => setActiveTab('orders')}>Voir toutes mes commandes →</button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-content">
                <h2>Mes Commandes</h2>
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div><h3>Commande #{order.id}</h3><p>{order.date} • {order.items} article(s)</p></div>
                        <span className={`status-badge ${order.statusColor}`}>{order.status}</span>
                      </div>
                      <div className="order-footer">
                        <div className="order-total">Total : <strong>{order.total}</strong></div>
                        <button className="btn-secondary">Voir détails</button>
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
                  <button className="btn-primary">+ Ajouter une adresse</button>
                </div>
                <div className="addresses-grid">
                  {addresses.map(address => (
                    <div key={address.id} className="address-card">
                      {address.isDefault && <span className="default-badge">Par défaut</span>}
                      <h3>{address.label}</h3>
                      <p><strong>{address.name}</strong></p>
                      <p>{address.street}</p>
                      <p>{address.city}</p>
                      <p>{address.phone}</p>
                      <div className="address-actions">
                        <button className="btn-icon"><FiEdit2 /> Modifier</button>
                        <button className="btn-icon danger"><FiTrash2 /> Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="favorites-content">
                <h2>Mes Favoris</h2>
                <div className="favorites-grid">
                  {favorites.map(product => (
                    <div key={product.id} className="favorite-card">
                      <button className="remove-favorite"><FiHeart /></button>
                      <img src={product.image} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p className="price">{product.price}</p>
                      <button className="btn-add-cart">Ajouter au panier</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-content">
                <h2>Paramètres du compte</h2>
                <div className="settings-section">
                  <h3>Informations personnelles</h3>
                  <form className="settings-form">
                    <div className="form-row">
                      <div className="form-group"><label>Prénom</label><input type="text" defaultValue={userData.firstName} /></div>
                      <div className="form-group"><label>Nom</label><input type="text" defaultValue={userData.lastName} /></div>
                    </div>
                    <div className="form-group"><label>Email</label><input type="email" defaultValue={userData.email} /></div>
                    <div className="form-group"><label>Téléphone</label><input type="tel" defaultValue={userData.phone} /></div>
                    <button type="submit" className="btn-primary">Enregistrer</button>
                  </form>
                </div>
                <div className="settings-section danger-zone">
                  <h3>Zone dangereuse</h3>
                  <p>La suppression de votre compte est irréversible.</p>
                  <button className="btn-danger">Supprimer mon compte</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}