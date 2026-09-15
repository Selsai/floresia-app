import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <FiCheckCircle size={64} color="#4CAF50" />
      <h1>Merci pour votre commande !</h1>
      <p>Votre paiement a bien été confirmé.</p>
      {orderId && <p>Numéro de commande : <strong>{orderId}</strong></p>}
      <Link to="/boutique" className="btn-continue-shopping">Continuer mes achats</Link>
    </div>
  );
}