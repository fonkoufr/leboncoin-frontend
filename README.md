# LeBonCoin Frontend

Application React moderne avec Vite pour la plateforme LeBonCoin.

## 📋 Stack Technologique

- **React 19** - Librairie UI
- **Vite 7** - Build tool ultrarapide
- **React Router v7** - Routage client
- **TypeScript** - Type safety
- **Vitest** - Framework de tests
- **ESLint** - Linting & Code Quality

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm 9+

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev          # Démarre dev server (http://localhost:5173)
npm run lint         # Vérifie qualité du code
npm run lint:fix     # Corrige automatiquement
npm run type-check   # Vérification TypeScript
npm run test         # Exécute les tests
npm run test:ui      # Interface tests interactive
npm run test:coverage # Génère coverage report
```

### Production
```bash
npm run build        # Build optimisé → dist/
npm run preview      # Prévisualise la build
```

## 📁 Structure du Projet

```
src/
├── components/      # Composants réutilisables (Navbar, AnnonceCard, etc.)
├── pages/          # Pages complètes (Home, Details, etc.)
├── services/       # Appels API et logique métier
├── styles/         # Fichiers CSS/styles globaux
├── assets/         # Images, icônes, fonts
├── test/           # Configuration tests
├── App.jsx         # Composant racine
└── main.jsx        # Point d'entrée
```

## 🧪 Tests

### Exécuter les tests
```bash
npm run test              # Mode watch
npm run test:ui           # Dashboard interactif
npm run test:coverage     # Couverture (target: 70%+)
```

### Écrire des tests
```javascript
// src/components/Navbar.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('should render navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText(/home/i)).toBeInTheDocument()
  })
})
```

## 🔗 API Integration

Backend API: `http://localhost:8080/api`

```javascript
// src/services/api.js
const API_BASE = 'http://localhost:8080/api'

export async function fetchAnnonces() {
  const response = await fetch(`${API_BASE}/annonces`)
  return response.json()
}
```

## 📦 Bundle Optimization

Vite génère un rapport `dist/stats.html` après chaque build montrant la taille du bundle.

Target actuel: < 50KB gzip

## 🛠️ Alias d'Import

```javascript
// Au lieu de: ../../../components/Navbar
import Navbar from '@components/Navbar'

// Aliases disponibles:
// @components - src/components
// @pages     - src/pages
// @services  - src/services
// @styles    - src/styles
```

## 📝 Commits & PR

- Branch `main` - Production
- Branch `dev` - Développement
- Les PRs doivent passer linting, tests, et type-check

## 🚨 Ressources

- [Vite Docs](https://vite.dev/)
- [React Docs](https://react.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 📊 Métriques Cibles

| Métrique | Target |
|----------|--------|
| Bundle Size (gzip) | < 50KB |
| Test Coverage | 70%+ |
| TypeScript Strict | ✅ |
| Lighthouse Score | > 80 |
| LCP (Largest Contentful Paint) | < 2.5s |

---

**Dernière mise à jour**: 2026-06-10 | Mainteneur: Équipe Dev
