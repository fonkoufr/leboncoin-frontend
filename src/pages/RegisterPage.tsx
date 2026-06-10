import { useState, FC, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, UserRegister } from '../services/api';
import { styles } from '../styles/theme';

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserRegister>({ nom: '', email: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser(form);
      setSuccess(`Bienvenue ${form.nom} ! Votre compte a été créé.`);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cet email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formPage}>
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Créer un compte</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 14 }}>
          Rejoignez la communauté YOUM'S S.A
        </p>

        {error && (
          <div style={{ background: '#FFF0EE', border: '1px solid #FFCDC7', borderRadius: 10, padding: '12px 16px', color: '#C0392B', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#F0FFF8', border: '1px solid #A8E6CF', borderRadius: 10, padding: '12px 16px', color: '#1D8A5B', fontSize: 14, marginBottom: 20, textAlign: 'center', fontWeight: 600 }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nom complet</label>
            <input type="text" name="nom" required placeholder="Jean Dupont"
              value={form.nom} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" required placeholder="jean@mail.com"
              value={form.email} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input type="password" name="motDePasse" required minLength={6}
              placeholder="Au moins 6 caractères"
              value={form.motDePasse} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          <button type="submit" disabled={loading || !!success} className="btn-primary"
            style={{ padding: '14px', fontSize: 16, marginTop: 4 }}>
            {loading ? '⏳ Création...' : 'Créer mon compte gratuit'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
          Déjà un compte ?{' '}
          <span style={{ color: '#E8553A', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/login')}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
