import { Link } from 'react-router-dom';
import logo from '../assets/icons/Logo-Florésia.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Colonne 1 : Logo + description */}
        <div className="footer-col">
          <div className="footer-brand">
            <img src={logo} alt="Logo Floresia" className="footer-logo-img" />
            <span className="footer-logo-text">Floresia</span>
          </div>
          <p className="footer-desc">
            Des bouquets artisanaux créés avec passion, pour sublimer chaque instant de votre vie.
          </p>
        </div>

        {/* Colonne 2 : Boutique */}
        <div className="footer-col">
          <h4 className="footer-title">Boutique</h4>
          <ul className="footer-links">
            <li><Link to="/boutique">Nos bouquets</Link></li>
            <li><Link to="/personnaliser">Bouquet sur-mesure</Link></li>
            <li><Link to="/promotions">Promotions</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Informations */}
        <div className="footer-col">
          <h4 className="footer-title">Informations</h4>
          <ul className="footer-links">
            <li><Link to="/livraison">Livraison & retours</Link></li>
            <li><Link to="/cgv">CGV</Link></li>
            <li><Link to="/rgpd">Confidentialité & RGPD</Link></li>
          </ul>
        </div>

        {/* Colonne 4 : Contact */}
        <div className="footer-col">
          <h4 className="footer-title">Contact</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Nous contacter</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/chatbot">Chatbot 🤖</Link></li>
          </ul>
        </div>

      </div>

      {/* Ligne de copyright */}
      <div className="footer-bottom">
        <p>© 2025 Floresia — Tous droits réservés</p>
        <div className="footer-legal">
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgv">CGV</Link>
          <Link to="/rgpd">RGPD</Link>
        </div>
      </div>
    </footer>
  );
}
