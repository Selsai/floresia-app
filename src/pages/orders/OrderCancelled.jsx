// OrderCancelled : annulation de paiement.
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag as FiShoppingBag } from 'lucide-react';
import './OrderSuccess.css';

export default function OrderCancelled() {
  return (
    <div className="order-success-page">
      <section className="order-success-card">
        <div className="order-success-icon" aria-hidden="true"><FiShoppingBag /></div>
        <p className="order-success-eyebrow">Florésia · votre panier vous attend</p>
        <h1>Paiement interrompu</h1>
        <p className="order-success-message">Aucun paiement n’a été enregistré. Votre sélection est conservée et vous pourrez reprendre votre commande lorsque vous le souhaitez.</p>
        <p className="order-success-help">Vous pouvez modifier les quantités ou choisir un autre mode de livraison avant de réessayer.</p>
        <Link to="/panier" className="order-success-action"><ArrowLeft aria-hidden="true" /> Revenir au panier</Link>
      </section>
    </div>
  );
}
