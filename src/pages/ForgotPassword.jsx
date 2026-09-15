import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { authApi } from '../services/api';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1>Mot de passe oublié</h1>

        {!sent ? (
          <>
            <p className="fp-subtitle">
              Renseignez l'adresse email de votre compte pour recevoir un lien de réinitialisation sécurisé.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <FiMail />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Envoi…' : 'Recevoir le lien'}
              </button>
            </form>
          </>
        ) : (
          <p className="fp-success">
            Si un compte existe avec cet email, un lien de réinitialisation vient de vous être envoyé.
            Pensez à vérifier vos spams.
          </p>
        )}

        <p className="fp-switch">
          Vous avez retrouvé votre mot de passe ?{' '}
          <Link to="/compte">Se connecter</Link>
        </p>
      </div>

      <footer className="fp-footer">
        <span>© 2025 Florésia — Tous droits réservés</span>
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  );
}