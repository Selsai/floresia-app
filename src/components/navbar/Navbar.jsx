// Navbar : navigation principale.
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, UserRound, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/cart/cart-context';
import logo from '../../assets/brand/logo-floresia.png';
import floralCart from '../../assets/brand/icone-panier.png';
import './Navbar.css';

const links = [
  ['/', 'Accueil'],
  ['/boutique', 'Bouquets'],
  ['/personnaliser', 'Personnalisation'],
  ['/blog', 'Journal floral'],
  ['/communaute', 'Communauté'],
];

export default function Navbar() {
  const [openPath, setOpenPath] = useState(null);
  const { pathname } = useLocation();
  const menuOpen = openPath === pathname;
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();
  const closeMenu = () => setOpenPath(null);

  return (
    <header className="site-header">
      <div className="site-header__note">Un jardin d'idées, imaginé avec passion</div>
      <nav className="navbar" aria-label="Navigation principale" onKeyDown={(event) => {
        if (event.key === 'Escape') closeMenu();
      }}>
        <div className="navbar-container">
          <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="Florésia, accueil">
            <img src={logo} alt="" className="logo-img" />
            <span className="logo-text">Florésia</span>
          </Link>

          <div id="main-navigation" className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'}>
                {label}
              </NavLink>
            ))}
            <Link className="nav-mobile-cta" to="/personnaliser" onClick={closeMenu}>Composer mon bouquet <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>

          <div className="nav-actions">
            <Link to="/compte" className="nav-icon" aria-label="Mon compte" onClick={closeMenu}><UserRound size={20} aria-hidden="true" /></Link>
            <Link to="/panier" className="nav-icon cart-icon" aria-label={`Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}`} onClick={closeMenu}>
              <img src={floralCart} className="nav-floral-cart" alt="" />
              {itemCount > 0 && <span className="cart-badge" aria-hidden="true">{itemCount > 9 ? '9+' : itemCount}</span>}
            </Link>
            <button className="menu-toggle" type="button" onClick={() => setOpenPath(menuOpen ? null : pathname)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="main-navigation">
              {menuOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
