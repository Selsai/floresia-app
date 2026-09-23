// OrderSuccess : confirmation de commande.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CircleCheck as FiCheckCircle, Clock3, ReceiptText } from 'lucide-react';
import { useAuth } from '../../context/auth/auth-context';
import { useCart } from '../../context/cart/cart-context';
import { ordersApi } from '../../services/api';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { token, isLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const [result, setResult] = useState(null);
  const cartSnapshot = JSON.stringify(cart);

  useEffect(() => {
    if (!orderId || !token) return;
    let active = true;
    let timer;
    let attempts = 0;
    async function checkPayment() {
      try {
        const order = await ordersApi.getOne(orderId, token);
        if (!active) return;
        const paid = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status);
        setResult({ orderId, paid, status: order.status });
        if (paid) {
          try {
            const pending = JSON.parse(sessionStorage.getItem('floresia-checkout') || 'null');
            // Ne vide pas un panier modifié depuis le départ vers Stripe.
            if (pending?.orderId === orderId && pending.cart === cartSnapshot) clearCart();
            if (pending?.orderId === orderId) sessionStorage.removeItem('floresia-checkout');
          } catch { /* Le statut serveur reste fiable si le stockage local est indisponible. */ }
        } else if (order.status === 'PENDING' && ++attempts < 10) {
          timer = setTimeout(checkPayment, 2000);
        }
      } catch {
        if (active) setResult({ orderId, error: true });
      }
    }
    checkPayment();
    return () => { active = false; clearTimeout(timer); };
  }, [orderId, token, cartSnapshot, clearCart]);

  const current = result?.orderId === orderId ? result : null;
  const paid = current?.paid;
  let message = 'Vérification du paiement en cours…';
  if (!orderId) message = 'Aucune commande à vérifier.';
  else if (!isLoading && !token) message = 'Connectez-vous pour consulter votre commande.';
  else if (current?.error) message = 'La commande n’a pas pu être vérifiée. Consultez votre compte.';
  else if (paid) message = 'Votre paiement a bien été confirmé.';
  else if (current?.status === 'CANCELLED') message = 'Cette commande est annulée.';
  else if (current) message = 'La confirmation du paiement est encore en attente. Vous pouvez consulter votre compte.';

  return (
    <main className="order-success-page">
      <section className={`order-success-card ${paid ? 'is-paid' : ''}`}>
        <div className="order-success-icon" aria-hidden="true">
          {paid ? <FiCheckCircle /> : <Clock3 />}
        </div>
        <p className="order-success-eyebrow">Florésia · suivi de commande</p>
        <h1>{paid ? 'Merci pour votre commande !' : 'Suivi de votre paiement'}</h1>
        <p className="order-success-message" role="status">{message}</p>
        {current && !current.error && (
          <div className="order-success-reference">
            <ReceiptText aria-hidden="true" />
            <span>Commande</span>
            <strong>#{orderId}</strong>
          </div>
        )}
        <p className="order-success-help">Retrouvez le détail et l’avancement de votre commande dans votre espace personnel.</p>
        <Link to="/compte" className="order-success-action">
          Voir mes commandes <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
