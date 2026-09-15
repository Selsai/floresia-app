import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiStar,
  FiHeart,
  FiCamera,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiInstagram,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import {
  testimonialsApi,
  galleryApi,
  resolveUploadUrl,
} from '../services/api';
import communauteHero from '../assets/community/communaute-hero.png';
import temoignage1 from '../assets/community/temoignage-1.png';
import temoignage2 from '../assets/community/temoignage-2.png';
import temoignage3 from '../assets/community/temoignage-3.png';
import galerie1 from '../assets/community/galerie-1.png';
import galerie2 from '../assets/community/galerie-2.png';
import galerie3 from '../assets/community/galerie-3.png';
import galerie4 from '../assets/community/galerie-4.png';
import galerie5 from '../assets/community/galerie-5.png';
import galerie6 from '../assets/community/galerie-6.png';
import './Community.css';

const OCCASIONS = [
  'Anniversaire',
  'Mariage',
  'Saint-Valentin',
  'Naissance',
  'Deuil',
  'Sans occasion particulière',
  'Autre',
];

const FICTIONAL_TESTIMONIALS = [
  {
    id: 'fake-1',
    authorName: 'Sophie Martin',
    location: 'Paris',
    date: '12 février 2026',
    rating: 5,
    image: temoignage1,
    occasion: 'Anniversaire',
    content:
      "J'ai commandé un bouquet pour l'anniversaire de ma mère et elle était aux anges ! Les fleurs étaient magnifiques, fraîches et ont duré plus de 10 jours. Le service client est adorable et la livraison ultra rapide. Je recommande à 100% !",
  },
  {
    id: 'fake-2',
    authorName: 'Marie Dubois',
    location: 'Lyon',
    date: '8 février 2026',
    rating: 5,
    image: temoignage2,
    occasion: 'Abonnement mensuel',
    content:
      "Floresia fait partie de ma vie depuis 2 ans maintenant. À chaque commande, c'est la même qualité exceptionnelle. Les compositions sont toujours élégantes et les fleurs d'une fraîcheur incomparable. Mon fleuriste de confiance !",
  },
  {
    id: 'fake-3',
    authorName: 'Thomas Leroux',
    location: 'Marseille',
    date: '3 février 2026',
    rating: 5,
    image: temoignage3,
    occasion: 'Saint-Valentin',
    content:
      "Premier achat pour la Saint-Valentin et je suis bluffé ! Ma compagne a adoré le bouquet personnalisé. Les conseils par chat étaient précieux pour choisir les bonnes fleurs. Bravo pour ce service au top !",
  },
];

const FICTIONAL_GALLERY = [
  { id: 'fake-g1', image: galerie1, username: '@marie_fleurs' },
  { id: 'fake-g2', image: galerie2, username: '@julie_garden' },
  { id: 'fake-g3', image: galerie3, username: '@wedding_sophie' },
  { id: 'fake-g4', image: galerie4, username: '@nature_emma' },
  { id: 'fake-g5', image: galerie5, username: '@boho_home' },
  { id: 'fake-g6', image: galerie6, username: '@parisian_style' },
];

const stats = [
  { icon: <FiUsers />, value: '15 000+', label: 'Clients satisfaits' },
  { icon: <FiHeart />, value: '98%', label: 'Taux de satisfaction' },
  { icon: <FiTrendingUp />, value: '50 000+', label: 'Bouquets livrés' },
  { icon: <FiAward />, value: '4.9/5', label: 'Note moyenne' },
];

function initials(name) {
  const parts = name.trim().split(' ');
  return parts
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function GateBanner({ verified }) {
  return (
    <div className="community-verify-banner">
      {verified ? (
        <>
          <span>Connectez-vous pour partager votre expérience.</span>
          <Link to="/compte">Se connecter →</Link>
        </>
      ) : (
        <>
          <span>Votre adresse email n&apos;est pas encore vérifiée.</span>
          <Link to="/verification-email">Vérifier mon email →</Link>
        </>
      )}
    </div>
  );
}

export default function Community() {
  const { user, token, isAuthenticated } = useAuth();
  const { confirm } = useConfirm();

  const canPost = isAuthenticated && user?.isEmailVerified;

  const [realTestimonials, setRealTestimonials] = useState([]);
  const [realGallery, setRealGallery] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    occasion: OCCASIONS[0],
    content: '',
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoHandle, setPhotoHandle] = useState('@');
  const [photoSubmitting, setPhotoSubmitting] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');

  const loadTestimonials = () =>
    testimonialsApi
      .list()
      .then(setRealTestimonials)
      .catch(() => {});

  const loadGallery = () =>
    galleryApi
      .list()
      .then(setRealGallery)
      .catch(() => {});

  useEffect(() => {
    loadTestimonials();
    loadGallery();
  }, []);

  const allTestimonials = [
    ...FICTIONAL_TESTIMONIALS,
    ...realTestimonials.map((testimonial) => ({
      id: testimonial.id,
      authorName: testimonial.authorName,
      location: null,
      date: new Date(testimonial.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      rating: testimonial.rating,
      image: null,
      occasion: testimonial.occasion,
      content: testimonial.content,
      authorId: testimonial.authorId,
    })),
  ];

  const allGallery = [
    ...FICTIONAL_GALLERY,
    ...realGallery.map((gallery) => ({
      id: gallery.id,
      image: resolveUploadUrl(gallery.imageUrl),
      username: gallery.instagramHandle || null,
      caption: gallery.caption,
      authorId: gallery.authorId,
    })),
  ];

  const handleDeleteTestimonial = async (id) => {
    const ok = await confirm({
      title: 'Supprimer cet avis',
      message: 'Cette action est définitive.',
    });

    if (!ok) return;

    try {
      await testimonialsApi.remove(id, token);
      loadTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePhoto = async (id) => {
    const ok = await confirm({
      title: 'Supprimer cette photo',
      message: 'Cette action est définitive.',
    });

    if (!ok) return;

    try {
      await galleryApi.remove(id, token);
      loadGallery();

      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setReviewSubmitting(true);

    try {
      await testimonialsApi.submit(reviewForm, token);
      setReviewSuccess('Merci pour votre avis !');
      setReviewForm({
        rating: 5,
        occasion: OCCASIONS[0],
        content: '',
      });
      loadTestimonials();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setPhotoError('');
    setPhotoSuccess('');

    if (!photoFile) {
      setPhotoError('Choisissez une photo à partager.');
      return;
    }

    setPhotoSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('image', photoFile);

      if (photoCaption) {
        formData.append('caption', photoCaption);
      }

      const cleanHandle = photoHandle.trim();

      if (cleanHandle && cleanHandle !== '@') {
        formData.append('instagramHandle', cleanHandle);
      }

      await galleryApi.submit(formData, token);

      setPhotoSuccess(
        'Merci pour votre photo, elle est maintenant visible dans la galerie !',
      );
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoCaption('');
      setPhotoHandle('@');
      loadGallery();
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setPhotoSubmitting(false);
    }
  };

  return (
    <div className="community">
      <section
        className="community-hero"
        style={{ backgroundImage: `url(${communauteHero})` }}
      >
        <div className="hero-overlay">
          <div className="container">
            <h1 className="community-hero-title">
              Notre Communauté Floresia
            </h1>
            <p className="community-hero-subtitle">
              Rejoignez plus de 15 000 passionnés de fleurs qui partagent leur
              amour de la nature
            </p>
          </div>
        </div>
      </section>

      <section className="community-stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Ils parlent de nous</h2>
            <p>Découvrez les avis authentiques de notre communauté</p>
          </div>

          <div className="testimonials-grid">
            {allTestimonials.map((testimonial) => {
              const canDelete =
                isAuthenticated &&
                (user?.role === 'ADMIN' ||
                  user?.id === testimonial.authorId);

              return (
                <div key={testimonial.id} className="testimonial-card">
                  {canDelete && (
                    <button
                      className="delete-badge"
                      onClick={() =>
                        handleDeleteTestimonial(testimonial.id)
                      }
                    >
                      <FiX />
                    </button>
                  )}

                  <div className="testimonial-header">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.authorName}
                        className="testimonial-avatar"
                      />
                    ) : (
                      <div className="testimonial-avatar-initials">
                        {initials(testimonial.authorName)}
                      </div>
                    )}

                    <div className="testimonial-info">
                      <h3>{testimonial.authorName}</h3>

                      {testimonial.location && (
                        <p className="testimonial-location">
                          {testimonial.location}
                        </p>
                      )}

                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, index) => (
                          <FiStar
                            key={index}
                            className={
                              index < testimonial.rating ? 'filled' : ''
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {testimonial.occasion && (
                    <div className="testimonial-occasion">
                      <span>{testimonial.occasion}</span>
                    </div>
                  )}

                  <p className="testimonial-comment">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="testimonial-date">
                    {testimonial.date}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="testimonials-cta">
            <p>Vous aussi, partagez votre expérience !</p>
            <button
              className="btn-primary"
              onClick={() =>
                document
                  .getElementById('avis-form')
                  .scrollIntoView({ behavior: 'smooth' })
              }
            >
              Laisser un avis
            </button>
          </div>
        </div>
      </section>

      <section className="instagram-gallery">
        <div className="container">
          <div className="section-header">
            <FiInstagram className="section-icon" />
            <h2>#FloresiaFamily</h2>
            <p>Partagez vos plus beaux moments fleuris avec nous</p>
          </div>

          <div className="gallery-grid">
            {allGallery.map((photo) => {
              const canDelete =
                isAuthenticated &&
                (user?.role === 'ADMIN' || user?.id === photo.authorId);

              return (
                <div
                  key={photo.id}
                  className="gallery-item"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.image}
                    alt="Partage communauté"
                  />

                  {canDelete && (
                    <button
                      className="delete-badge gallery-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                    >
                      <FiX />
                    </button>
                  )}

                  <div className="gallery-overlay">
                    <div className="gallery-info">
                      <span className="gallery-username">
                        {photo.username || 'Client Florésia'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="gallery-cta">
            <p>
              Taguez-nous sur vos photos avec{' '}
              <strong>#FloresiaFamily</strong>
            </p>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-instagram"
            >
              <FiInstagram /> Suivre @floresia
            </a>
          </div>
        </div>
      </section>

      <section className="share-photo-section" id="avis-form">
        <div className="container">
          <div className="share-layout">
            <div className="share-content">
              <div className="share-heading">
                <FiStar className="share-icon" />
                <h2>Laissez votre avis</h2>
              </div>

              <p>
                Votre expérience compte ! Partagez votre avis sur Florésia avec
                notre communauté.
              </p>

              <div className="share-benefits">
                <div className="benefit">
                  <FiHeart />
                  <span>Aidez la communauté à choisir</span>
                </div>

                <div className="benefit">
                  <FiAward />
                  <span>Vos avis nous aident à nous améliorer</span>
                </div>
              </div>
            </div>

            <div className="share-form">
              {canPost ? (
                <form onSubmit={handleReviewSubmit}>
                  <h3>Votre avis</h3>

                  <div className="form-group">
                    <label>Votre note</label>

                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((number) => (
                        <button
                          type="button"
                          key={number}
                          className={
                            number <= reviewForm.rating
                              ? 'star-btn filled'
                              : 'star-btn'
                          }
                          onClick={() =>
                            setReviewForm({
                              ...reviewForm,
                              rating: number,
                            })
                          }
                        >
                          <FiStar />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Occasion</label>

                    <select
                      value={reviewForm.occasion}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          occasion: e.target.value,
                        })
                      }
                    >
                      {OCCASIONS.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Votre commentaire</label>

                    <textarea
                      rows="4"
                      placeholder="Racontez-nous votre expérience..."
                      value={reviewForm.content}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          content: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {reviewError && (
                    <p className="field-error">{reviewError}</p>
                  )}

                  {reviewSuccess && (
                    <p className="auth-success">{reviewSuccess}</p>
                  )}

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Envoi…' : 'Publier mon avis'}
                  </button>
                </form>
              ) : (
                <GateBanner verified={!isAuthenticated} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="share-photo-section" id="photo-form">
        <div className="container">
          <div className="share-layout">
            <div className="share-content">
              <div className="share-heading">
                <FiCamera className="share-icon" />
                <h2>Partagez votre photo</h2>
              </div>

              <p>
                Votre bouquet Floresia mérite d&apos;être mis en lumière !
                Partagez votre photo avec notre communauté.
              </p>

              <div className="share-benefits">
                <div className="benefit">
                  <FiHeart />
                  <span>Soyez inspiré par la communauté</span>
                </div>

                <div className="benefit">
                  <FiInstagram />
                  <span>Ajoutez votre pseudo pour être identifié</span>
                </div>
              </div>
            </div>

            <div className="share-form">
              {canPost ? (
                <form onSubmit={handlePhotoSubmit}>
                  <h3>Envoyez votre photo</h3>

                  <div className="form-group">
                    <label className="file-upload">
                      <FiCamera />
                      <span>Choisir une photo</span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                      />
                    </label>

                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Aperçu"
                        className="photo-preview"
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Légende (optionnel)</label>

                    <textarea
                      rows="3"
                      placeholder="Quelle occasion ? Comment avez-vous mis en scène votre bouquet ?"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Pseudo Instagram (optionnel)</label>

                    <input
                      type="text"
                      placeholder="@votre_pseudo"
                      value={photoHandle}
                      onChange={(e) => setPhotoHandle(e.target.value)}
                    />
                  </div>

                  {photoError && (
                    <p className="field-error">{photoError}</p>
                  )}

                  {photoSuccess && (
                    <p className="auth-success">{photoSuccess}</p>
                  )}

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={photoSubmitting}
                  >
                    {photoSubmitting ? 'Envoi…' : 'Envoyer ma photo'}
                  </button>

                  <p className="form-disclaimer">
                    En envoyant votre photo, vous acceptez qu&apos;elle soit
                    visible publiquement sur cette page.
                  </p>
                </form>
              ) : (
                <GateBanner verified={!isAuthenticated} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="community-cta">
        <div className="container">
          <h2>Prêt à rejoindre la famille Floresia ?</h2>
          <p>
            Découvrez nos créations et commandez votre premier bouquet dès
            maintenant
          </p>
          <Link to="/boutique" className="btn-cta">
            Découvrir la boutique
          </Link>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="photo-modal-overlay"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="photo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="photo-modal-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Fermer la photo"
            >
              <FiX />
            </button>

            <img
              src={selectedPhoto.image}
              alt="Partage communauté"
              className="photo-modal-image"
            />

            <div className="photo-modal-info">
              <span className="photo-modal-username">
                <FiInstagram />{' '}
                {selectedPhoto.username || 'Client Florésia'}
              </span>

              {selectedPhoto.caption && (
                <p className="photo-modal-caption">
                  {selectedPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}