// Rôle : Fonctions utilitaires communes.
// price : outils communs.
const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatPrice(amount) {
  return euroFormatter.format(Number(amount));
}
