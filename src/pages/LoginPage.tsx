import { useState, FC, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, User, UserCredentials } from '../services/api';
import { styles } from '../styles/theme';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserCredentials>({ email: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(form);
      onLogin(user);
      navigate('/');
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formPage}>
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Connexion</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 14 }}>
          Content de vous revoir !
        </p>

        {error && (
          <div style={{ background: '#FFF0EE', border: '1px solid #FFCDC7', borderRadius: 10, padding: '12px 16px', color: '#C0392B', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" required placeholder="votre@email.com"
              value={form.email} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input type="password" name="motDePasse" required placeholder="••••••••"
              value={form.motDePasse} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ padding: '14px', fontSize: 16, marginTop: 4 }}>
            {loading ? '⏳ Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
          Pas encore de compte ?{' '}
          <span style={{ color: '#E8553A', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/register')}>
            S'inscrire gratuitement
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
