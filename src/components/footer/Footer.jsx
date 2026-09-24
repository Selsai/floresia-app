// Footer : liens et informations de bas de page.
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import logo from '../../assets/brand/logo-floresia.webp';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col footer-intro">
          <Link to="/" className="footer-brand" aria-label="Florésia, accueil">
            <img src={logo} alt="" className="footer-logo-img" />
            <span className="footer-logo-text">Florésia</span>
          </Link>
          <p className="footer-desc">Des fleurs pour imaginer, créer et partager. Une expérience florale conçue dans le cadre d'un projet pédagogique.</p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/floresia.fr/" target="_blank" rel="noopener noreferrer" aria-label="Florésia sur Instagram, nouvel onglet"><FaInstagram aria-hidden="true" /></a>
            <a href="mailto:contact.floresia@gmail.com" aria-label="Écrire à Florésia"><Mail size={19} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h2 className="footer-title">Explorer</h2>
          <ul className="footer-links">
            <li><Link to="/boutique">La collection</Link></li>
            <li><Link to="/personnaliser">Créer un bouquet</Link></li>
            <li><Link to="/blog">Le journal floral</Link></li>
            <li><Link to="/communaute">La communauté</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h2 className="footer-title">Informations</h2>
          <ul className="footer-links">
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/cgv">Conditions de la démonstration</Link></li>
            <li><Link to="/confidentialite">Confidentialité</Link></li>
            <li><Link to="/cookies">Cookies et stockage local</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
          </ul>
        </div>
        <div className="footer-col footer-invitation">
          <h2 className="footer-title">Une création unique</h2>
          <p>Choisissez vos fleurs et laissez vos envies prendre forme.</p>
          <Link to="/personnaliser">Entrer dans l'atelier <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Florésia · Projet pédagogique · Paiements de test uniquement</p>
        <Link to="/mentions-legales">Informations légales</Link>
      </div>
    </footer>
  );
}
