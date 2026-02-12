// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnnonces } from '../services/api'; // Ton service API existant
import { styles } from '../styles/theme'; // Import des styles

// Données statiques pour les catégories (tu peux les déplacer dans un fichier de constantes)
const CATEGORIES = [
  { id: 1, name: "Véhicules", icon: "🚗", color: "#E8553A" },
  { id: 2, name: "Immobilier", icon: "🏠", color: "#2D8F5E" },
  { id: 3, name: "Multimédia", icon: "📱", color: "#3B7DD8" },
  { id: 4, name: "Maison", icon: "🛋️", color: "#9B59B6" },
  // ... autres catégories
];

function HomePage({ addToCart }) {
  const [annonces, setAnnonces] = useState([]);

  // Charger les vraies annonces depuis ton API Java
  useEffect(() => {
    getAnnonces().then(data => setAnnonces(data));
  }, []);

  return (
    <>
      {/* 1. Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Achetez, vendez,<br />
            <span style={styles.heroHighlight}>près de chez vous.</span>
          </h1>
          <p style={styles.heroSub}>
            Des milliers d'annonces vous attendent sur YOUM'S S.A COMPANY
          </p>
          <div style={{display:'flex', gap:16, justifyContent:'center'}}>
            <Link to="/deposer" style={styles.btnDeposer}>Déposer une annonce gratuite</Link>
          </div>
        </div>
      </section>

      {/* 2. Catégories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.titleBar} /> Catégories populaires
        </h2>
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12}}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{display:'flex', flexDirection:'column', alignItems:'center', padding:16, border:'1px solid #E8E4DE', borderRadius:16, background:'#fff', cursor:'pointer'}}>
              <span style={{fontSize:24}}>{cat.icon}</span>
              <span style={{fontSize:12, fontWeight:600, marginTop:8}}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Grille d'annonces (Venant de ton API Java) */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.titleBar} /> Dernières annonces
        </h2>
        
        <div style={styles.grid}>
          {annonces.length === 0 ? (
            <p>Chargement des annonces...</p>
          ) : (
            annonces.map(annonce => (
              <div key={annonce.id} style={styles.card}>
                <Link to={`/annonce/${annonce.id}`} style={{textDecoration:'none', color:'inherit'}}>
                  <div style={{position:'relative', height: 200, background: '#f0ece6'}}>
                     {annonce.imageUrl ? (
                        <img src={annonce.imageUrl} alt={annonce.titre} style={styles.cardImg} />
                     ) : (
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:40, color:'#ddd'}}>📷</div>
                     )}
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{annonce.titre}</h3>
                    <p style={styles.cardPrice}>{annonce.prix} €</p>
                    <div style={{fontSize: 12, color: "#999", marginTop: 8}}>📍 {annonce.city || "France"}</div>
                  </div>
                </Link>
                {/* Bouton Panier Rapide */}
                <button 
                  onClick={(e) => { e.preventDefault(); addToCart(annonce); }}
                  style={{margin: '0 16px 16px', padding: '8px', background:'#E8553A', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:'bold'}}
                >
                  Ajouter au panier 🛒
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default HomePage;