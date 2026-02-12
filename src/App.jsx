import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getAnnonces, createAnnonce } from "./services/api"; 
import RegisterPage from './pages/RegisterPage'; 
import LoginPage from './pages/LoginPage'; 

/* ─────────────────────────────────────────────
   FONKY'S S.A COMPANY — Application Principale
   ───────────────────────────────────────────── */

// 1. DATA (Catégories)
const CATEGORIES = [
  { id: 1, name: "Véhicules", icon: "🚗", color: "#E8553A", tagline: "Trouvez votre bolide" },
  { id: 2, name: "Immobilier", icon: "🏠", color: "#2D8F5E", tagline: "Votre futur chez-vous" },
  { id: 3, name: "Multimédia", icon: "📱", color: "#3B7DD8", tagline: "Tech à prix malin" },
  { id: 4, name: "Maison", icon: "🛋️", color: "#9B59B6", tagline: "Déco & ameublement" },
  { id: 5, name: "Loisirs", icon: "⚽", color: "#E67E22", tagline: "Sport & détente" },
  { id: 6, name: "Emploi", icon: "💼", color: "#1ABC9C", tagline: "Opportunités pro" },
  { id: 7, name: "Mode", icon: "👗", color: "#E84393", tagline: "Style & tendances" },
  { id: 8, name: "Services", icon: "🔧", color: "#636E72", tagline: "Pros près de vous" },
];

// 2. COMPOSANTS LOCAUX

function Navbar({ cartCount, user, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav style={styles.navbar}>
      <div style={styles.navInner}>
        <div style={styles.navLeft}>
          <span style={styles.logo} onClick={() => navigate("/")}>
            FONKY'S <span style={styles.logoAccent}>S.A</span>
          </span>
        </div>

        {/* Barre de recherche intégrée */}
        <div style={styles.searchBar}>
          <span style={{opacity:0.4, fontSize:14}}>🔍</span>
          <input type="text" placeholder="Rechercher une annonce..." style={styles.searchInput} />
        </div>

        <div style={styles.navRight}>
          <button style={styles.btnDeposer} onClick={() => navigate("/poster")}>
            + Déposer une Annonce
          </button>
          
          <button style={styles.btnIcon}>
            🛒 {cartCount > 0 && <span style={styles.badgeCart}>{cartCount}</span>}
          </button>
          
          {user ? (
            <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={styles.userBadge}>
                  <span style={{fontSize:16}}>👤</span>
                  <span style={{fontWeight:700, fontSize:13}}>{user.nom}</span>
                </div>
                <button onClick={onLogout} style={styles.btnLogout}>Déconnexion</button>
            </div>
          ) : (
            <button style={styles.btnLogin} onClick={() => navigate("/login")}>
              👤 Se connecter
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function HomePage({ addToCart }) {
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    getAnnonces()
        .then(data => setAnnonces(data || []))
        .catch(err => console.error("Erreur API:", err));
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🔥 Des milliers d'annonces près de chez vous</div>
          <h1 style={styles.heroTitle}>
            Achetez, vendez,<br/>
            <span style={styles.heroHighlight}>en toute confiance.</span>
          </h1>
          <p style={styles.heroSub}>
            La marketplace de référence pour les bonnes affaires entre particuliers.
          </p>
          <div style={styles.trustRow}>
            <span style={styles.trustItem}>🔒 Paiement sécurisé</span>
            <span style={styles.trustItem}>✅ Annonces vérifiées</span>
            <span style={styles.trustItem}>📦 Livraison possible</span>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Explorer par catégorie</h2>
        </div>
        <div style={styles.catGrid}>
            {CATEGORIES.map(cat => (
                <div key={cat.id} style={styles.catCard}>
                    <div style={{
                      ...styles.catIcon,
                      background: `${cat.color}15`,
                    }}>
                      <span style={{fontSize:26}}>{cat.icon}</span>
                    </div>
                    <span style={styles.catName}>{cat.name}</span>
                    <span style={styles.catTagline}>{cat.tagline}</span>
                </div>
            ))}
        </div>
      </section>

      {/* ── ANNONCES ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🔥 Dernières annonces</h2>
        </div>
        <div style={styles.grid}>
          {annonces.length === 0 ? (
            <p style={styles.emptyState}>Aucune annonce pour le moment... Soyez le premier à publier !</p>
          ) : annonces.map(a => (
            <div key={a.id} style={styles.card}>
               <div style={styles.cardImgWrap}>
                 {a.imageUrl ? (
                   <img src={a.imageUrl} alt={a.titre} style={styles.cardImg} onError={(e) => e.target.style.display='none'}/>
                 ) : (
                   <span style={{fontSize:50, opacity:0.2}}>📷</span>
                 )}
               </div>
               <div style={styles.cardBody}>
                 <div style={styles.cardMeta}>
                   {a.categorie && <span style={styles.cardCategorie}>{a.categorie}</span>}
                   {a.ville && <span style={styles.cardVille}>📍 {a.ville}</span>}
                 </div>
                 <h3 style={styles.cardTitle}>{a.titre}</h3>
                 <p style={styles.cardPrice}>{Number(a.prix).toLocaleString("fr-FR")} €</p>
                 <button style={styles.btnAddToCart} onClick={() => addToCart(a)}>
                   🛒 Ajouter au panier
                 </button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNIÈRE CTA ── */}
      <section style={styles.ctaBanner}>
        <h2 style={styles.ctaTitle}>Vous avez quelque chose à vendre ?</h2>
        <p style={styles.ctaSub}>Publiez votre annonce en 30 secondes. C'est gratuit.</p>
      </section>
    </div>
  );
}

function PostAnnonceForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titre: "", prix: "", ville: "", description: "", categorie: "Véhicules", imageUrl: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await createAnnonce(form);
        alert("Annonce publiée !");
        navigate("/");
    } catch (e) { alert("Erreur: " + e.message); }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <h1 style={styles.formTitle}>Déposer une annonce</h1>
        <p style={styles.formSub}>Remplissez les informations ci-dessous pour publier votre annonce.</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Titre de l'annonce *</label>
          <input placeholder="Ex: iPhone 15 Pro Max comme neuf" onChange={e => setForm({...form, titre: e.target.value})} style={styles.input} required />
        </div>
        <div style={styles.formRow}>
          <div style={{...styles.formGroup, flex:1}}>
            <label style={styles.label}>Prix (€) *</label>
            <input type="number" placeholder="0" onChange={e => setForm({...form, prix: e.target.value})} style={styles.input} required />
          </div>
          <div style={{...styles.formGroup, flex:1}}>
            <label style={styles.label}>Ville *</label>
            <input placeholder="Ex: Paris" onChange={e => setForm({...form, ville: e.target.value})} style={styles.input} required />
          </div>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>URL de l'image</label>
          <input placeholder="https://..." onChange={e => setForm({...form, imageUrl: e.target.value})} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Catégorie</label>
          <select onChange={e => setForm({...form, categorie: e.target.value})} style={styles.input} value={form.categorie}>
              {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea placeholder="Décrivez votre article en quelques lignes..." onChange={e => setForm({...form, description: e.target.value})} style={{...styles.input, height: 110, resize:'vertical'}} />
        </div>
        <button type="submit" style={styles.btnPublish}>Publier sur Fonky's →</button>
      </form>
    </div>
  );
}

// 3. APP PRINCIPAL
export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/"; 
  };

  const addToCart = (a) => {
    setCart([...cart, a]);
    alert("✅ Ajouté au panier Fonky's !");
  };

  return (
    <div style={styles.app}>
      <style>{globalCSS}</style>
      <Navbar cartCount={cart.length} user={user} onLogout={handleLogout} />
      
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />
          <Route path="/poster" element={<PostAnnonceForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <span style={{...styles.logo, color:'#fff'}}>FONKY'S <span style={styles.logoAccent}>S.A</span></span>
            <p style={styles.footerDesc}>La référence de la seconde main près de chez vous.</p>
            <div style={styles.footerSocials}>
              <a href="#" style={styles.socialLink}>🌐 Facebook</a>
              <a href="#" style={styles.socialLink}>📸 Instagram</a>
              <a href="#" style={styles.socialLink}>𝕏 Twitter</a>
              <a href="#" style={styles.socialLink}>💼 LinkedIn</a>
            </div>
          </div>
          
          <div style={styles.footerLinks}>
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>Fonky's</h4>
              <a href="#" style={styles.footerLink}>À propos</a>
              <a href="#" style={styles.footerLink}>Carrières</a>
              <a href="#" style={styles.footerLink}>Presse</a>
            </div>
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>Aide</h4>
              <a href="#" style={styles.footerLink}>Centre d'aide</a>
              <a href="#" style={styles.footerLink}>Sécurité</a>
              <a href="#" style={styles.footerLink}>Conditions</a>
            </div>
          </div>
        </div>
        <div style={styles.copyright}>
          © {new Date().getFullYear()} FONKY'S S.A — Tous droits réservés. | 🔒 Paiement sécurisé
        </div>
      </footer>
    </div>
  );
}

// 4. STYLES
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap');
  body { 
    margin: 0; 
    font-family: 'DM Sans', 'Segoe UI', Roboto, sans-serif; 
    background: #FAFAF8; 
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }
  * { box-sizing: border-box; }
  a { text-decoration: none; color: inherit; }
  
  /* Transitions douces sur les cartes et boutons */
  button { transition: all 0.25s ease; font-family: inherit; }
  button:hover { opacity: 0.9; }
`;

const styles = {
  app: { minHeight: "100vh", display: 'flex', flexDirection: 'column' },
  main: { flex: 1 },
  
  // ── NAVBAR ──
  navbar: { 
    padding: "12px 24px", 
    background: "rgba(255,255,255,0.95)", 
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #eee", 
    position:'sticky', top:0, zIndex:100 
  },
  navInner: { 
    maxWidth: 1280, margin: "0 auto", 
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 
  },
  navLeft: {},
  logo: { fontSize: 22, fontWeight: 800, cursor: "pointer", letterSpacing: -1, color: "#1a1a1a" },
  logoAccent: { color: "#E8553A" },
  searchBar: {
    flex: 1, maxWidth: 420,
    display: "flex", alignItems: "center", gap: 8,
    background: "#f5f5f3", borderRadius: 10,
    padding: "8px 14px", border: "1px solid #eee",
  },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    fontSize: 14, fontFamily: "inherit", color: "#333",
  },
  navRight: { display: "flex", gap: 12, alignItems: "center" },
  btnDeposer: { 
    background: "#E8553A", color: "white", border: "none", 
    padding: "10px 20px", borderRadius: 10, cursor: "pointer", 
    fontWeight: 700, fontSize: 14,
    boxShadow: "0 4px 12px rgba(232,85,58,0.25)",
  },
  btnIcon: { 
    background: "#f5f5f3", border: "none", fontSize: 18, cursor: "pointer", 
    position: 'relative', width: 40, height: 40, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  badgeCart: { 
    background: "#E8553A", color: "white", borderRadius: "50%", 
    padding: "2px 6px", fontSize: 10, fontWeight: 700,
    position: 'absolute', right: -4, top: -4 
  },
  btnLogin: { 
    fontSize: 13, background: "#f5f5f3", border: "none", cursor: "pointer",
    padding: "8px 16px", borderRadius: 10, fontWeight: 600,
  },
  userBadge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#f5f5f3", padding: "6px 14px", borderRadius: 10,
  },
  btnLogout: { 
    fontSize: 12, background: "none", 
    border: "1px solid #E8553A", color: "#E8553A", 
    borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 600,
  },
  
  // ── HERO ──
  hero: { 
    textAlign: "center", padding: "100px 24px 80px", 
    background: "linear-gradient(160deg, #1a1a1a 0%, #2D2A26 60%, #3a2f28 100%)", 
    color: "white", position: "relative", overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "radial-gradient(circle at 30% 40%, rgba(232,85,58,0.1) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", maxWidth: 700, margin: "0 auto" },
  heroBadge: {
    display: "inline-block", background: "rgba(232,85,58,0.15)",
    color: "#FF8E72", padding: "8px 20px", borderRadius: 50,
    fontSize: 13, fontWeight: 600, marginBottom: 28,
    border: "1px solid rgba(232,85,58,0.2)",
  },
  heroTitle: { 
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)", margin: "0 0 20px", 
    fontWeight: 800, lineHeight: 1.15, letterSpacing: -1,
  },
  heroHighlight: { color: "#E8553A" },
  heroSub: {
    fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.6,
    margin: "0 0 36px", maxWidth: 500, marginLeft: "auto", marginRight: "auto",
  },
  trustRow: {
    display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap",
  },
  trustItem: { color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500 },
  
  // ── SECTIONS ──
  section: { maxWidth: 1280, margin: "50px auto", padding: "0 24px" },
  sectionHeader: { marginBottom: 28 },
  sectionTitle: { fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 },
  
  // ── CATÉGORIES ──
  catGrid: { 
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 
  },
  catCard: { 
    background: "white", padding: "24px 14px", borderRadius: 14, textAlign: "center", 
    border: "1px solid #f0f0f0", cursor:'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  catIcon: {
    width: 52, height: 52, borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  catName: { fontWeight: 700, fontSize: 13 },
  catTagline: { fontSize: 11, color: "#999", fontWeight: 400 },
  
  // ── ANNONCES GRID ──
  grid: { 
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 22 
  },
  card: { 
    background: "white", borderRadius: 18, overflow: "hidden", 
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: 'pointer',
    border: "1px solid rgba(0,0,0,0.03)",
  },
  cardImgWrap: { 
    height: 210, background: "#f5f5f3", 
    display: "flex", alignItems: "center", justifyContent: "center", 
    fontSize: 40, color: "#ccc", overflow: "hidden",
  },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: 20 },
  cardMeta: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 8,
  },
  cardCategorie: {
    fontSize: 11, fontWeight: 600, color: "#E8553A",
    textTransform: "uppercase", letterSpacing: 0.8,
  },
  cardVille: { fontSize: 12, color: "#999" },
  cardTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3 },
  cardPrice: { color: "#E8553A", fontWeight: 800, fontSize: 22, margin: "8px 0 0" },
  btnAddToCart: { 
    width: "100%", marginTop: 14, padding: 13, 
    background: "#1a1a1a", color: "white", border: "none", 
    borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14,
  },
  emptyState: { 
    gridColumn: "1 / -1", textAlign: "center", padding: 60,
    color: "#999", fontSize: 16, fontStyle: "italic",
  },
  
  // ── CTA BANNER ──
  ctaBanner: {
    textAlign: "center", padding: "60px 24px", margin: "20px 0",
    background: "linear-gradient(135deg, #E8553A 0%, #FF8E72 100%)",
    color: "#fff",
  },
  ctaTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 8px" },
  ctaSub: { fontSize: 16, opacity: 0.85, margin: 0 },

  // ── FORMULAIRE ──
  formContainer: { 
    maxWidth: 600, margin: "50px auto", padding: "40px 35px", 
    background: "white", borderRadius: 22, 
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #f0f0f0",
  },
  formHeader: { marginBottom: 30 },
  formTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 8px" },
  formSub: { fontSize: 14, color: "#888", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formRow: { display: "flex", gap: 16 },
  label: { fontSize: 13, fontWeight: 600, color: "#555" },
  input: { 
    padding: "14px 16px", borderRadius: 12, border: "1px solid #e0e0e0", 
    fontSize: 15, outline: 'none', fontFamily: "inherit",
    background: "#fafaf8",
  },
  btnPublish: { 
    padding: "16px", background: "#E8553A", color: "white", border: "none", 
    borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 8,
    boxShadow: "0 6px 20px rgba(232,85,58,0.3)",
  },
  
  // ── FOOTER ──
  footer: { 
    background: "#111", color: "#fff", 
    padding: "60px 24px 30px", marginTop: 60 
  },
  footerInner: { 
    maxWidth: 1280, margin: "0 auto", 
    display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 
  },
  footerBrand: { flex: 1, minWidth: 260 },
  footerDesc: { color: "#777", fontSize: 14, lineHeight: 1.6, margin: "12px 0 20px" },
  footerSocials: { display: "flex", gap: 10, flexWrap: "wrap" },
  socialLink: { 
    color: "#999", fontSize: 13, 
    border: "1px solid #2a2a2a", padding: "8px 16px", borderRadius: 10,
  },
  footerLinks: { display: "flex", gap: 50 },
  footerCol: { display: "flex", flexDirection: "column", gap: 10 },
  footerColTitle: { fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "#fff" },
  footerLink: { color: "#777", fontSize: 13, cursor: "pointer" },
  copyright: { 
    maxWidth: 1280, margin: "40px auto 0", paddingTop: 25, 
    borderTop: "1px solid #222", textAlign: "center", 
    color: "#555", fontSize: 13 
  },
};