import { useState, FC, ChangeEvent, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnonce } from '../services/api';
import type { User } from '../services/api';
import { styles } from '../styles/theme';

interface PostForm {
  titre: string;
  prix: string;
  imageUrl: string;
  description: string;
  categorie: string;
  ville: string;
  email: string;
  telephone: string;
  urgent: boolean;
}

interface PostAnnoncePageProps {
  user?: User | null;
}

const CATEGORIES = ['Véhicules', 'Immobilier', 'Multimédia', 'Maison'];

const compressImage = (file: File, maxPx = 800, quality = 0.75): Promise<string> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

const PostAnnoncePage: FC<PostAnnoncePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<PostForm>({
    titre: '', prix: '', imageUrl: '', description: '',
    categorie: '', ville: '', email: user?.email ?? '', telephone: '', urgent: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const target = e.currentTarget as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm(prev => ({ ...prev, [target.name]: value }));
  };

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Image trop lourde (max 10 Mo).');
      return;
    }
    setImageLoading(true);
    setError('');
    try {
      const base64 = await compressImage(file);
      setForm(prev => ({ ...prev, imageUrl: base64 }));
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createAnnonce({
        titre: form.titre.trim(),
        description: form.description.trim(),
        prix: parseFloat(form.prix),
        ville: form.ville.trim(),
        categorie: form.categorie || undefined,
        imageUrl: form.imageUrl || undefined,
        telephone: form.telephone.trim() || undefined,
        email: form.email.trim() || undefined,
        urgent: form.urgent,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ titre: '', prix: '', imageUrl: '', description: '', categorie: '', ville: '', email: user?.email ?? '', telephone: '', urgent: false });
    if (fileRef.current) fileRef.current.value = '';
  };

  if (submitted) {
    return (
      <div style={styles.formPage}>
        <div style={{ ...styles.formContainer, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ ...styles.formTitle, color: '#1D8A5B' }}>Annonce publiée !</h2>
          <p style={{ color: '#666', marginBottom: 28, lineHeight: 1.6 }}>
            Votre annonce est en ligne et visible par tous les acheteurs.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/')}>Voir les annonces</button>
            <button className="btn-ghost" onClick={resetForm}>Nouvelle annonce</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
      <button className="btn-ghost" style={{ marginBottom: 24 }} onClick={() => navigate('/')}>
        ← Annuler
      </button>

      <div style={styles.formContainer}>
        <h1 style={{ ...styles.formTitle, color: '#E8553A', marginBottom: 6 }}>Déposer une annonce</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 28, fontSize: 14 }}>Gratuit · En ligne en 2 minutes</p>

        {error && (
          <div style={{ background: '#FFF0EE', border: '1px solid #FFCDC7', borderRadius: 10, padding: '12px 16px', color: '#C0392B', fontSize: 14, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Titre */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Titre de l'annonce *</label>
            <input type="text" name="titre" required minLength={3} maxLength={200}
              placeholder="Ex: iPhone 14 Pro 256Go noir" value={form.titre}
              onChange={handleChange} style={styles.input} className="form-input" />
          </div>

          {/* Prix + Catégorie */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Prix (€) *</label>
              <input type="number" name="prix" required min={0.01} step="0.01"
                placeholder="0.00" value={form.prix} onChange={handleChange}
                style={styles.input} className="form-input" />
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Catégorie</label>
              <select name="categorie" value={form.categorie} onChange={handleChange}
                style={styles.input} className="form-input">
                <option value="">Choisir...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Ville */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Ville *</label>
            <input type="text" name="ville" required minLength={2} maxLength={100}
              placeholder="Paris, Lyon, Marseille..." value={form.ville}
              onChange={handleChange} style={styles.input} className="form-input" />
          </div>

          {/* Description */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea name="description" rows={4} minLength={10} maxLength={2000}
              placeholder="Décrivez votre article : état, caractéristiques, raison de la vente..."
              value={form.description} onChange={handleChange}
              style={{ ...styles.input, resize: 'vertical' }} className="form-input" />
          </div>

          {/* Photo upload */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Photo</label>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #E8E4DE',
                borderRadius: 14,
                padding: form.imageUrl ? 0 : '32px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: form.imageUrl ? 'transparent' : '#FAF7F2',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8553A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E4DE')}
            >
              {imageLoading ? (
                <div style={{ padding: '32px 16px', color: '#999', fontSize: 14 }}>
                  ⏳ Compression en cours...
                </div>
              ) : form.imageUrl ? (
                <>
                  <img
                    src={form.imageUrl}
                    alt="Aperçu"
                    style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <button
                      type="button"
                      onClick={ev => { ev.stopPropagation(); setForm(p => ({ ...p, imageUrl: '' })); if (fileRef.current) fileRef.current.value = ''; }}
                      style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                    >
                      ✕ Supprimer
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#666', marginBottom: 4 }}>
                    Cliquer pour ajouter une photo
                  </p>
                  <p style={{ fontSize: 12, color: '#aaa' }}>JPG, PNG, WEBP · max 10 Mo</p>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageFile}
            />
          </div>

          {/* Contact */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Téléphone</label>
            <input type="tel" name="telephone" placeholder="+33 6 12 34 56 78"
              value={form.telephone} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email de contact</label>
            <input type="email" name="email" placeholder="contact@email.com"
              value={form.email} onChange={handleChange}
              style={styles.input} className="form-input" />
          </div>

          {/* Urgent */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', border: '2px solid #E8E4DE', borderRadius: 12, transition: '0.2s' }}>
            <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: '#E8553A', cursor: 'pointer' }} />
            <span style={{ fontWeight: 700, color: '#E8553A', fontSize: 15 }}>🔥 Annonce urgente</span>
            <span style={{ fontSize: 12, color: '#888', marginLeft: 'auto' }}>Mise en avant</span>
          </label>

          <button type="submit" disabled={loading || imageLoading} className="btn-primary"
            style={{ padding: '16px', fontSize: 16, marginTop: 4 }}>
            {loading ? '⏳ Publication...' : '✅ Publier maintenant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostAnnoncePage;
