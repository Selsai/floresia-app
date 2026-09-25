// Rôle : Page et interactions de cette fonctionnalité.
// NotFound : guide le visiteur lorsqu’une adresse n’existe pas.
import { Link } from 'react-router-dom';
import { ArrowLeft, Flower2 } from 'lucide-react';
import logo from '../../assets/brand/logo-floresia.webp';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__decoration not-found__decoration--left" aria-hidden="true" />
      <div className="not-found__decoration not-found__decoration--right" aria-hidden="true" />

      <div className="not-found__card">
        <img className="not-found__logo" src={logo} alt="" aria-hidden="true" />
        <p className="not-found__brand">Florésia</p>

        <div className="not-found__code" aria-hidden="true">
          <span>4</span>
          <Flower2 strokeWidth={1.5} />
          <span>4</span>
        </div>

        <h1 id="not-found-title">Cette page n’a pas fleuri</h1>
        <p className="not-found__message">
          L’adresse saisie n’existe pas ou la page a été déplacée. Retrouvez nos bouquets et inspirations depuis l’accueil.
        </p>

        <Link className="not-found__button" to="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Revenir à l’accueil
        </Link>
      </div>
    </section>
  );
}
