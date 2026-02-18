/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getAnnonces, createAnnonce } from "./services/api"; 
import RegisterPage from './pages/RegisterPage'; 
import LoginPage from './pages/LoginPage'; 

/* ─────────────────────────────────────────────
FONKY'S S.A COMPANY — Application Principale (Responsive)
───────────────────────────────────────────── */

// ⚠️ REMPLACE "TA_CLE_API_GOOGLE_ICI" PAR TA VRAIE CLÉ (commence par AIza...)
const GOOGLE_MAPS_API_KEY = "TA_CLE_API_GOOGLE_ICI";

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

// ─── STYLES DU CHATBOT (Inchangés car déjà positionnés en fixed) ───
const chatStyles = {
  chatButton: {
    position: 'fixed', bottom: '20px', right: '20px',
    background: '#E8553A', color: 'white', border: 'none',
    borderRadius: '50%', width: '60px', height: '60px',
    fontSize: '30px', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 9999,
    transition: 'transform 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  teaserBubble: {
    position: 'fixed', bottom: '90px', right: '20px',
    background: 'white', padding: '10px 15px', borderRadius: '15px 15px 0 15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)', zIndex: 9998,
    fontSize: '13px', fontWeight: '600', color: '#333',
    animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    border: '1px solid #eee', cursor: 'pointer',
    maxWidth: '200px' // Ajout pour éviter que ça dépasse sur mobile
  },
  chatWindow: {
    position: 'fixed', bottom: '90px', right: '20px',
    width: '350px', maxWidth: '90vw', height: '500px', maxHeight: '70vh', background: 'white', // Responsive
    borderRadius: '16px', boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column', zIndex: 9999,
    overflow: 'hidden', border: '1px solid #f0f0f0',
    fontFamily: "'DM Sans', sans-serif"
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
    color: 'white', padding: '16px', fontWeight: 'bold',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  messagesArea: {
    flex: 1, padding: '15px', overflowY: 'auto',
    background: '#FAFAF8', display: 'flex', flexDirection: 'column', gap: '12px'
  },
  suggestions: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' },
  suggestionChip: {
    background: '#fff', border: '1px solid #E8553A', color: '#E8553A',
    borderRadius: '20px', padding: '6px 12px', fontSize: '12px',
    cursor: 'pointer', fontWeight: '600', transition: '0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  inputArea: {
    borderTop: '1px solid #eee', padding: '12px', display: 'flex', gap: '10px', background: '#fff'
  },
  input: {
    flex: 1, padding: '12px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '14px'
  },
  sendBtn: {
    border: 'none', background: '#E8553A', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  msgUser: {
    alignSelf: 'flex-end', background: '#E8553A', color: 'white', padding: '10px 15px', borderRadius: '18px 18px 0 18px', maxWidth: '85%', fontSize: '14px', boxShadow: '0 2px 5px rgba(232,85,58,0.2)'
  },
  msgBot: {
    alignSelf: 'flex-start', background: 'white', color: '#333', padding: '10px 15px', borderRadius: '18px 18px 18px 0', maxWidth: '85%', fontSize: '14px', border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  spotifyContainer: {
    marginTop: '10px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  typing: {
    fontSize: '12px', color: '#888', fontStyle: 'italic', marginLeft: '10px', marginBottom: '5px'
  }
};

// ─── COMPOSANT CITY AUTOCOMPLETE (CORRIGÉ) ───
function CityAutocomplete({ value, onChange, onLocationSelect }) {
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
            initAutocomplete();
            return;
        }
        if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initAutocomplete;
            document.body.appendChild(script);
        }
    };

    const initAutocomplete = () => {
        if (!inputRef.current || !window.google) return;

        autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['(cities)'],
            componentRestrictions: { country: "fr" },
        });

        autoCompleteRef.current.addListener("place_changed", () => {
            const place = autoCompleteRef.current.getPlace();
            
            if (place && place.formatted_address) {
                const cityName = place.formatted_address.split(',')[0];
                onChange(cityName);

                if (onLocationSelect) {
                    onLocationSelect(cityName);
                }
            }
        });
    };

    loadGoogleMapsScript();
  }, [onChange, onLocationSelect]);

  return (
    <input 
      ref={inputRef} 
      type="text"
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)} 
      placeholder="Rechercher une ville (ex: Paris)..." 
      style={styles.input} 
      required 
    />
  );
}

// ─── CHATBOT ───
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour ! 👋 Je suis l\'IA de Fonky\'s. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTeaser(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateAI = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('musique') || lowerText.includes('spotify') || lowerText.includes('chanson') || lowerText.includes('music')) {
      return { text: "Avec plaisir ! Voici une playlist 'Vibes Shopping'. 🎧", spotifyId: "37i9dQZF1DXcBWIGoYBM5M" };
    }
    if (lowerText.includes('vélo') || lowerText.includes('sport') || lowerText.includes('vtt')) {
      return { text: "Pour le sport, voici du Rock motivant ! 🚴‍♂️🔥", spotifyId: "37i9dQZF1DWXRqgorJj26U" };
    }
    if (lowerText.includes('maison') || lowerText.includes('meuble') || lowerText.includes('canapé')) {
      return { text: "Ambiance déco ? Voici du Jazz Lo-Fi relaxant. 🎷🛋️", spotifyId: "37i9dQZF1DWVqfgj8N3E8H" };
    }
    if (lowerText.includes('voiture') || lowerText.includes('auto')) {
      return { text: "En route ! Playlist Drive & Vibe. 🚗💨", spotifyId: "37i9dQZF1DX4o1oenSJRJd" };
    }
    return { text: "Je peux vous aider à trouver des articles ou mettre de l'ambiance. Essayez les boutons ci-dessous ! ✨", spotifyId: null };
  };

  const processMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text: text }]);
    setIsTyping(true);
    setTimeout(() => {
      const response = simulateAI(text);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response.text, 
        spotifyId: response.spotifyId 
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    processMessage(input);
    setInput("");
  };

  const handleChipClick = (suggestion) => {
    processMessage(suggestion);
  };

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) setShowTeaser(false);
  };

  return (
    <>
      {showTeaser && !isOpen && (
        <div style={chatStyles.teaserBubble} onClick={toggleChat}>
           Besoin d'inspiration ? 🎵
           <div style={{
             position:'absolute', bottom:'-6px', right:'20px', 
             width:0, height:0, 
             borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'6px solid white'
           }}></div>
        </div>
      )}
      <button style={chatStyles.chatButton} onClick={toggleChat}>
        {isOpen ? '✕' : '🤖'}
      </button>
      {isOpen && (
        <div style={chatStyles.chatWindow}>
          <div style={chatStyles.header}>
            <span>Fonky's AI Assistant ✨</span>
            <span style={{fontSize:'12px', opacity:0.8}}>En ligne</span>
          </div>
          <div style={chatStyles.messagesArea}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.sender === 'user' ? chatStyles.msgUser : chatStyles.msgBot}>
                <div>{msg.text}</div>
                {msg.spotifyId && (
                  <div style={chatStyles.spotifyContainer}>
                    <iframe 
                      src={`https://open.spotify.com/embed/playlist/${msg.spotifyId}?utm_source=generator&theme=0`} 
                      width="100%" height="80" frameBorder="0" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
                    ></iframe>
                  </div>
                )}
                {index === 0 && msg.sender === 'bot' && (
                   <div style={chatStyles.suggestions}>
                      <button style={chatStyles.suggestionChip} onClick={() => handleChipClick("Mets de la musique 🎵")}>🎵 Musique</button>
                      <button style={chatStyles.suggestionChip} onClick={() => handleChipClick("Je cherche un vélo 🚲")}>🚲 Vélo</button>
                      <button style={chatStyles.suggestionChip} onClick={() => handleChipClick("Déco maison 🏠")}>🏠 Maison</button>
                   </div>
                )}
              </div>
            ))}
            {isTyping && <div style={chatStyles.typing}>Fonky's AI écrit...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form style={chatStyles.inputArea} onSubmit={handleSend}>
            <input style={chatStyles.input} placeholder="Posez une question..." value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
            <button type="submit" style={chatStyles.sendBtn}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}

// ─── COMPOSANTS PAGE ───

function Navbar({ cartCount, user, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // État pour le menu mobile

  return (
    <nav style={styles.navbar}>
      <div style={styles.navInner}>
        <div style={{display:'flex', alignItems:'center', gap: 15}}>
            <div style={styles.navLeft}>
              <span style={styles.logo} onClick={() => navigate("/")}>FONKY'S <span style={styles.logoAccent}>S.A</span></span>
            </div>
            {/* Bouton Hamburger pour mobile */}
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{display: 'none'}}>☰</button>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`} style={styles.navLinksContainer}>
            <div style={styles.searchBar}>
              <span style={{opacity:0.4, fontSize:14}}>🔍</span>
              <input type="text" placeholder="Rechercher une annonce..." style={styles.searchInput} />
            </div>
            <div style={styles.navRight}>
              <button style={styles.btnDeposer} onClick={() => navigate("/poster")}>+ Déposer une Annonce</button>
              <button style={styles.btnIcon}>🛒 {cartCount > 0 && <span style={styles.badgeCart}>{cartCount}</span>}</button>
              {user ? (
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <div style={styles.userBadge}><span style={{fontSize:16}}>👤</span><span style={{fontWeight:700, fontSize:13}}>{user.nom}</span></div>
                    <button onClick={onLogout} style={styles.btnLogout}>Déconnexion</button>
                </div>
              ) : (
                <button style={styles.btnLogin} onClick={() => navigate("/login")}>👤 Se connecter</button>
              )}
            </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ addToCart }) {
  const [annonces, setAnnonces] = useState([]);
  useEffect(() => {
    getAnnonces().then(data => setAnnonces(data || [])).catch(err => console.error("Erreur API:", err));
  }, []);

  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🔥 Des milliers d'annonces près de chez vous</div>
          <h1 style={styles.heroTitle}>Achetez, vendez,<br/><span style={styles.heroHighlight}>en toute confiance.</span></h1>
          <p style={styles.heroSub}>La marketplace de référence pour les bonnes affaires entre particuliers.</p>
          <div style={styles.trustRow}>
            <span style={styles.trustItem}>🔒 Paiement sécurisé</span>
            <span style={styles.trustItem}>✅ Annonces vérifiées</span>
            <span style={styles.trustItem}>📦 Livraison possible</span>
          </div>
        </div>
      </section>
      <section style={styles.section}>
        <div style={styles.sectionHeader}><h2 style={styles.sectionTitle}>Explorer par catégorie</h2></div>
        <div style={styles.catGrid}>
            {CATEGORIES.map(cat => (
                <div key={cat.id} style={styles.catCard}>
                    <div style={{...styles.catIcon, background: `${cat.color}15`}}><span style={{fontSize:26}}>{cat.icon}</span></div>
                    <span style={styles.catName}>{cat.name}</span>
                    <span style={styles.catTagline}>{cat.tagline}</span>
                </div>
            ))}
        </div>
      </section>
      <section style={styles.section}>
        <div style={styles.sectionHeader}><h2 style={styles.sectionTitle}>🔥 Dernières annonces</h2></div>
        <div style={styles.grid}>
          {annonces.length === 0 ? <p style={styles.emptyState}>Aucune annonce pour le moment...</p> : annonces.map(a => (
            <div key={a.id} style={styles.card}>
               <div style={styles.cardImgWrap}>
                 {a.imageUrl ? <img src={a.imageUrl} alt={a.titre} style={styles.cardImg} onError={(e) => e.target.style.display='none'}/> : <span style={{fontSize:50, opacity:0.2}}>📷</span>}
               </div>
               <div style={styles.cardBody}>
                 <div style={styles.cardMeta}>
                   {a.categorie && <span style={styles.cardCategorie}>{a.categorie}</span>}
                   {a.ville && <span style={styles.cardVille}>📍 {a.ville}</span>}
                 </div>
                 <h3 style={styles.cardTitle}>{a.titre}</h3>
                 <p style={styles.cardPrice}>{Number(a.prix).toLocaleString("fr-FR")} €</p>
                 <button style={styles.btnAddToCart} onClick={() => addToCart(a)}>🛒 Ajouter au panier</button>
               </div>
            </div>
          ))}
        </div>
      </section>
      <section style={styles.ctaBanner}>
        <h2 style={styles.ctaTitle}>Vous avez quelque chose à vendre ?</h2>
        <p style={styles.ctaSub}>Publiez votre annonce en 30 secondes. C'est gratuit.</p>
      </section>
    </div>
  );
}

// ─── FORMULAIRE AVEC CARTE (CORRIGÉ & RESPONSIVE) ───
function PostAnnonceForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titre: "", prix: "", ville: "", description: "", categorie: "Véhicules", imageUrl: "" });
  const [mapUrl, setMapUrl] = useState(null);

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
          
          {/* CHAMP VILLE AVEC AUTOCOMPLETE */}
          <div style={{...styles.formGroup, flex:1}}>
            <label style={styles.label}>Ville *</label>
            <CityAutocomplete 
                value={form.ville} 
                onChange={(newVille) => setForm({...form, ville: newVille})} 
                onLocationSelect={(cityName) => {
                    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(cityName)}`);
                }}
            />
          </div>
          
        </div>

        {mapUrl && (
            <div style={{borderRadius: 12, overflow: 'hidden', height: 250, border: '1px solid #eee', marginBottom: 20}}>
                <iframe
                    width="100%"
                    height="100%"
                    style={{border:0}}
                    loading="lazy"
                    allowFullScreen
                    src={mapUrl}>
                </iframe>
            </div>
        )}

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

  const handleLogin = (u) => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };
  const handleLogout = () => { setUser(null); localStorage.removeItem("user"); window.location.href = "/"; };
  const addToCart = (a) => { setCart([...cart, a]); alert("✅ Ajouté au panier Fonky's !"); };

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
      <ChatBot />
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <span style={{...styles.logo, color:'#fff'}}>FONKY'S <span style={styles.logoAccent}>S.A</span></span>
            <p style={styles.footerDesc}>La référence de la seconde main près de chez vous.</p>
            <div style={styles.footerSocials}><a href="#" style={styles.socialLink}>🌐 Facebook</a><a href="#" style={styles.socialLink}>📸 Instagram</a><a href="#" style={styles.socialLink}>𝕏 Twitter</a><a href="#" style={styles.socialLink}>💼 LinkedIn</a></div>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerCol}><h4 style={styles.footerColTitle}>Fonky's</h4><a href="#" style={styles.footerLink}>À propos</a><a href="#" style={styles.footerLink}>Carrières</a><a href="#" style={styles.footerLink}>Presse</a></div>
            <div style={styles.footerCol}><h4 style={styles.footerColTitle}>Aide</h4><a href="#" style={styles.footerLink}>Centre d'aide</a><a href="#" style={styles.footerLink}>Sécurité</a><a href="#" style={styles.footerLink}>Conditions</a></div>
          </div>
        </div>
        <div style={styles.copyright}>© {new Date().getFullYear()} FONKY'S S.A — Tous droits réservés. | 🔒 Paiement sécurisé</div>
      </footer>
    </div>
  );
}

// 4. STYLES GLOBAUX RESPONSIVE (Avec Media Queries)
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap');
  body { margin: 0; font-family: 'DM Sans', 'Segoe UI', Roboto, sans-serif; background: #FAFAF8; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
  * { box-sizing: border-box; }
  a { text-decoration: none; color: inherit; }
  button { transition: all 0.25s ease; font-family: inherit; }
  button:hover { opacity: 0.9; }
  @keyframes popIn { 0% { opacity: 0; transform: scale(0.5) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }

  /* GESTION RESPONSIVE AVEC MEDIA QUERIES */
  @media (max-width: 768px) {
    .nav-links {
        display: none;
        flex-direction: column;
        width: 100%;
        margin-top: 15px;
    }
    .nav-links.open {
        display: flex;
    }
    .mobile-menu-btn {
        display: block !important;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }
    .hero-title {
        font-size: 2rem !important;
    }
    .form-row {
        flex-direction: column !important;
    }
    .footer-inner {
        flex-direction: column;
    }
  }
`;

// STYLES MODIFIÉS POUR LE RESPONSIVE
const styles = {
  app: { minHeight: "100vh", display: 'flex', flexDirection: 'column' },
  main: { flex: 1 },
  navbar: { padding: "12px 24px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #eee", position:'sticky', top:0, zIndex:100 },
  navInner: { maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }, // Ajout de flexWrap
  navLeft: { display: "flex", alignItems: "center" },
  logo: { fontSize: 22, fontWeight: 800, cursor: "pointer", letterSpacing: -1, color: "#1a1a1a" },
  logoAccent: { color: "#E8553A" },
  navLinksContainer: { display: "flex", flex: 1, justifyContent: "space-between", alignItems: "center", width: "100%" }, // Container pour les liens
  searchBar: { flex: 1, maxWidth: 420, minWidth: "200px", display: "flex", alignItems: "center", gap: 8, background: "#f5f5f3", borderRadius: 10, padding: "8px 14px", border: "1px solid #eee", margin: "10px 0" }, // Marges pour mobile
  searchInput: { flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", color: "#333", width: "100%" },
  navRight: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }, // flexWrap pour éviter débordement
  btnDeposer: { background: "#E8553A", color: "white", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 12px rgba(232,85,58,0.25)", whiteSpace: "nowrap" },
  btnIcon: { background: "#f5f5f3", border: "none", fontSize: 18, cursor: "pointer", position: 'relative', width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  badgeCart: { background: "#E8553A", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: 10, fontWeight: 700, position: 'absolute', right: -4, top: -4 },
  btnLogin: { fontSize: 13, background: "#f5f5f3", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 10, fontWeight: 600, whiteSpace: "nowrap" },
  userBadge: { display: "flex", alignItems: "center", gap: 6, background: "#f5f5f3", padding: "6px 14px", borderRadius: 10 },
  btnLogout: { fontSize: 12, background: "none", border: "1px solid #E8553A", color: "#E8553A", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 600 },
  hero: { textAlign: "center", padding: "100px 24px 80px", background: "linear-gradient(160deg, #1a1a1a 0%, #2D2A26 60%, #3a2f28 100%)", color: "white", position: "relative", overflow: "hidden" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(232,85,58,0.1) 0%, transparent 60%)", pointerEvents: "none" },
  heroContent: { position: "relative", maxWidth: 700, margin: "0 auto", padding: "0 10px" },
  heroBadge: { display: "inline-block", background: "rgba(232,85,58,0.15)", color: "#FF8E72", padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, marginBottom: 28, border: "1px solid rgba(232,85,58,0.2)" },
  heroTitle: { fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "0 0 20px", fontWeight: 800, lineHeight: 1.15, letterSpacing: -1 }, // clamp() pour responsive
  heroHighlight: { color: "#E8553A" },
  heroSub: { fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 36px", maxWidth: 500, marginLeft: "auto", marginRight: "auto" },
  trustRow: { display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }, // flexWrap important
  trustItem: { color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500 },
  section: { maxWidth: 1280, margin: "50px auto", padding: "0 24px" },
  sectionHeader: { marginBottom: 28 },
  sectionTitle: { fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 },
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 },
  catCard: { background: "white", padding: "24px 14px", borderRadius: 14, textAlign: "center", border: "1px solid #f0f0f0", cursor:'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  catIcon: { width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  catName: { fontWeight: 700, fontSize: 13 },
  catTagline: { fontSize: 11, color: "#999", fontWeight: 400 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }, // Ajustement minmax
  card: { background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: 'pointer', border: "1px solid rgba(0,0,0,0.03)" },
  cardImgWrap: { height: 210, background: "#f5f5f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#ccc", overflow: "hidden" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: 20 },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardCategorie: { fontSize: 11, fontWeight: 600, color: "#E8553A", textTransform: "uppercase", letterSpacing: 0.8 },
  cardVille: { fontSize: 12, color: "#999" },
  cardTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3 },
  cardPrice: { color: "#E8553A", fontWeight: 800, fontSize: 22, margin: "8px 0 0" },
  btnAddToCart: { width: "100%", marginTop: 14, padding: 13, background: "#1a1a1a", color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14 },
  emptyState: { gridColumn: "1 / -1", textAlign: "center", padding: 60, color: "#999", fontSize: 16, fontStyle: "italic" },
  ctaBanner: { textAlign: "center", padding: "60px 24px", margin: "20px 0", background: "linear-gradient(135deg, #E8553A 0%, #FF8E72 100%)", color: "#fff" },
  ctaTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 8px" },
  ctaSub: { fontSize: 16, opacity: 0.85, margin: 0 },
  formContainer: { maxWidth: 600, margin: "50px auto", padding: "40px 35px", background: "white", borderRadius: 22, boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0", width: "95%" }, // Responsive width
  formHeader: { marginBottom: 30 },
  formTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 8px" },
  formSub: { fontSize: 14, color: "#888", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formRow: { display: "flex", gap: 16, className: "form-row" }, // Ajout classe pour media query
  label: { fontSize: 13, fontWeight: 600, color: "#555" },
  input: { padding: "14px 16px", borderRadius: 12, border: "1px solid #e0e0e0", fontSize: 15, outline: 'none', fontFamily: "inherit", background: "#fafaf8", width: "100%" },
  btnPublish: { padding: "16px", background: "#E8553A", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 8, boxShadow: "0 6px 20px rgba(232,85,58,0.3)", width: "100%" },
  footer: { background: "#111", color: "#fff", padding: "60px 24px 30px", marginTop: 60 },
  footerInner: { maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, className: "footer-inner" },
  footerBrand: { flex: 1, minWidth: 260 },
  footerDesc: { color: "#777", fontSize: 14, lineHeight: 1.6, margin: "12px 0 20px" },
  footerSocials: { display: "flex", gap: 10, flexWrap: "wrap" },
  socialLink: { color: "#999", fontSize: 13, border: "1px solid #2a2a2a", padding: "8px 16px", borderRadius: 10 },
  footerLinks: { display: "flex", gap: 50, flexWrap: "wrap" }, // flexWrap pour mobile
  footerCol: { display: "flex", flexDirection: "column", gap: 10, minWidth: "120px" },
  footerColTitle: { fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "#fff" },
  footerLink: { color: "#777", fontSize: 13, cursor: "pointer" },
  copyright: { maxWidth: 1280, margin: "40px auto 0", paddingTop: 25, borderTop: "1px solid #222", textAlign: "center", color: "#555", fontSize: 13 },
};