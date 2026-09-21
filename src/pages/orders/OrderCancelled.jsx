// OrderCancelled : annulation de paiement.
import { Link } from 'react-router-dom';
import { ShoppingBag as FiShoppingBag } from 'lucide-react';

export default function OrderCancelled() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <FiShoppingBag size={48} aria-hidden="true" />
      <h1>Paiement interrompu</h1>
      <p>Votre panier est conservé. Vous pouvez reprendre votre commande lorsque vous le souhaitez.</p>
      <Link to="/panier" className="btn-continue-shopping">Revenir au panier</Link>
    </div>
  );
}