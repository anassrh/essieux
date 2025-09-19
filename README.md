# 🚂 Gestion des Essieux - EMSI

Application web moderne de gestion du parc d'essieux développée avec Next.js 14, TypeScript, Tailwind CSS et Supabase.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec Supabase Auth
- 📊 **Dashboard interactif** avec métriques en temps réel
- 🚂 **Gestion complète des essieux** (CRUD avec modal par sections)
- 👷 **Gestion des techniciens** avec suivi des compétences
- 📦 **Gestion du stock** avec alertes de seuil
- 🔧 **Suivi des pannes** et interventions
- 📱 **Interface responsive** et moderne
- 📈 **Graphiques et statistiques** avancés

## 🛠️ Technologies

- **Frontend** : Next.js 14, TypeScript, Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Real-time)
- **Déploiement** : Vercel
- **Base de données** : PostgreSQL via Supabase

## 🚀 Installation rapide

```bash
# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
cd essieux-management

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# Démarrer en développement
npm run dev
```

## 📋 Configuration Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Configurer les variables d'environnement :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. Exécuter les migrations SQL dans `supabase/migrations/`

## 🎯 Pages principales

- **Dashboard** (`/`) - Vue d'ensemble avec métriques
- **Essieux** (`/essieux`) - Gestion du parc d'essieux
- **Travailleurs** (`/travailleurs`) - Gestion des techniciens
- **Stock** (`/stock`) - Gestion des pièces de rechange
- **Pannes** (`/pannes`) - Suivi des interventions

## 📱 Interface utilisateur

- **Design moderne** avec gradient et animations
- **Modal par sections** pour les formulaires
- **Tableaux professionnels** avec tri et filtres
- **Responsive design** pour mobile et desktop
- **Logos EMSI** intégrés

## 🔒 Sécurité

- Authentification JWT via Supabase
- Routes protégées
- Validation des données côté client et serveur
- Politiques RLS (Row Level Security)

## 📊 Fonctionnalités avancées

- Export CSV des données
- Recherche et filtres avancés
- Pagination intelligente
- Gestion d'erreurs complète
- États de chargement
- Notifications utilisateur

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes

- **Netlify** : Compatible avec Next.js
- **Railway** : Avec base de données intégrée
- **Heroku** : Avec buildpacks Node.js

## 📖 Documentation

- [Guide d'installation détaillé](GUIDE.md)
- [Configuration Supabase](README_SUPABASE.md)
- [Variables d'environnement](env.example)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé par l'équipe EMSI - École Marocaine des Sciences de l'Ingénieur

---

**Made with ❤️ by EMSI Team**