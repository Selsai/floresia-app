// Rôle : Page et interactions de cette fonctionnalité.
// AdminDashboard : gestion de la boutique.
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Trash2 as FiTrash2, MessageCircle as FiMessageCircle, Star as FiStar, Image as FiImage } from 'lucide-react';
import { useAuth } from '../../context/auth/auth-context';
import { useConfirm } from '../../context/confirm/confirm-context';
import { commentsApi, testimonialsApi, galleryApi, resolveUploadUrl } from '../../services/api';
import './AdminDashboard.css';

const TABS = [
  { key: 'comments', label: 'Commentaires', icon: <FiMessageCircle /> },
  { key: 'testimonials', label: 'Avis', icon: <FiStar /> },
  { key: 'gallery', label: 'Photos', icon: <FiImage /> },
];

export default function AdminDashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState('comments');

  const [comments, setComments] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadAll = useCallback(() => {
    Promise.all([
      commentsApi.listAllForAdmin(token),
      testimonialsApi.list(),
      galleryApi.list(),
    ])
      .then(([c, t, g]) => {
        setLoadError('');
        setComments(c);
        setTestimonials(t);
        setGallery(g);
      })
      .catch(() => setLoadError('Les contenus ne peuvent pas être chargés. Réessayez.'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') loadAll();
  }, [isAuthenticated, user?.role, loadAll]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/compte" replace />;
  }

const handleDeleteComment = async (id) => {
  const ok = await confirm({
    title: 'Supprimer ce commentaire',
    message: 'Cette action est définitive.',
  });

  if (!ok) return;

  await commentsApi.remove(id, token);
  loadAll();
};

const handleDeleteTestimonial = async (id) => {
  const ok = await confirm({
    title: 'Supprimer cet avis',
    message: 'Cette action est définitive.',
  });

  if (!ok) return;

  await testimonialsApi.remove(id, token);
  loadAll();
};

const handleDeletePhoto = async (id) => {
  const ok = await confirm({
    title: 'Supprimer cette photo',
    message: 'Cette action est définitive.',
  });

  if (!ok) return;

  await galleryApi.remove(id, token);
  loadAll();
};

  return (
    <div className="admin-dashboard">
      <div className="container">
        <p className="admin-eyebrow">Espace Florésia · Administration</p>
        <h1>Modération du contenu</h1>
        <p className="admin-intro">Retrouvez les contributions de la communauté et gérez-les depuis un seul espace.</p>
        {loadError && <p className="admin-error" role="alert">{loadError}</p>}

        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={activeTab === tab.key}
            >
              {tab.icon} {tab.label} <span className="admin-tab-count">{tab.key === 'comments' ? comments.length : tab.key === 'testimonials' ? testimonials.length : gallery.length}</span>
            </button>
          ))}
        </div>

        {loading && <div className="admin-loading" role="status" aria-label="Chargement des contributions"><span /><span /><span /></div>}

        {!loading && activeTab === 'comments' && (
          <div className="admin-list">
            {comments.length === 0 && <p>Aucun commentaire.</p>}
            {comments.map((c) => (
              <div key={c.id} className="admin-row">
                <div>
                  <strong>{c.author.firstName} {c.author.lastName}</strong>
                  <span className="admin-row-meta"> · sur « {c.article.title} »</span>
                  <p>{c.content}</p>
                  {c.imageUrl && <img src={resolveUploadUrl(c.imageUrl)} alt="" className="admin-thumb" />}
                </div>
                <button onClick={() => handleDeleteComment(c.id)}><FiTrash2 /></button>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'testimonials' && (
          <div className="admin-list">
            {testimonials.length === 0 && <p>Aucun avis.</p>}
            {testimonials.map((t) => (
              <div key={t.id} className="admin-row">
                <div>
                  <strong>{t.authorName}</strong>
                  <span className="admin-row-meta"> · {t.rating}/5 {t.occasion ? `· ${t.occasion}` : ''}</span>
                  <p>{t.content}</p>
                </div>
                <button onClick={() => handleDeleteTestimonial(t.id)}><FiTrash2 /></button>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'gallery' && (
          <div className="admin-list">
            {gallery.length === 0 && <p>Aucune photo.</p>}
            {gallery.map((g) => (
              <div key={g.id} className="admin-row">
                <div className="admin-row-photo">
                  <img src={resolveUploadUrl(g.imageUrl)} alt="" className="admin-thumb" />
                  <span>{g.instagramHandle || 'Client Florésia'}{g.caption ? ` — ${g.caption}` : ''}</span>
                </div>
                <button onClick={() => handleDeletePhoto(g.id)}><FiTrash2 /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
