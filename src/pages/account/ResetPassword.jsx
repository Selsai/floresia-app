// ResetPassword : definition du nouveau mot de passe.
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock as FiLock, Eye as FiEye, EyeOff as FiEyeOff } from 'lucide-react';
import { authApi } from '../../services/api';
import './ForgotPassword.css';

const PASSWORD_RULES = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <h1>Nouveau mot de passe</h1>

        {success ? (
          <p className="fp-success">Mot de passe réinitialisé avec succès ! Redirection…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className="input-with-icon">
                <FiLock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
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