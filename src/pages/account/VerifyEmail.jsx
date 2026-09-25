// Rôle : Page et interactions de cette fonctionnalité.
// VerifyEmail : verification du courriel.
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import RecoveryHeader from './RecoveryHeader';
import './ForgotPassword.css';

const CODE_DURATION = 10 * 60; // 10 minutes en secondes

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CODE_DURATION);

  useEffect(() => {
    if (!email) {
      navigate('/compte');
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.verifyEmail({ email, code });
      setSuccess('Email vérifié avec succès !');
      setTimeout(() => navigate('/compte'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);

    try {
      await authApi.sendVerificationCode(email);
      setSecondsLeft(CODE_DURATION);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <RecoveryHeader eyebrow="Validation du compte" title="Vérifiez votre email">
          <p className="fp-subtitle">Pour finaliser votre compte, saisissez le code à 6 chiffres envoyé à <strong>{email}</strong>.</p>
        </RecoveryHeader>

        {secondsLeft > 0 ? (
          <p className="fp-timer">
            Code valable 10 minutes — Temps restant : <strong>{formatTime(secondsLeft)}</strong>
          </p>
        ) : (
          <p className="fp-timer expired">Le code a expiré, demandez-en un nouveau.</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="verification-code">Code de vérification</label>
            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="fp-success">{success}</p>}

          <button type="submit" className="btn-submit" disabled={loading || secondsLeft <= 0}>
            {loading ? 'Vérification…' : 'Valider le code'}
          </button>
        </form>

        <button type="button" className="btn-link" onClick={handleResend} disabled={resending}>
          {resending ? 'Envoi…' : 'Renvoyer un code'}
        </button>

        <p className="fp-switch">
          <Link to="/compte">← Revenir à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
