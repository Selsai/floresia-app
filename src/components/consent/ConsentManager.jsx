import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import "./ConsentManager.css";

export const CONSENT_KEY = "floresia-consent-v1";
function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
  } catch {
    return null;
  }
}
function loadAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!id || document.querySelector(`script[data-floresia-ga="${id}"]`)) return;
  window[`ga-disable-${id}`] = false;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.dataset.floresiaGa = id;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}
function disableAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (id) window[`ga-disable-${id}`] = true;
  if (window.gtag)
    window.gtag("consent", "update", { analytics_storage: "denied" });
}
export default function ConsentManager() {
  const initial = readConsent();
  const [open, setOpen] = useState(!initial);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(Boolean(initial?.analytics));
  useEffect(() => {
    if (readConsent()?.analytics) loadAnalytics();
    const reopen = () => {
      setAnalytics(Boolean(readConsent()?.analytics));
      setCustomize(true);
      setOpen(true);
    };
    window.addEventListener("floresia:open-consent", reopen);
    return () => window.removeEventListener("floresia:open-consent", reopen);
  }, []);
  const save = (allowed) => {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        necessary: true,
        analytics: allowed,
        updatedAt: new Date().toISOString(),
      }),
    );
    if (allowed) loadAnalytics();
    else disableAnalytics();
    setOpen(false);
  };
  if (!open) return null;
  return (
    <div className="consent-backdrop">
      <section
        className="consent-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <div className="consent-heading">
          <ShieldCheck aria-hidden="true" />
          <div>
            <span>Cookies</span>
            <h2 id="consent-title">
              Votre navigation reste simple et transparente
            </h2>
          </div>
        </div>
        <p>
          Florésia utilise des stockages nécessaires à son fonctionnement. Avec
          votre accord, une mesure d’audience nous aide à comprendre les pages
          consultées. Consultez notre{" "}
          <a href="/cookies">politique relative aux cookies</a>.
        </p>
        {customize && (
          <div className="consent-options">
            <label>
              <span>
                <strong>Stockage nécessaire</strong>
                <small>Connexion, panier, préférences et sécurité.</small>
              </span>
              <input
                type="checkbox"
                checked
                disabled
                aria-label="Stockage nécessaire toujours activé"
              />
            </label>
            <label>
              <span>
                <strong>Mesure d’audience</strong>
                <small>
                  Statistiques de consultation, uniquement avec votre accord.
                </small>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
              />
            </label>
          </div>
        )}
        <div className="consent-actions">
          <button type="button" onClick={() => save(false)}>
            Tout refuser
          </button>
          {customize ? (
            <button type="button" onClick={() => save(analytics)}>
              Enregistrer mes choix
            </button>
          ) : (
            <button type="button" onClick={() => setCustomize(true)}>
              Personnaliser
            </button>
          )}
          <button type="button" className="primary" onClick={() => save(true)}>
            Tout accepter
          </button>
        </div>
      </section>
    </div>
  );
}
