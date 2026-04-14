import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart, FiCamera, FiUsers, FiTrendingUp, FiAward, FiInstagram } from 'react-icons/fi';
import communauteHero from '../assets/community/communaute-hero.png';
import temoignage1 from '../assets/community/temoignage-1.png';
import temoignage2 from '../assets/community/temoignage-2.png';
import temoignage3 from '../assets/community/temoignage-3.png';
import galerie1 from '../assets/community/galerie-1.png';
import galerie2 from '../assets/community/galerie-2.png';
import galerie3 from '../assets/community/galerie-3.png';
import galerie4 from '../assets/vgalerie-4.png';
import galerie5 from '../assets/community/galerie-5.png';
import galerie6 from '../assets/community/galerie-6.png';
import './Community.css';

export default function Community() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    photo: null
  });

  const testimonials = [
    {
      id: 1,
      name: 'Sophie Martin',
      location: 'Paris',
      date: '12 février 2026',
      rating: 5,
      image: temoignage1,
      comment: 'J\'ai commandé un bouquet pour l\'anniversaire de ma mère et elle était aux anges ! Les fleurs étaient magnifiques, fraîches et ont duré plus de 10 jours. Le service client est adorable et la livraison ultra rapide. Je recommande à 100% !',
      occasion: 'Anniversaire'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      location: 'Lyon',
      date: '8 février 2026',
      rating: 5,
      image: temoignage2,
      comment: 'Floresia fait partie de ma vie depuis 2 ans maintenant. À chaque commande, c\'est la même qualité exceptionnelle. Les compositions sont toujours élégantes et les fleurs d\'une fraîcheur incomparable. Mon fleuriste de confiance !',
      occasion: 'Abonnement mensuel'
    },
    {
      id: 3,
      name: 'Thomas Leroux',
      location: 'Marseille',
      date: '3 février 2026',
      rating: 5,
      image: temoignage3,
      comment: 'Premier achat pour la Saint-Valentin et je suis bluffé ! Ma compagne a adoré le bouquet personnalisé. Les conseils par chat étaient précieux pour choisir les bonnes fleurs. Bravo pour ce service au top !',
      occasion: 'Saint-Valentin'
    }
  ];

  const galleryPhotos = [
    { id: 1, image: galerie1, likes: 234, username: '@marie_fleurs' },
    { id: 2, image: galerie2, likes: 189, username: '@julie_garden' },
    { id: 3, image: galerie3, likes: 312, username: '@wedding_sophie' },
    { id: 4, image: galerie4, likes: 156, username: '@nature_emma' },
    { id: 5, image: galerie5, likes: 278, username: '@boho_home' },
    { id: 6, image: galerie6, likes: 201, username: '@parisian_style' }
  ];

  const stats = [
    { icon: <FiUsers />, value: '15 000+', label: 'Clients satisfaits' },
    { icon: <FiHeart />, value: '98%', label: 'Taux de satisfaction' },
    { icon: <FiTrendingUp />, value: '50 000+', label: 'Bouquets livrés' },
    { icon: <FiAward />, value: '4.9/5', label: 'Note moyenne' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre partage ! 📸 Nous allons vérifier votre photo.');
    setFormData({ name: '', email: '', message: '', photo: null });
  };

  return (
    <div className="community">
      
      {/* HERO */}
      <section className="community-hero" style={{ backgroundImage: `url(${communauteHero})` }}>
        <div className="hero-overlay">
          <div className="container">
            <h1 className="community-hero-title">Notre Communauté Floresia</h1>
            <p className="community-hero-subtitle">
              Rejoignez plus de 15 000 passionnés de fleurs qui partagent leur amour de la nature
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
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

      {/* TÉMOIGNAGES */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Ils parlent de nous</h2>
            <p>Découvrez les avis authentiques de notre communauté</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h3>{testimonial.name}</h3>
                    <p className="testimonial-location">{testimonial.location}</p>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < testimonial.rating ? 'filled' : ''} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="testimonial-occasion">
                  <span>{testimonial.occasion}</span>
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-date">{testimonial.date}</div>
              </div>
            ))}
          </div>

          <div className="testimonials-cta">
            <p>Vous aussi, partagez votre expérience !</p>
            <button className="btn-primary" onClick={() => document.getElementById('share-form').scrollIntoView({ behavior: 'smooth' })}>
              Laisser un avis
            </button>
          </div>
        </div>
      </section>

      {/* GALERIE INSTAGRAM */}
      <section className="instagram-gallery">
        <div className="container">
          <div className="section-header">
            <FiInstagram className="section-icon" />
            <h2>#FloresiaFamily</h2>
            <p>Partagez vos plus beaux moments fleuris avec nous sur Instagram</p>
          </div>

          <div className="gallery-grid">
            {galleryPhotos.map(photo => (
              <div key={photo.id} className="gallery-item">
                <img src={photo.image} alt={`Photo ${photo.id}`} />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <span className="gallery-username">{photo.username}</span>
                    <span className="gallery-likes">
                      <FiHeart /> {photo.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-cta">
            <p>Taguez-nous sur vos photos avec <strong>#FloresiaFamily</strong></p>
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

      {/* FORMULAIRE PARTAGE PHOTO */}
      <section className="share-photo-section" id="share-form">
        <div className="container">
          <div className="share-layout">
            
            <div className="share-content">
              <FiCamera className="share-icon" />
              <h2>Partagez votre photo</h2>
              <p>Votre bouquet Floresia mérite d'être mis en lumière ! Partagez votre photo avec notre communauté et elle pourrait être affichée sur notre site et nos réseaux sociaux.</p>
              
              <div className="share-benefits">
                <div className="benefit">
                  <FiHeart />
                  <span>Soyez inspiré par la communauté</span>
                </div>
                <div className="benefit">
                  <FiAward />
                  <span>Chance de gagner un bon d'achat</span>
                </div>
                <div className="benefit">
                  <FiInstagram />
                  <span>Apparaissez sur notre Instagram</span>
                </div>
              </div>
            </div>

            <div className="share-form">
              <form onSubmit={handleSubmit}>
                <h3>Envoyez votre photo</h3>
                
                <div className="form-group">
                  <label>Votre nom *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Votre email *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Racontez-nous votre histoire</label>
                  <textarea 
                    rows="4" 
                    placeholder="Quelle occasion ? Comment avez-vous mis en scène votre bouquet ?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="file-upload">
                    <FiCamera />
                    <span>Choisir une photo</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                    />
                  </label>
                  {formData.photo && (
                    <p className="file-name">📸 {formData.photo.name}</p>
                  )}
                </div>

                <button type="submit" className="btn-submit">
                  Envoyer ma photo
                </button>

                <p className="form-disclaimer">
                  En envoyant votre photo, vous acceptez qu'elle soit publiée sur notre site et nos réseaux sociaux.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* NEWSLETTER COMMUNAUTÉ */}
      <section className="community-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Restez connectés</h2>
            <p>Rejoignez notre newsletter exclusive et recevez en avant-première nos nouveautés, conseils floraux et offres spéciales réservées à notre communauté.</p>
            
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Merci ! Bienvenue dans la famille Floresia 💐'); }}>
              <input type="email" placeholder="Votre adresse email" required />
              <button type="submit">S'inscrire</button>
            </form>

            <p className="newsletter-disclaimer">
              🔒 Vos données sont sécurisées. Désinscription possible à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="community-cta">
        <div className="container">
          <h2>Prêt à rejoindre la famille Floresia ?</h2>
          <p>Découvrez nos créations et commandez votre premier bouquet dès maintenant</p>
          <Link to="/boutique" className="btn-cta">
            Découvrir la boutique
          </Link>
        </div>
      </section>

    </div>
  );
}