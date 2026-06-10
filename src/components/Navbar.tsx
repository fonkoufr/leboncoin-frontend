import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/theme';
import Logo from './Logo';

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
