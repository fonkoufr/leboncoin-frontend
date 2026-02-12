import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnonce } from '../services/api'; 
import { styles } from '../styles/theme';

function PostAnnoncePage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // État du formulaire
  const [form, setForm] = useState({
    titre: "",
    prix: "",
    imageUrl: "", 
    description: "",
    categorie: "",
    ville: "",
    email: "",
    telephone: "",
    urgent: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        console.log("🚀 Envoi vers l'API..."); 
        await createAnnonce(form);
        setSubmitted(true);
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de l'envoi : " + error.message);
    } finally {
        setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <span style={styles.successIcon}>✅</span>
          <h2 style={styles.successTitle}>Annonce publiée !</h2>
          <p style={styles.successText}>Votre annonce est enregistrée.</p>
          <button style={styles.heroCta} onClick={() => navigate('/')}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.formPage}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>← Annuler</button>
      
      <div style={styles.formContainer}>
        <h1 style={{...styles.formTitle, color: '#E8553A'}}>Déposer une annonce</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
            
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Titre *</label>
                <input type="text" name="titre" required placeholder="Ex: iPhone..." value={form.titre} onChange={handleChange} style={styles.input} />
            </div>

            <div style={{display:'flex', gap:10}}>
                <div style={{...styles.fieldGroup, flex:1}}>
                    <label style={styles.label}>Prix (€) *</label>
                    <input type="number" name="prix" required value={form.prix} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{...styles.fieldGroup, flex:1}}>
                    <label style={styles.label}>Catégorie</label>
                    <select name="categorie" value={form.categorie} onChange={handleChange} style={styles.input}>
                        <option value="">Choisir...</option>
                        <option value="Véhicules">Véhicules</option>
                        <option value="Immobilier">Immobilier</option>
                        <option value="Multimédia">Multimédia</option>
                        <option value="Maison">Maison</option>
                    </select>
                </div>
            </div>

            <div style={styles.fieldGroup}>
                <label style={styles.label}>Ville *</label>
                <input type="text" name="ville" required value={form.ville} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.fieldGroup}>
                <label style={styles.label}>Photo (URL Google Image)</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  placeholder="Collez le lien ici" 
                  value={form.imageUrl} 
                  onChange={handleChange} 
                  style={styles.input} 
                />
                <p style={{fontSize: '11px', color: '#666', marginTop: '5px'}}>
                   Clic droit sur l'image "Copier l'adresse de l'image"
                </p>
            </div>

            <div style={styles.fieldGroup}>
                <label style={styles.label}>Description</label>
                <textarea name="description" rows="4" value={form.description} onChange={handleChange} style={{...styles.input, resize:'vertical'}} />
            </div>

            <label style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer'}}>
                <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange} />
                <span style={{fontWeight:'bold', color:'#E8553A'}}>Urgent 🔥</span>
            </label>

            <button type="submit" disabled={loading} style={{...styles.submitBtn, opacity: loading ? 0.7 : 1, marginTop: '20px'}}>
                {loading ? "Envoi..." : "Publier maintenant"}
            </button>
        </form>
      </div>
    </div>
  );
}

export default PostAnnoncePage;