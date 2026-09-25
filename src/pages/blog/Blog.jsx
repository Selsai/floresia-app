// Rôle : Page et interactions de cette fonctionnalité.
// Blog : liste des articles floraux.
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as FiSearch, CalendarDays as FiCalendar, Clock3 as FiClock, ArrowRight as FiArrowRight, Tag as FiTag } from 'lucide-react';
import { articlesApi } from '../../services/api';
import { ArticleGridSkeleton } from '../../components/loading/LoadingSkeleton';
import journalHero from '../../assets/blog/img-journal-blog.png';
import './Blog.css';

function formatArticleDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    articlesApi
      .list()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Tous', 'Conseils', 'Tutos', 'Déco', 'Actualités'];

  const filteredArticles = articles.filter((article) => {
    const matchSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const popularArticles = articles.slice(0, 4);

  const getCategoryCount = (category) => articles.filter((a) => a.category === category).length;

  return (
    <div className="blog">
      <section className="blog-header">
        <div className="container">
          <div className="blog-header-copy">
            <div className="breadcrumb">
              <Link to="/">Accueil</Link> / <span>Blog</span>
            </div>
            <h1 className="blog-title">Le journal floral</h1>
            <p className="blog-subtitle">
              Des conseils, des idées et des histoires pour faire entrer les fleurs dans votre quotidien.
            </p>
          </div>
          <div className="blog-header-visual"><img src={journalHero} alt="Ambiance fleurie du journal Florésia" /></div>
        </div>
      </section>

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
            {categories.map((cat) => (
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

      <div className="blog-layout">
        <div className="container">
          {loading && <ArticleGridSkeleton count={3} />}
          {error && <p className="auth-error">{error}</p>}

          {!loading && !error && (
            <div className="blog-grid-layout">
              <div className="blog-main">
                {selectedCategory === 'Tous' && filteredArticles.length > 0 && (
                  <article className="featured-article">
                    <div className="featured-image">
                      <img src={filteredArticles[0].imageUrl} alt={filteredArticles[0].title} />
                      <span className="featured-badge">À la une</span>
                    </div>
                    <div className="featured-content">
                      <div className="article-meta">
                        <span className="category-tag">{filteredArticles[0].category}</span>
                        <span className="date">
                          <FiCalendar size={14} /> {formatArticleDate(filteredArticles[0].createdAt)}
                        </span>
                        <span className="read-time">
                          <FiClock size={14} /> {filteredArticles[0].readTime}
                        </span>
                      </div>
                      <h2 className="featured-title">{filteredArticles[0].title}</h2>
                      <p className="featured-excerpt">{filteredArticles[0].excerpt}</p>
                      <div className="featured-footer">
                        <span className="author">Par {filteredArticles[0].displayAuthorName}</span>
                        <Link to={`/blog/${filteredArticles[0].id}`} className="read-more-btn">
                          Lire l'article <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                <div className="articles-grid">
                  {filteredArticles.slice(selectedCategory === 'Tous' ? 1 : 0).map((article) => (
                    <article key={article.id} className="article-card">
                      <Link to={`/blog/${article.id}`} className="article-image">
                        <img src={article.imageUrl} alt={article.title} />
                        <span className="category-tag">{article.category}</span>
                      </Link>
                      <div className="article-content">
                        <div className="article-meta-small">
                          <span><FiCalendar size={12} /> {formatArticleDate(article.createdAt)}</span>
                          <span><FiClock size={12} /> {article.readTime}</span>
                        </div>
                        <Link to={`/blog/${article.id}`}>
                          <h3 className="article-title">{article.title}</h3>
                        </Link>
                        <p className="article-excerpt">{article.excerpt}</p>
                        <div className="article-footer">
                          <span className="author-small">Par {article.displayAuthorName}</span>
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
                    <p>Aucun article ne correspond à votre recherche</p>
                    <button onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }} className="reset-search">
                      Réinitialiser la recherche
                    </button>
                  </div>
                )}
              </div>

              <aside className="blog-sidebar">
                <div className="sidebar-widget">
                  <h3 className="widget-title">Articles populaires</h3>
                  <div className="popular-articles">
                    {popularArticles.map((article) => (
                      <Link to={`/blog/${article.id}`} key={article.id} className="popular-article">
                        <img src={article.imageUrl} alt={article.title} />
                        <div className="popular-content">
                          <span className="popular-category">{article.category}</span>
                          <h4>{article.title}</h4>
                          <span className="popular-date">{formatArticleDate(article.createdAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="sidebar-widget">
                  <h3 className="widget-title">Catégories</h3>
                  <div className="categories-list">
                    {['Conseils', 'Tutos', 'Déco', 'Actualités'].map((cat) => (
                      <button key={cat} className="category-item" onClick={() => setSelectedCategory(cat)}>
                        <FiTag />
                        <span>{cat}</span>
                        <span className="count">{getCategoryCount(cat)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
