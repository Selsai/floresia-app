import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import logo from '../assets/icons/Logo-Florésia.png';
import cartIcon from '../assets/icons/icone-panier.png';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Floresia logo" className="logo-img" />
          <span className="logo-text">Floresia</span>
        </Link>

        {/* Menu hamburger (mobile) */}
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation links */}
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
          <li><Link to="/boutique" onClick={() => setMenuOpen(false)}>Boutique</Link></li>
          <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
          <li><Link to="/communaute" onClick={() => setMenuOpen(false)}>Communauté</Link></li>
        </ul>

        {/* Icônes compte + panier */}
        <div className="nav-actions">
          <Link to="/compte" className="nav-icon" aria-label="Mon compte">
            <FiUser size={20} />
          </Link>
          <Link to="/panier" className="nav-icon cart-icon" aria-label="Panier">
            <img src={cartIcon} alt="Panier" className="cart-icon-img" />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}