import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: FC = () => {
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 12 }}>
          Votre panier est vide
        </h2>
        <p style={{ color: '#888', marginBottom: 24 }}>
          Parcourez les annonces pour trouver votre bonheur.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          ← Voir les annonces
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 24, color: '#2D2A26' }}>
        Mon panier
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {items.map(({ annonce, quantity }) => (
          <div key={annonce.id} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: '#fff', borderRadius: 16, padding: 16,
            border: '1px solid #E8E4DE', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 12, overflow: 'hidden',
              background: '#F5F0EB', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
            }}>
              {annonce.imageUrl ? (
                <img src={annonce.imageUrl} alt={annonce.titre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : '📦'}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: '#2D2A26', marginBottom: 4 }}>
                {annonce.titre}
              </h3>
              <span style={{ fontSize: 13, color: '#888' }}>{annonce.ville}</span>
              {quantity > 1 && (
                <span style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>× {quantity}</span>
              )}
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontWeight: 800, fontSize: 18, color: '#E8553A', marginBottom: 8 }}>
                {(annonce.prix * quantity).toLocaleString('fr-FR')} €
              </p>
              <button
                onClick={() => removeFromCart(annonce.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#aaa', padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E8553A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff', borderRadius: 20, padding: 24,
        border: '1px solid #E8E4DE', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #F0EBE4'
        }}>
          <span style={{ fontSize: 16, color: '#444' }}>Total</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#E8553A' }}>
            {total.toLocaleString('fr-FR')} €
          </span>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700 }}
          onClick={() => navigate('/checkout')}
        >
          Procéder au paiement →
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 12 }}>
          🔒 Paiement sécurisé par Stripe
        </p>
      </div>
    </div>
  );
};

export default CartPage;
