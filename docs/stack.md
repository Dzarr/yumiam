# Stack technique

## Framework principal
- **React** 19.1.0 + TypeScript 5.8.3
- **Vite** 7.0.4 (bundler et dev server)
- **ESLint** 9.30.1 (linting)

## CSS et Design System
- **Tailwind CSS v4** (mode CSS-first avec tokens)
- **ShadCN/UI** (composants UI réutilisables)
- **Lucide React** (icônes)

## Backend et Base de données
- **Supabase** (Auth + Database + Real-time)
  - PostgreSQL (base de données)
  - Row Level Security (RLS)
  - Policies RBAC

## State Management et Data Fetching
- **React Query (TanStack Query)** (gestion des requêtes et cache)
- **React Context** (état global)

## Animations et Interactions
- **Framer Motion** (animations UI)
- **@dnd-kit** (drag & drop)

## Notifications et UX
- **Sonner** (toasts et notifications)

## Outils de développement
- **TypeScript** (typage statique)
- **ESLint** (qualité de code)
- **Vite** (HMR et build optimisé)

## Architecture
- **CSS-first** avec tokens centralisés
- **Component-based** avec ShadCN
- **Hook-based** pour la logique métier
- **RBAC** pour les permissions utilisateur

## Conventions
- Composants en PascalCase
- Hooks avec préfixe `use`
- Tokens CSS dans `styles/tokens.css`
- Tests avec Vitest + Testing Library 