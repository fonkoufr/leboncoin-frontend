import { useEffect, useState, useRef, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAnnonces, Annonce } from '../services/api';
import { styles } from '../styles/theme';
import { useCart } from '../context/CartContext';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'Véhicules',  name: 'Véhicules',  icon: '🚗' },
  { id: 'Immobilier', name: 'Immobilier', icon: '🏠' },
  { id: 'Multimédia', name: 'Multimédia', icon: '📱' },
  { id: 'Maison',     name: 'Maison',     icon: '🛋️' },
];

const SLIDES = [
  {
    title1: 'Achetez, vendez,',
    title2: 'près de chez vous.',
    sub: "Des milliers d'annonces vous attendent sur YOUM'S S.A",
    bg: 'linear-gradient(135deg, #2D2A26 0%, #4A3728 50%, #5C3D2E 100%)',
    glow: 'rgba(232,85,58,0.18)',
    accent: '#E8553A',
  },
  {
    title1: 'Trouvez votre',
    title2: 'prochaine voiture.',
    sub: 'Véhicules de particuliers et professionnels — achetez en toute confiance.',
    bg: 'linear-gradient(135deg, #0F1B2D 0%, #1B3A5E 50%, #1D3461 100%)',
    glow: 'rgba(74,158,255,0.15)',
    accent: '#4A9EFF',
  },
  {
    title1: "L'immobilier",
    title2: 'à portée de clic.',
    sub: 'Maisons, appartements, terrains — trouvez le bien qui vous correspond.',
    bg: 'linear-gradient(135deg, #0F1F0F 0%, #1E4620 50%, #1A3A1C 100%)',
    glow: 'rgba(76,175,80,0.15)',
    accent: '#5CB85C',
  },
];

const FLOAT_BADGES = [
  { emoji: '🚗', label: 'Véhicules',  top: '18%', left: '6%',  cls: 'float-badge-a' },
  { emoji: '🏠', label: 'Immobilier', top: '60%', left: '4%',  cls: 'float-badge-b' },
  { emoji: '📱', label: 'Multimédia', top: '25%', right: '5%', cls: 'float-badge-c' },
  { emoji: '🛋️', label: 'Maison',     top: '65%', right: '6%', cls: 'float-badge-d' },
  { emoji: '✅', label: 'Gratuit',    top: '80%', left: '20%', cls: 'float-badge-e' },
];

const STATS = [
  { value: '5 000+', label: 'Annonces actives' },
  { value: '100%',   label: 'Gratuit à déposer' },
  { value: '< 2min', label: 'Pour publier' },
  { value: '🔒',     label: 'Sécurisé' },
];

const SLIDE_DURATION = 5000;

interface HomePageProps {
  searchQuery?: string;
}

const SkeletonCard: FC = () => (
  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E4DE' }}>
    <div className="skeleton" style={{ height: 200 }} />
    <div style={{ padding: 16 }}>
      <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 22, width: '60%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '40%' }} />
    </div>
  </div>
);

const HomePage: FC<HomePageProps> = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleAddToCart = (e: React.MouseEvent, annonce: Annonce) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(annonce);
    setAddedId(annonce.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const goToSlide = (idx: number) => {
    setSlide(idx);
    setSlideKey(k => k + 1);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
      setSlideKey(k => k + 1);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    getAnnonces().then(data => {
      setAnnonces(data);
      setLoading(false);
    });
    intervalRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
      setSlideKey(k => k + 1);
    }, SLIDE_DURATION);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const filtered = annonces.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || [a.titre, a.description, a.ville, a.categorie]
      .some(field => field?.toLowerCase().includes(q));
    const matchCat = !activeCategory || a.categorie === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <>
      {/* ── Hero Carousel ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: SLIDES[slide].bg, transition: 'background 0.8s ease', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 50%, ${SLIDES[slide].glow} 0%, transparent 65%)`, transition: 'background 0.8s', pointerEvents: 'none' }} />

        {/* Floating badges */}
        {FLOAT_BADGES.map((b, i) => (
          <span key={i} className={`float-badge ${b.cls}`}
            style={{ top: b.top, left: (b as any).left, right: (b as any).right }}>
            {b.emoji} {b.label}
          </span>
        ))}

        {/* Slide content */}
        <div key={slideKey} style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', textAlign: 'center', animation: 'slideHero 0.6s ease' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
            {SLIDES[slide].title1}<br />
            <span style={{ color: SLIDES[slide].accent }}>{SLIDES[slide].title2}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 'clamp(14px, 2vw, 18px)', marginBottom: 32, maxWidth: 540, lineHeight: 1.6 }}>
            {SLIDES[slide].sub}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/deposer" className="hero-cta" style={{ background: SLIDES[slide].accent }}>
              ✏️ Déposer une annonce gratuite
            </Link>
            <button className="btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
              onClick={() => document.getElementById('annonces-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir les annonces ↓
            </button>
          </div>
        </div>

        {/* Progress bar + Dots */}
        <div style={{ position: 'relative', zIndex: 3, padding: '0 0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {/* Progress bar */}
          <div style={{ width: 180, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
            <div key={`bar-${slideKey}`} style={{ height: '100%', background: SLIDES[slide].accent, borderRadius: 4, animation: `progress ${SLIDE_DURATION}ms linear` }} />
          </div>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)}
                style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', background: i === slide ? SLIDES[slide].accent : 'rgba(255,255,255,0.3)', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E8E4DE' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i < STATS.length - 1 ? '1px solid #F0EBE4' : 'none', animation: `countIn 0.5s ease ${i * 0.1}s both` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#2D2A26', fontFamily: "'DM Sans', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.titleBar} /> Catégories
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          <div
            className={`cat-chip${activeCategory === null ? ' active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            <span style={{ fontSize: 22 }}>🏷️</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Toutes</span>
          </div>
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className={`cat-chip${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Annonces ── */}
      <section id="annonces-section" style={{ ...styles.section, paddingTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.titleBar} />
            {activeCategory ? activeCategory : 'Dernières annonces'}
          </h2>
          {!loading && (
            <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>
              {filtered.length} annonce{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="grid-annonces" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 24px', color: '#999' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: '#666', marginBottom: 8 }}>Aucune annonce trouvée</p>
              <p style={{ fontSize: 14 }}>Essayez d'autres mots-clés ou{' '}
                <span style={{ color: '#E8553A', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/deposer')}>
                  déposez la première annonce
                </span>
              </p>
            </div>
          ) : (
            filtered.map((annonce, idx) => (
              <div
                key={annonce.id}
                className="annonce-card card-anim"
                style={{ animationDelay: `${(idx % 8) * 0.07}s`, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                onClick={() => navigate(`/annonce/${annonce.id}`)}
              >
                <div className="card-img-wrap">
                  {annonce.imageUrl ? (
                    <img
                      src={annonce.imageUrl}
                      alt={annonce.titre}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40, color: '#ccc' }}>📷</div>
                  )}
                  {annonce.urgent && (
                    <span className="badge-urgent" style={{ position: 'absolute', top: 10, left: 10 }}>
                      🔥 Urgent
                    </span>
                  )}
                </div>

                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {annonce.categorie && <span className="badge-cat">{annonce.categorie}</span>}
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#2D2A26', lineHeight: 1.3 }}>{annonce.titre}</h3>
                  <span className="card-price">
                    {annonce.prix.toLocaleString('fr-FR')} €
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#999' }}>📍 {annonce.ville || 'France'}</span>
                    {annonce.datePublication && (
                      <span style={{ fontSize: 11, color: '#bbb' }}>
                        {new Date(annonce.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>

                  {/* Bouton panier */}
                  <button
                    onClick={e => handleAddToCart(e, annonce)}
                    style={{
                      marginTop: 'auto',
                      width: '100%', padding: '9px 12px',
                      background: addedId === annonce.id ? '#22c55e' : '#E8553A',
                      color: '#fff', border: 'none', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {addedId === annonce.id ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Banner CTA ── */}
      {!loading && annonces.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg, #2D2A26, #4A3728)', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              Vous avez quelque chose à vendre ?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 28 }}>
              Déposez votre annonce en moins de 2 minutes, c'est gratuit.
            </p>
            <Link to="/deposer" className="hero-cta">✏️ Déposer une annonce</Link>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;
