import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44, margin: '0 auto 28px',
        boxShadow: '0 8px 32px rgba(34,197,94,0.3)'
      }}>
        ✓
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 12, color: '#2D2A26' }}>
        Paiement confirmé !
      </h1>
      <p style={{ color: '#666', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
        Merci pour votre achat sur <strong>YOM'S MARKET</strong>.
      </p>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 36 }}>
        Un email de confirmation vous a été envoyé.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Continuer mes achats
        </button>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
