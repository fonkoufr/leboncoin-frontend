// src/styles/theme.ts

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #FAF7F2; color: #2D2A26; -webkit-font-smoothing: antialiased; }
  
  /* Scrollbar */
  ::-webkit-scrollbar { height: 6px; width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }

  /* Animations */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Responsive Helpers */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
  }
`;

export const styles = {
  app: { minHeight: "100vh", display: "flex", flexDirection: "column" as const, fontFamily: "'DM Sans', sans-serif", background: "#FAF7F2" },
  main: { flex: 1 },

  // Navbar
  navbar: { position: "sticky" as const, top: 0, zIndex: 1000, background: "#fff", borderBottom: "1px solid #E8E4DE", padding: "0 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  navInner: { maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 16, flexWrap: "wrap" as const, justifyContent: "space-between" },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#2D2A26", cursor: "pointer", whiteSpace: "nowrap" as const, letterSpacing: "-0.5px", textDecoration: "none" },
  logoAccent: { color: "#E8553A" },
  
  // Search
  searchBox: { position: "relative" as const, flex: 1, maxWidth: 520, margin: "0 20px" },
  searchIcon: { position: "absolute" as const, left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" as const },
  searchInput: { width: "100%", padding: "10px 40px 10px 42px", borderRadius: 12, border: "2px solid #E8E4DE", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#FAF7F2", transition: "border-color 0.2s" },

  // Buttons
  navRight: { display: "flex", alignItems: "center", gap: 8 },
  btnDeposer: { display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12, border: "none", background: "#E8553A", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", transition: "transform 0.15s, background 0.2s", whiteSpace: "nowrap" as const },
  btnPlus: { fontSize: 18, fontWeight: 300, lineHeight: 1 },
  
  // Hero
  hero: { position: "relative" as const, background: "linear-gradient(135deg, #2D2A26 0%, #4A3728 50%, #5C3D2E 100%)", padding: "100px 24px 140px", textAlign: "center" as const, overflow: "hidden" },
  heroOverlay: { position: "absolute" as const, inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(232,85,58,0.15) 0%, transparent 60%)", pointerEvents: "none" as const },
  heroContent: { position: "relative" as const, zIndex: 1, maxWidth: 700, margin: "0 auto", animation: "fadeInUp 0.8s ease" },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: "3.2rem", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-1px" },
  heroHighlight: { color: "#E8553A", display: "inline-block" as const },
  heroSub: { color: "rgba(255,255,255,0.7)", fontSize: 18, marginBottom: 32, lineHeight: 1.6 },
  
  // Sections
  section: { maxWidth: 1280, margin: "0 auto", padding: "48px 24px" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#2D2A26", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 },
  titleBar: { width: 4, height: 28, background: "#E8553A", borderRadius: 2, display: "inline-block", flexShrink: 0 },
  
  // Cards
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 },
  card: { background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E4DE", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease", display: "flex", flexDirection: "column" as const },
  cardImg: { width: "100%", height: 200, objectFit: "cover" as const },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#2D2A26", marginBottom: 6 },
  cardPrice: { fontSize: 18, fontWeight: 700, color: "#E8553A", marginBottom: 8 },

  // Footer
  footer: { background: "#2D2A26", padding: "60px 24px 24px", color: "#fff", marginTop: "auto" },
  footerBottom: { borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 48, padding: "24px 0", textAlign: "center" as const, fontSize: 13, color: "rgba(255,255,255,0.3)" },

  // Forms
  formPage: { maxWidth: 1280, margin: "0 auto", padding: "24px", display: "flex" as const, flexDirection: "column" as const, justifyContent: "center", alignItems: "center", minHeight: "80vh" },
  formContainer: { width: "100%", maxWidth: 500, background: "#fff", borderRadius: 24, padding: "40px", border: "1px solid #E8E4DE", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, marginBottom: 10, textAlign: "center" as const },
  form: { display: "flex", flexDirection: "column" as const, gap: 20 },
  fieldGroup: { display: "flex", flexDirection: "column" as const, gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#2D2A26" },
  input: { padding: "12px", borderRadius: 10, border: "2px solid #E8E4DE", background: "#FAF7F2", fontSize: 14, outline: "none", fontFamily: "inherit" },
  submitBtn: { padding: "14px", borderRadius: 14, border: "none", background: "#E8553A", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "0.2s" },
};
