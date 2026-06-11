import { useState, FC } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AnnonceDetailPage from './pages/AnnonceDetailPage';
import PostAnnoncePage from './pages/PostAnnoncePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Logo from './components/Logo';
import { globalCSS, styles } from './styles/theme';
import { User } from './services/api';

const App: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = (u: User): void => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.app}>
      <style>{globalCSS}</style>
      <Navbar
        isLoggedIn={!!user}
        userName={user?.nom}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/annonce/:id" element={<AnnonceDetailPage />} />
          <Route path="/deposer" element={<PostAnnoncePage user={user} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Routes>
      </main>
      <ChatBot />
      <footer style={styles.footer}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, paddingBottom: 48 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <Logo size="md" dark />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>
                La marketplace de confiance pour acheter et vendre près de chez vous.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: 14, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)' }}>Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[{ label: 'Accueil', path: '/' }, { label: 'Déposer une annonce', path: '/deposer' }, { label: 'Connexion', path: '/login' }].map(item => (
                  <span key={item.label} onClick={() => navigate(item.path)} style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: 14, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)' }}>Catégories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Véhicules', 'Immobilier', 'Multimédia', 'Maison'].map(item => (
                  <span key={item} style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: 14, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)' }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>support@youmssa.com</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>+33 1 23 45 67 89</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
              © {new Date().getFullYear()} YOUM'S S.A — Tous droits réservés.
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>🔒 Paiement sécurisé</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
