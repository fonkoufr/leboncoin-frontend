import { useEffect, useState, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnnonceById, Annonce } from '../services/api';

const AnnonceDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAnnonceById(id)
      .then(data => setAnnonce(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 16, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 40, width: '30%', marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 120 }} />
      </div>
    );
  }

  if (!annonce) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 12 }}>
          Annonce introuvable
        </h2>
        <p style={{ color: '#888', marginBottom: 24 }}>Cette annonce n'existe plus ou a été supprimée.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>← Retour aux annonces</button>
      </div>
    );
  }

  const hasContact = annonce.telephone || annonce.email;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
      {/* Breadcrumb */}
      <button className="btn-ghost" style={{ marginBottom: 20, fontSize: 13 }} onClick={() => navigate('/')}>
        ← Retour aux annonces
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

        {/* Left: Image + Description */}
        <div>
          {/* Image */}
          <div style={{ borderRadius: 20, overflow: 'hidden', background: '#F5F0EB', marginBottom: 24, position: 'relative' }}>
            {annonce.imageUrl && !imgError ? (
              <img
                src={annonce.imageUrl}
                alt={annonce.titre}
                style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, color: '#ccc', flexDirection: 'column', gap: 8 }}>
                📷
                <span style={{ fontSize: 13, color: '#bbb' }}>Aucune photo disponible</span>
              </div>
            )}
            {annonce.urgent && (
              <span className="badge-urgent" style={{ position: 'absolute', top: 14, left: 14, fontSize: 12 }}>
                🔥 Urgent
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E8E4DE' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#2D2A26' }}>
              Description
            </h3>
            {annonce.description ? (
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#444', whiteSpace: 'pre-wrap' }}>
                {annonce.description}
              </p>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>Aucune description fournie.</p>
            )}
          </div>
        </div>

        {/* Right: Info card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Main info */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #E8E4DE', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {annonce.categorie && (
              <span className="badge-cat" style={{ marginBottom: 12, display: 'inline-block' }}>
                {annonce.categorie}
              </span>
            )}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: '#2D2A26', lineHeight: 1.3, marginBottom: 12 }}>
              {annonce.titre}
            </h1>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#E8553A', marginBottom: 16 }}>
              {annonce.prix.toLocaleString('fr-FR')} €
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid #F0EBE4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666' }}>
                <span>📍</span>
                <span>{annonce.ville || 'France'}</span>
              </div>
              {annonce.datePublication && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#888' }}>
                  <span>📅</span>
                  <span>Publié le {new Date(annonce.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #E8E4DE' }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#2D2A26' }}>
              Contacter le vendeur
            </h3>

            {!hasContact ? (
              <p style={{ color: '#aaa', fontSize: 13, fontStyle: 'italic' }}>Coordonnées non renseignées.</p>
            ) : contactVisible ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {annonce.telephone && (
                  <a href={`tel:${annonce.telephone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#F5F0EB', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#2D2A26', textDecoration: 'none' }}>
                    📞 {annonce.telephone}
                  </a>
                )}
                {annonce.email && (
                  <a href={`mailto:${annonce.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#F5F0EB', borderRadius: 12, fontSize: 14, color: '#555', textDecoration: 'none', wordBreak: 'break-all' }}>
                    ✉️ {annonce.email}
                  </a>
                )}
              </div>
            ) : (
              <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}
                onClick={() => setContactVisible(true)}>
                📞 Voir les coordonnées
              </button>
            )}
          </div>

          {/* Safety tip */}
          <div style={{ background: '#FFFBF0', borderRadius: 16, padding: 16, border: '1px solid #F5E6A3' }}>
            <p style={{ fontSize: 12, color: '#8A7040', lineHeight: 1.6 }}>
              💡 <strong>Conseils de sécurité :</strong> Préférez les rencontres dans un lieu public et ne payez qu'après avoir vu l'article.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnonceDetailPage;
