// ResetPassword : definition du nouveau mot de passe.
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock as FiLock, Eye as FiEye, EyeOff as FiEyeOff } from 'lucide-react';
import { authApi } from '../../services/api';
import RecoveryHeader from './RecoveryHeader';
import './ForgotPassword.css';

const PASSWORD_RULES = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Lien invalide.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (!PASSWORD_RULES.test(newPassword)) {
      setError('Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/compte'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <RecoveryHeader eyebrow="Sécurité du compte" title="Nouveau mot de passe">
          {!success && <p className="fp-subtitle">Choisissez un mot de passe sécurisé pour retrouver l’accès à votre compte.</p>}
        </RecoveryHeader>

        {success ? (
          <p className="fp-success">Mot de passe réinitialisé avec succès ! Redirection…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le nouveau mot de passe' : 'Afficher le nouveau mot de passe'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirmer le mot de passe</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  id="confirm-new-password"
                  type={showConfirmation ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmation(!showConfirmation)}
                  aria-label={showConfirmation ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
                >
                  {showConfirmation ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Modification…' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}

        <p className="fp-switch">
          <Link to="/compte">← Revenir à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
