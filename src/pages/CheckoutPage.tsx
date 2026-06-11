import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { createPaymentIntent } from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutForm: FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { clientSecret } = await createPaymentIntent({
        amount: Math.round(total * 100),
        currency: 'eur',
        description: `Commande YOM'S MARKET — ${items.length} article(s)`,
      });

      const cardEl = elements.getElement(CardElement);
      if (!cardEl) return;

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: { name, email },
        },
      });

      if (stripeError) {
        setError(stripeError.message ?? 'Erreur de paiement');
      } else if (paymentIntent?.status === 'succeeded') {
        clearCart();
        navigate('/payment-success');
      }
    } catch {
      setError('Erreur de connexion au serveur de paiement.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid #E0DBD4', borderRadius: 10,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 6 }}>
          Nom complet
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Jean Dupont"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 6 }}>
          Adresse email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="jean@exemple.fr"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 6 }}>
          Carte bancaire
        </label>
        <div style={{
          padding: '14px 16px',
          border: '1.5px solid #E0DBD4', borderRadius: 10,
          background: '#fff',
        }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#2D2A26',
                fontFamily: 'inherit',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#E8553A' },
            },
          }} />
        </div>
        <p style={{ fontSize: 11, color: '#bbb', marginTop: 6 }}>
          Test : 4242 4242 4242 4242 — exp : 12/34 — CVC : 123
        </p>
      </div>

      {error && (
        <div style={{
          background: '#FFF0ED', border: '1px solid #FFD5CC',
          borderRadius: 10, padding: '12px 14px',
          color: '#E8553A', fontSize: 13
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary"
        style={{ padding: '16px', fontSize: 16, fontWeight: 700, opacity: (!stripe || loading) ? 0.6 : 1 }}
      >
        {loading ? 'Traitement en cours...' : `Payer ${total.toLocaleString('fr-FR')} €`}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span>🔒</span>
        <span style={{ fontSize: 12, color: '#888' }}>
          Paiement sécurisé par <strong>Stripe</strong> — données chiffrées TLS
        </span>
      </div>
    </form>
  );
};

const CheckoutPage: FC = () => {
  const { items, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      <button className="btn-ghost" style={{ marginBottom: 24, fontSize: 13 }} onClick={() => navigate('/cart')}>
        ← Retour au panier
      </button>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 28, color: '#2D2A26' }}>
        Paiement sécurisé
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: 28,
          border: '1px solid #E8E4DE', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>

        <div style={{ background: '#F9F6F2', borderRadius: 20, padding: 24, border: '1px solid #E8E4DE' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#2D2A26' }}>
            Récapitulatif de commande
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {items.map(({ annonce, quantity }) => (
              <div key={annonce.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#555', flex: 1, lineHeight: 1.4 }}>
                  {annonce.titre}
                  {quantity > 1 && <span style={{ color: '#aaa' }}> × {quantity}</span>}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2D2A26', flexShrink: 0 }}>
                  {(annonce.prix * quantity).toLocaleString('fr-FR')} €
                </span>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid #E0DBD4', paddingTop: 16,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontWeight: 700, color: '#2D2A26', fontSize: 15 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: '#E8553A' }}>
              {total.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div style={{
            marginTop: 16, padding: 12,
            background: '#FFFBF0', borderRadius: 10, border: '1px solid #F5E6A3'
          }}>
            <p style={{ fontSize: 11, color: '#8A7040', lineHeight: 1.6 }}>
              🔒 Vos données bancaires sont chiffrées et traitées par Stripe. Nous ne stockons jamais votre numéro de carte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
