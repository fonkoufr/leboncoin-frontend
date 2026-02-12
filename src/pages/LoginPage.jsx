import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

// Styles intégrés (Identiques à RegisterPage pour la cohérence)
const styles = {
  formPage: { maxWidth: 1280, margin: "0 auto", padding: "24px", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  formContainer: { width: '100%', maxWidth: 400, background: "#fff", borderRadius: 24, padding: "40px", border: "1px solid #E8E4DE", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, marginBottom: 10, textAlign: 'center' },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#2D2A26" },
  input: { padding: "12px", borderRadius: 10, border: "2px solid #E8E4DE", background: "#FAF7F2", fontSize: 14, outline: "none" },
  submitBtn: { padding: "14px", borderRadius: 14, border: "none", background: "#E8553A", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "0.2s" },
  link: { color: '#E8553A', cursor: 'pointer', fontWeight: 'bold' }
};

// 👇 On récupère bien la fonction "onLogin" passée par App.jsx
function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", motDePasse: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Appel API vers Java
      const user = await loginUser(form);
      
      // 2. Mise à jour de l'état global dans App.jsx
      onLogin(user);
      
      // 3. Feedback et Redirection
      alert(`Bon retour parmi nous, ${user.nom} ! 👋`);
      navigate("/"); 

    } catch (err) {
      console.error(err);
      setError("Erreur : Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formPage}>
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Connexion</h1>
        <p style={{textAlign:'center', color:'#888', marginBottom:20}}>Accédez à votre espace</p>
        
        {error && <div style={{color:'red', textAlign:'center', fontWeight:'bold', marginBottom: 15, fontSize: 14}}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input 
                type="email" name="email" required 
                placeholder="votre@email.com" 
                value={form.email} onChange={handleChange} 
                style={styles.input} 
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input 
                type="password" name="motDePasse" required 
                placeholder="••••••••" 
                value={form.motDePasse} onChange={handleChange} 
                style={styles.input} 
            />
          </div>

          <button type="submit" disabled={loading} style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        
        <p style={{textAlign:'center', marginTop:20, fontSize:14, color: '#666'}}>
            Pas encore de compte ? <span style={styles.link} onClick={() => navigate('/register')}>S'inscrire</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;