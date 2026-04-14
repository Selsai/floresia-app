import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiClock, FiArrowRight, FiTag } from 'react-icons/fi';
import blogPrintemps from '../assets/blog/blog-printemps.png';
import blogEntretien from '../assets/blog/blog-entretien.png';
import blogCouleurs from '../assets/blog/blog-couleurs.png';
import blogTendances from '../assets/blog/blog-tendances.png';
import blogDiy from '../assets/blog/blog-diy.png';
import blogValentine from '../assets/blog/blog-valentine.png';
import blogComposition from '../assets/blog/blog-composition.png';
import blogComestibles from '../assets/blog/blog-comestibles.png';
import blogMariage from '../assets/blog/blog-mariage.png';
import './Blog.css';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Articles du blog avec vraies images
  const articles = [
    {
      id: 1,
      title: '10 fleurs de printemps pour égayer votre intérieur',
      category: 'Conseils',
      excerpt: 'Découvrez notre sélection de fleurs printanières qui apporteront fraîcheur et couleur à votre maison dès les premiers beaux jours.',
      image: blogPrintemps,
      date: '15 février 2026',
      readTime: '5 min',
      author: 'Marie Dubois',
      featured: true
    },
    {
      id: 2,
      title: 'Comment conserver un bouquet plus longtemps ?',
      category: 'Tutos',
      excerpt: 'Nos astuces d\'expert pour prolonger la vie de vos bouquets jusqu\'à 2 semaines. Eau, température, entretien... on vous dit tout !',
      image: blogEntretien,
      date: '10 février 2026',
      readTime: '4 min',
      author: 'Sophie Laurent',
      featured: true
    },
    {
      id: 3,
      title: 'Signification des couleurs de roses',
      category: 'Déco',
      excerpt: 'Rouge pour la passion, blanc pour la pureté... Découvrez le langage secret des roses et choisissez la couleur parfaite pour votre message.',
      image: blogCouleurs,
      date: '5 février 2026',
      readTime: '3 min',
      author: 'Emma Martin',
      featured: false
    },
    {
      id: 4,
      title: 'Les tendances florales 2026',
      category: 'Actualités',
      excerpt: 'Fleurs séchées, compositions XXL, couleurs terracotta... Zoom sur les tendances qui vont marquer l\'année 2026 dans le monde floral.',
      image: blogTendances,
      date: '1er février 2026',
      readTime: '6 min',
      author: 'Marie Dubois',
      featured: false
    },
    {
      id: 5,
      title: 'DIY : Créer une couronne de fleurs séchées',
      category: 'Tutos',
      excerpt: 'Un tutoriel pas à pas pour réaliser votre propre couronne de fleurs séchées. Parfait pour décorer votre intérieur avec style.',
      image: blogDiy,
      date: '28 janvier 2026',
      readTime: '8 min',
      author: 'Sophie Laurent',
      featured: false
    },
    {
      id: 6,
      title: 'Quelles fleurs offrir pour la Saint-Valentin ?',
      category: 'Conseils',
      excerpt: 'Au-delà des roses rouges classiques, découvrez des alternatives romantiques et originales pour déclarer votre flamme avec des fleurs.',
      image: blogValentine,
      date: '25 janvier 2026',
      readTime: '4 min',
      author: 'Emma Martin',
      featured: false
    },
    {
      id: 7,
      title: 'L\'art de composer un bouquet harmonieux',
      category: 'Tutos',
      excerpt: 'Les règles d\'or pour créer des compositions florales équilibrées : formes, couleurs, textures... devenez un pro de l\'art floral !',
      image: blogComposition,
      date: '20 janvier 2026',
      readTime: '7 min',
      author: 'Marie Dubois',
      featured: false
    },
    {
      id: 8,
      title: 'Fleurs comestibles : lesquelles choisir ?',
      category: 'Conseils',
      excerpt: 'Capucines, pensées, violettes... Découvrez quelles fleurs peuvent sublimer vos plats et pâtisseries en toute sécurité.',
      image: blogComestibles,
      date: '15 janvier 2026',
      readTime: '5 min',
      author: 'Sophie Laurent',
      featured: false
    },
    {
      id: 9,
      title: 'Décorer sa table de mariage avec des fleurs',
      category: 'Déco',
      excerpt: 'Centres de table, arches florales, bouquets suspendus... Toutes nos idées pour une décoration de mariage florale inoubliable.',
      image: blogMariage,
      date: '10 janvier 2026',
      readTime: '6 min',
      author: 'Emma Martin',
      featured: false
    }
  ];

  const categories = ['Tous', 'Conseils', 'Tutos', 'Déco', 'Actualités'];

  // Filtrage
  const filteredArticles = articles.filter(article => {
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Articles populaires (sidebar)
  const popularArticles = articles.slice(0, 4);

  // Compter les articles par catégorie
  const getCategoryCount = (category) => {
    return articles.filter(article => article.category === category).length;
  };

  return (
    <div className="blog">
      
      {/* HEADER */}
      <section className="blog-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link> / <span>Blog</span>
          </div>
          <h1 className="blog-title">Le Blog Floresia</h1>
          <p className="blog-subtitle">
            Conseils, astuces et inspirations pour sublimer votre quotidien avec des fleurs
          </p>
        </div>
      </section>

      {/* SEARCH & FILTERS */}
      <section className="blog-filters-section">
        <div className="container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LAYOUT PRINCIPAL */}
      <div className="blog-layout">
        <div className="container">
          <div className="blog-grid-layout">
            
            {/* ARTICLES PRINCIPAUX */}
            <div className="blog-main">
              
              {/* Article vedette */}
              {selectedCategory === 'Tous' && filteredArticles.length > 0 && (
                <article className="featured-article">
                  <div className="featured-image">
                    <img src={filteredArticles[0].image} alt={filteredArticles[0].title} />
                    <span className="featured-badge">À la une</span>
                  </div>
                  <div className="featured-content">
                    <div className="article-meta">
                      <span className="category-tag">{filteredArticles[0].category}</span>
                      <span className="date">
                        <FiCalendar size={14} /> {filteredArticles[0].date}
                      </span>
                      <span className="read-time">
                        <FiClock size={14} /> {filteredArticles[0].readTime}
                      </span>
                    </div>
                    <h2 className="featured-title">{filteredArticles[0].title}</h2>
                    <p className="featured-excerpt">{filteredArticles[0].excerpt}</p>
                    <div className="featured-footer">
                      <span className="author">Par {filteredArticles[0].author}</span>
                      <Link to={`/blog/${filteredArticles[0].id}`} className="read-more-btn">
                        Lire l'article <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* Grille d'articles */}
              <div className="articles-grid">
                {filteredArticles.slice(selectedCategory === 'Tous' ? 1 : 0).map(article => (
                  <article key={article.id} className="article-card">
                    <Link to={`/blog/${article.id}`} className="article-image">
                      <img src={article.image} alt={article.title} />
                      <span className="category-tag">{article.category}</span>
                    </Link>
                    <div className="article-content">
                      <div className="article-meta-small">
                        <span><FiCalendar size={12} /> {article.date}</span>
                        <span><FiClock size={12} /> {article.readTime}</span>
                      </div>
                      <Link to={`/blog/${article.id}`}>
                        <h3 className="article-title">{article.title}</h3>
                      </Link>
                      <p className="article-excerpt">{article.excerpt}</p>
                      <div className="article-footer">
                        <span className="author-small">Par {article.author}</span>
                        <Link to={`/blog/${article.id}`} className="read-link">
                          Lire <FiArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="no-articles">
                  <p>😔 Aucun article ne correspond à votre recherche</p>
                  <button onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }} className="reset-search">
                    Réinitialiser la recherche
                  </button>
                </div>
              )}

            </div>

            {/* SIDEBAR */}
            <aside className="blog-sidebar">
              
              {/* Articles populaires */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Articles populaires</h3>
                <div className="popular-articles">
                  {popularArticles.map(article => (
                    <Link to={`/blog/${article.id}`} key={article.id} className="popular-article">
                      <img src={article.image} alt={article.title} />
                      <div className="popular-content">
                        <span className="popular-category">{article.category}</span>
                        <h4>{article.title}</h4>
                        <span className="popular-date">{article.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Catégories */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Catégories</h3>
                <div className="categories-list">
                  <button 
                    className="category-item"
                    onClick={() => setSelectedCategory('Conseils')}
                  >
                    <FiTag />
                    <span>Conseils</span>
                    <span className="count">{getCategoryCount('Conseils')}</span>
                  </button>
                  <button 
                    className="category-item"
                    onClick={() => setSelectedCategory('Tutos')}
                  >
                    <FiTag />
                    <span>Tutos</span>
                    <span className="count">{getCategoryCount('Tutos')}</span>
                  </button>
                  <button 
                    className="category-item"
                    onClick={() => setSelectedCategory('Déco')}
                  >
                    <FiTag />
                    <span>Déco</span>
                    <span className="count">{getCategoryCount('Déco')}</span>
                  </button>
                  <button 
                    className="category-item"
                    onClick={() => setSelectedCategory('Actualités')}
                  >
                    <FiTag />
                    <span>Actualités</span>
                    <span className="count">{getCategoryCount('Actualités')}</span>
                  </button>
                </div>
              </div>

              {/* Newsletter */}
              <div className="sidebar-widget newsletter-widget">
                <h3 className="widget-title">Newsletter 💌</h3>
                <p>Recevez nos derniers articles et conseils floraux directement dans votre boîte mail</p>
                <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Merci pour votre inscription ! 🌸'); }}>
                  <input type="email" placeholder="Votre email" required />
                  <button type="submit">S'inscrire</button>
                </form>
                <p className="newsletter-disclaimer">🔒 Vos données sont protégées</p>
              </div>

            </aside>

          </div>
        </div>
      </div>

    </div>
  );
}