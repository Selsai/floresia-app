// Rôle : Composant réutilisable de l’interface.
// LoadingSkeleton : espaces reserves pendant le chargement.
import './LoadingSkeleton.css';

function Pulse({ className = '' }) {
  return <span className={`skeleton-pulse ${className}`} aria-hidden="true" />;
}

export function ProductGridSkeleton({ variant = 'home', count = 4 }) {
  return (
    <div className={`skeleton-grid skeleton-grid--${variant}`} role="status" aria-label="Chargement des bouquets">
      <span className="visually-hidden">Chargement des bouquets…</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <Pulse className="skeleton-card__image" />
          <div className="skeleton-card__body"><Pulse className="skeleton-card__eyebrow" /><Pulse className="skeleton-card__title" /><Pulse className="skeleton-card__price" /></div>
        </div>
      ))}
    </div>
  );
}

export function ArticleGridSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-grid skeleton-grid--articles" role="status" aria-label="Chargement des articles">
      <span className="visually-hidden">Chargement des articles…</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card skeleton-card--article" key={index} aria-hidden="true">
          <Pulse className="skeleton-card__image" /><div className="skeleton-card__body"><Pulse className="skeleton-card__eyebrow" /><Pulse className="skeleton-card__title" /><Pulse className="skeleton-card__line" /><Pulse className="skeleton-card__line skeleton-card__line--short" /></div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton({ label = 'Chargement du bouquet' }) {
  return (
    <div className="detail-skeleton container" role="status" aria-label={label}>
      <span className="visually-hidden">Chargement du bouquet…</span>
      <Pulse className="detail-skeleton__image" />
      <div className="detail-skeleton__content"><Pulse className="skeleton-card__eyebrow" /><Pulse className="detail-skeleton__title" /><Pulse className="skeleton-card__line" /><Pulse className="skeleton-card__line" /><Pulse className="skeleton-card__line skeleton-card__line--short" /><Pulse className="detail-skeleton__button" /></div>
    </div>
  );
}

export function ComposerSkeleton() {
  return (
    <div className="composer-skeleton container" role="status" aria-label="Chargement de l'atelier floral">
      <span className="visually-hidden">Chargement de l'atelier floral…</span>
      <div className="composer-skeleton__content"><Pulse className="detail-skeleton__title" /><Pulse className="skeleton-card__line" /><div className="composer-skeleton__options">{Array.from({ length: 6 }, (_, index) => <Pulse className="composer-skeleton__option" key={index} />)}</div></div>
      <Pulse className="composer-skeleton__preview" />
    </div>
  );
}
