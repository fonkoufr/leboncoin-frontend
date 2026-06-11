import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/theme';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const Navbar: FC<NavbarProps> = ({
  isLoggedIn = false,
  userName,
  onLogout = () => {},
  searchQuery = '',
  onSearchChange = () => {},
}) => {
  const navigate = useNavigate();
  const { count } = useCart();

  return (
    <nav style={styles.navbar}>
      <div style={styles.navInner}>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <Logo size="md" />
        </span>

        <div style={styles.searchBox} className="hide-mobile">
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher une annonce, une ville..."
            className="search-input"
            style={styles.searchInput}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div style={styles.navRight}>
          {/* Cart icon */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 20, padding: '4px 8px',
              borderRadius: 8, transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            title="Mon panier"
          >
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                background: '#E8553A', color: '#fff',
                fontSize: 10, fontWeight: 700,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <>
              <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }} className="hide-mobile">
                Bonjour, <strong>{userName}</strong>
              </span>
              <button className="btn-primary" onClick={() => navigate('/deposer')}>
                + Déposer
              </button>
              <button className="btn-ghost" onClick={onLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/login')}>
                Connexion
              </button>
              <button className="btn-primary" onClick={() => navigate('/register')}>
                S'inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
