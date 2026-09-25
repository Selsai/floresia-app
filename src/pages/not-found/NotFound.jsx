// Rôle : Page et interactions de cette fonctionnalité.
// NotFound : page introuvable.
import { Link } from 'react-router-dom';
import '../information/InformationPages.css';

export default function NotFound() {
  return (
    <div className="information-page container">
      <p className="information-page__eyebrow">Florésia</p>
      <h1>Page introuvable</h1>
      <p>Cette page n’existe pas ou son adresse a changé.</p>
      <Link to="/">Revenir à l’accueil</Link>
    </div>
  );
}
