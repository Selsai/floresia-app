// BlogArticle : lecture des articles et commentaires.
import { useState, useEffect, useCallback } from 'react';

import { useParams, Link } from 'react-router-dom';

import { CalendarDays as FiCalendar, Clock3 as FiClock, User as FiUser, ArrowLeft as FiArrowLeft, ArrowRight as FiArrowRight, MessageCircle as FiMessageCircle, Image as FiImage, X as FiX, Trash2 as FiTrash2, CornerDownRight as FiCornerDownRight, Send as FiSend } from 'lucide-react';

import {
  articlesApi,
  commentsApi,
  resolveUploadUrl,
} from '../../services/api';

import { useAuth } from '../../context/auth/auth-context';
import { useConfirm } from '../../context/confirm/confirm-context';

import { DetailSkeleton } from '../../components/loading/LoadingSkeleton';
import './BlogArticle.css';
import { updateDetailMeta } from '../../components/meta/detail-meta';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function displayName(author) {
  return `${author.firstName} ${author.lastName.charAt(0)}.`;
}

function initials(author) {
  return `${author.firstName.charAt(0)}${author.lastName.charAt(0)}`;
}

// Colore les mentions "@Prénom" dans le texte affiché
function renderWithMentions(content) {
  const parts = content.split(/(@[A-Za-zÀ-ÿ]+)/g);

  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="mention">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function CommentForm({
  articleId,
  parentId,
  taggedUser,
  onPosted,
  onCancel,
  commenters,
  token,
}) {
  const [content, setContent] = useState(
    taggedUser ? `@${taggedUser.firstName} ` : ''
  );

  const [taggedUserId, setTaggedUserId] = useState(
    taggedUser?.id || null
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContentChange = (e) => {
    const value = e.target.value;

    setContent(value);

    const match = value.match(/@([A-Za-zÀ-ÿ]*)$/);

    if (match) {
      setTagQuery(match[1].toLowerCase());
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectTag = (user) => {
    const newContent = content.replace(
      /@([A-Za-zÀ-ÿ]*)$/,
      `@${user.firstName} `
    );

    setContent(newContent);
    setTaggedUserId(user.id);
    setShowDropdown(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredCommenters = commenters.filter((c) =>
    c.firstName.toLowerCase().startsWith(tagQuery)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('content', content.trim());
      formData.append('articleId', articleId);

      if (parentId) {
        formData.append('parentId', parentId);
      }

      if (taggedUserId) {
        formData.append('taggedUserId', taggedUserId);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await commentsApi.create(formData, token);

      setContent('');
      removeImage();

      onPosted();

      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-textarea-wrap">
        <textarea
          placeholder="Écrivez votre commentaire... (utilisez @ pour mentionner quelqu'un)"
          rows="3"
          value={content}
          onChange={handleContentChange}
          required
        />

        {showDropdown && filteredCommenters.length > 0 && (
          <ul className="mention-dropdown">
            {filteredCommenters.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSelectTag(user)}
              >
                {user.firstName} {user.lastName.charAt(0)}.
              </li>
            ))}
          </ul>
        )}
      </div>

      {imagePreview && (
        <div className="comment-image-preview">
          <img src={imagePreview} alt="Aperçu" />

          <button type="button" onClick={removeImage} aria-label="Retirer l’image jointe">
            <FiX />
          </button>
        </div>
      )}

      {error && <p className="field-error">{error}</p>}

      <div className="comment-form-actions">
        <label className="attach-image-btn">
          <span className="attach-image-btn__icon"><FiImage aria-hidden="true" /></span>
          <span>Ajouter une image <small>JPG, PNG ou WebP</small></span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            aria-label="Choisir une image pour le commentaire"
          />
        </label>

        <div className="comment-form-buttons">
          {onCancel && (
            <button
              type="button"
              className="btn-cancel-reply"
              onClick={onCancel}
            >
              Annuler
            </button>
          )}

          <button type="submit" disabled={submitting}>
            <FiSend /> {submitting ? 'Envoi…' : 'Publier'}
          </button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  articleId,
  currentUser,
  canComment,
  commenters,
  token,
  onChanged,
  isReply,
}) {
  const [replying, setReplying] = useState(false);

  // Utilise la confirmation personnalisée de l'application
  const { confirm } = useConfirm();

  const canDelete =
    currentUser &&
    (currentUser.role === 'ADMIN' ||
      currentUser.id === comment.author.id);

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Supprimer ce commentaire',
      message:
        'Cette action est définitive et ne peut pas être annulée.',
    });

    if (!ok) return;

    try {
      await commentsApi.remove(comment.id, token);
      onChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className={`comment ${
        isReply ? 'comment-reply' : ''
      }`}
    >
      <div className="comment-avatar">
        {initials(comment.author)}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <strong>{displayName(comment.author)}</strong>

          <span className="comment-date">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p>{renderWithMentions(comment.content)}</p>

        {comment.imageUrl && (
          <img
            className="comment-image"
            src={resolveUploadUrl(comment.imageUrl)}
            alt="Photo jointe"
          />
        )}

        <div className="comment-actions">
          {canComment && !isReply && (
            <button
              className="comment-action-btn"
              onClick={() => setReplying(!replying)}
            >
              <FiCornerDownRight /> Répondre
            </button>
          )}

          {canDelete && (
            <button
              className="comment-action-btn danger"
              onClick={handleDelete}
            >
              <FiTrash2 /> Supprimer
            </button>
          )}
        </div>

        {replying && (
          <CommentForm
            articleId={articleId}
            parentId={comment.id}
            taggedUser={comment.author}
            commenters={commenters}
            token={token}
            onPosted={onChanged}
            onCancel={() => setReplying(false)}
          />
        )}

        {comment.replies?.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                articleId={articleId}
                currentUser={currentUser}
                canComment={canComment}
                commenters={commenters}
                token={token}
                onChanged={onChanged}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogArticle() {
  const { id } = useParams();

  const { user, token, isAuthenticated } = useAuth();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [commenters, setCommenters] = useState([]);

  useEffect(() => {
    articlesApi
      .list()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const loadComments = useCallback(() => {

    commentsApi
      .listByArticle(id)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [id]);

  useEffect(() => {
    loadComments();

    commentsApi
      .listCommenters(id)
      .then(setCommenters)
      .catch(() => {});
  }, [id, loadComments]);

  useEffect(() => {
    if (loading) return;
    const currentArticle = articles.find((item) => item.id === id);
    updateDetailMeta({
      path: `/blog/${encodeURIComponent(id)}`,
      title: currentArticle ? `${currentArticle.title} | Florésia` : 'Article introuvable | Florésia',
      description: currentArticle ? (currentArticle.excerpt || `Lisez ${currentArticle.title} sur le blog Florésia.`).slice(0, 160) : 'Cet article est introuvable.',
      image: currentArticle?.imageUrl,
      indexable: Boolean(currentArticle),
      type: 'article',
    });
  }, [articles, id, loading]);

  if (loading) {
    return (
      <DetailSkeleton label="Chargement de l'article" />
    );
  }

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="article-not-found">
        <div className="container">
          <h1>Article introuvable</h1>

          <Link to="/blog" className="back-to-blog">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles
    .filter(
      (a) =>
        a.id !== article.id &&
        a.category === article.category
    )
    .slice(0, 3);

  const currentIndex = articles.findIndex(
    (a) => a.id === article.id
  );

  const prevArticle =
    currentIndex > 0
      ? articles[currentIndex - 1]
      : null;

  const nextArticle =
    currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  const totalComments = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  );

  // Autorise les commentaires uniquement si l'utilisateur
  // est connecté ET que son adresse email est vérifiée.
  const canComment =
    isAuthenticated && user?.isEmailVerified;

  return (
    <div className="blog-article">
      <div
        className="article-hero"
        style={{
          backgroundImage: `url(${article.imageUrl})`,
        }}
      >
        <div className="hero-overlay">
          <div className="container">
            <Link to="/blog" className="back-link">
              <FiArrowLeft /> Retour au blog
            </Link>

            <span className="article-category-badge">
              {article.category}
            </span>

            <h1 className="article-hero-title">
              {article.title}
            </h1>

            <div className="article-hero-meta">
              <span>
                <FiUser size={16} />{' '}
                {article.displayAuthorName}
              </span>

              <span>
                <FiCalendar size={16} />{' '}
                {formatDate(article.createdAt)}
              </span>

              <span>
                <FiClock size={16} />{' '}
                {article.readTime} de lecture
              </span>
            </div>
          </div>
        </div>
      </div>

      <article className="article-content-wrapper">
        <div className="container">
          <div className="article-layout">
            <div className="article-main">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: article.content,
                }}
              />

              <div className="author-bio">
                <div className="author-avatar">
                  {article.displayAuthorName.charAt(0)}
                </div>

                <div className="author-info">
                <h2>
                  À propos de {article.displayAuthorName}
                </h2>

                  <p>{article.displayAuthorBio}</p>
                </div>
              </div>

              <div className="article-comments">
                <h2>
                  <FiMessageCircle /> {totalComments}{' '}
                  commentaire
                  {totalComments !== 1 ? 's' : ''}
                </h2>

                {commentsLoading && (
                  <p>Chargement des commentaires…</p>
                )}

                <div className="comments-list">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      articleId={article.id}
                      currentUser={
                        isAuthenticated
                          ? {
                              id: user.id,
                              role: user.role,
                            }
                          : null
                      }
                      canComment={canComment}
                      commenters={commenters}
                      token={token}
                      onChanged={loadComments}
                    />
                  ))}
                </div>

                {canComment ? (
                  <CommentForm
                    articleId={article.id}
                    commenters={commenters}
                    token={token}
                    onPosted={loadComments}
                  />
                ) : isAuthenticated ? (
                  <div className="verify-email-banner comment-verify-banner">
                    <span>
                      Votre adresse email n'est pas encore vérifiée.
                    </span>

                    <Link
                      to="/verification-email"
                      state={{ email: user.email }}
                    >
                      Vérifier mon email →
                    </Link>
                  </div>
                ) : (
                  <div className="login-to-comment">
                    <span>Connectez-vous pour laisser un commentaire.</span>
                    <Link to="/compte">Se connecter →</Link>
                  </div>
                )}
              </div>
            </div>

            <aside className="article-sidebar">
              <div className="sidebar-widget sticky-widget">
                <h2>Sur le même thème</h2>

                <div className="related-mini">
                  {relatedArticles.map((related) => (
                    <Link
                      to={`/blog/${related.id}`}
                      key={related.id}
                      className="related-mini-item"
                    >
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                      />

                      <div>
                        <span className="mini-category">
                          {related.category}
                        </span>

                        <h3>{related.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <div className="article-navigation">
        <div className="container">
          <div className="nav-grid">
            {prevArticle ? (
              <Link
                to={`/blog/${prevArticle.id}`}
                className="nav-item prev"
              >
                <FiArrowLeft />

                <div>
                  <span>Article précédent</span>
                  <h3>{prevArticle.title}</h3>
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            {nextArticle && (
              <Link
                to={`/blog/${nextArticle.id}`}
                className="nav-item next"
              >
                <div>
                  <span>Article suivant</span>
                  <h3>{nextArticle.title}</h3>
                </div>

                <FiArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <section className="related-articles">
          <div className="container">
            <h2>Articles similaires</h2>

            <div className="related-grid">
              {relatedArticles.map((related) => (
                <Link
                  to={`/blog/${related.id}`}
                  key={related.id}
                  className="related-card"
                >
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                  />

                  <div className="related-content">
                    <span className="related-category">
                      {related.category}
                    </span>

                    <h3>{related.title}</h3>

                    <p>{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
