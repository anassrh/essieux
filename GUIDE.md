# 🚀 Guide d'Installation - Application Gestion des Essieux

## 📋 Prérequis

Avant de commencer, assurez-vous que votre système a les prérequis suivants :

### 🔧 Outils obligatoires

1. **Node.js** (version 18 ou supérieure)
   - Télécharger depuis : https://nodejs.org/
   - Vérifier l'installation : `node --version`
   - Vérifier npm : `npm --version`

2. **Git** (pour cloner le projet)
   - Télécharger depuis : https://git-scm.com/
   - Vérifier l'installation : `git --version`

3. **Un éditeur de code** (recommandé)
   - VS Code : https://code.visualstudio.com/
   - Ou tout autre éditeur supportant TypeScript

## 🚀 Installation du Projet

### Étape 1 : Cloner le Projet

```bash
# Cloner le repository (remplacer par votre URL)
git clone [URL_DU_REPOSITORY]
cd essieux
```

### Étape 2 : Installer les Dépendances

```bash
# Installer toutes les dépendances npm
npm install
```

### Étape 3 : Configuration Supabase

1. **Créer un compte Supabase** :
   - Aller sur https://supabase.com
   - Créer un compte gratuit
   - Créer un nouveau projet

2. **Récupérer les clés API** :
   - Dans le dashboard Supabase → Settings → API
   - Copier :
     - Project URL
     - anon public key
     - service_role key

3. **Créer le fichier d'environnement** :
```bash
# Créer le fichier .env.local
cp env.example .env.local
```

4. **Configurer les variables d'environnement** :
   - Ouvrir `.env.local`
   - Remplacer les valeurs par vos clés Supabase :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Database Configuration
DATABASE_URL=https://votre-projet.supabase.co
```

### Étape 4 : Configuration de la Base de Données

1. **Aller dans l'éditeur SQL de Supabase** :
   - Dashboard → SQL Editor

2. **Exécuter la requête de création de table** :

```sql
-- Créer la table essieux avec toutes les colonnes de la page
CREATE TABLE essieux (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    serie INTEGER NOT NULL,
    post INTEGER NOT NULL,
    numero_ordre VARCHAR(50) NOT NULL UNIQUE,
    date_rev VARCHAR(20) NOT NULL,
    mise_sce_rmt VARCHAR(20) NOT NULL,
    d_roue INTEGER NOT NULL,
    wagon VARCHAR(50) NOT NULL,
    bogie1 INTEGER NOT NULL,
    bogie2 INTEGER NOT NULL,
    situation VARCHAR(20) CHECK (situation IN ('EN EXPLOITATION', 'DEMANDE') OR situation IS NULL),
    age_revision_jours VARCHAR(50) NOT NULL,
    age_calage_annee INTEGER NOT NULL,
    marque VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_essieux_situation ON essieux(situation);
CREATE INDEX idx_essieux_serie ON essieux(serie);
CREATE INDEX idx_essieux_wagon ON essieux(wagon);
CREATE INDEX idx_essieux_marque ON essieux(marque);

-- Activer Row Level Security
ALTER TABLE essieux ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour les utilisateurs authentifiés
CREATE POLICY "Allow all operations for authenticated users" ON essieux
    FOR ALL USING (auth.role() = 'authenticated');
```

3. **Insérer les données de test** :

```sql
-- Insérer les données de test
INSERT INTO essieux (serie, post, numero_ordre, date_rev, mise_sce_rmt, d_roue, wagon, bogie1, bogie2, situation, age_revision_jours, age_calage_annee, marque) VALUES
(9101, 1, '11212', '15/3/24', '10/2/20', 896, '9310001', 843, 7, 'EN EXPLOITATION', '4ans2mois23jours', 18, 'SKF'),
(9102, 2, '22091', '20/3/24', '15/3/21', 900, '9310002', 467, 432, 'DEMANDE', '3ans1mois15jours', 20, 'TIMKEN'),
(9103, 3, '33123', '25/3/24', '20/4/22', 875, '9310003', 123, 456, 'EN EXPLOITATION', '2ans11mois5jours', 15, 'SKF'),
(9104, 4, '44234', '30/3/24', '25/5/23', 920, '9310004', 789, 321, 'EN EXPLOITATION', '1ans10mois5jours', 12, 'NSK'),
(9105, 1, '55345', '5/4/24', '30/6/23', 880, '9310005', 654, 987, 'DEMANDE', '1ans9mois5jours', 10, 'TIMKEN'),
(9106, 2, '66456', '10/4/24', '5/8/23', 905, '9310006', 147, 258, 'EN EXPLOITATION', '1ans8mois5jours', 8, 'SKF'),
(9107, 3, '77567', '15/4/24', '10/9/23', 890, '9310007', 369, 741, 'EN EXPLOITATION', '1ans7mois5jours', 6, 'NSK'),
(9108, 4, '88678', '20/4/24', '15/10/23', 915, '9310008', 852, 963, 'DEMANDE', '1ans6mois5jours', 4, 'TIMKEN'),
(9109, 1, '99789', '25/4/24', '20/11/23', 885, '9310009', 159, 357, 'EN EXPLOITATION', '1ans5mois5jours', 2, 'SKF'),
(9110, 2, '10890', '30/4/24', '25/12/23', 910, '9310010', 753, 951, 'EN EXPLOITATION', '1ans4mois5jours', 1, 'NSK');
```

## 🏃‍♂️ Lancement de l'Application

### Étape 1 : Démarrer le serveur de développement

```bash
# Démarrer l'application en mode développement
npm run dev
```

### Étape 2 : Accéder à l'application

- L'application sera disponible sur : `http://localhost:3000` (ou un autre port si 3000 est occupé)
- Ouvrir le navigateur et aller sur l'URL affichée dans le terminal

### Étape 3 : Créer un compte utilisateur

1. Sur la page de connexion, cliquer sur "S'inscrire"
2. Remplir le formulaire avec :
   - Email valide
   - Mot de passe (minimum 6 caractères)
   - Nom complet (optionnel)
3. Cliquer sur "S'inscrire"
4. Vérifier votre email (si la vérification est activée)
5. Se connecter avec vos identifiants

## 🔧 Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Langage de programmation typé
- **Tailwind CSS** - Framework CSS
- **React Hooks** - Gestion d'état

### Backend & Base de Données
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de données
- **Row Level Security** - Sécurité au niveau des lignes

### Packages NPM Installés
```json
{
  "@supabase/supabase-js": "Client Supabase",
  "@supabase/ssr": "Supabase SSR pour Next.js",
  "next": "Framework Next.js",
  "react": "Bibliothèque React",
  "typescript": "Support TypeScript"
}
```

## 🛠️ Commandes Utiles

### Développement
```bash
# Démarrer en mode développement
npm run dev

# Build de production
npm run build

# Démarrer en mode production
npm start

# Linter
npm run lint

# Type checking
npm run type-check
```

### Dépendances
```bash
# Installer toutes les dépendances
npm install

# Installer une nouvelle dépendance
npm install nom-du-package

# Installer une dépendance de développement
npm install --save-dev nom-du-package
```

## 🐛 Résolution de Problèmes

### Problème : Port déjà utilisé
```bash
# Solution : Utiliser un autre port
npm run dev -- -p 3001
```

### Problème : Erreur de connexion Supabase
- Vérifier que les clés dans `.env.local` sont correctes
- Vérifier que l'URL Supabase est accessible
- Vérifier que Row Level Security est configuré

### Problème : Erreur TypeScript
```bash
# Vérifier les types
npm run type-check

# Nettoyer le cache
rm -rf .next
npm run dev
```

### Problème : Dépendances manquantes
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📁 Structure du Projet

```
essieux/
├── src/
│   ├── app/                 # Pages Next.js
│   │   ├── page.tsx        # Dashboard
│   │   ├── essieux/        # Page des essieux
│   │   └── travailleurs/   # Page des travailleurs
│   ├── components/         # Composants React
│   │   ├── auth/          # Composants d'authentification
│   │   ├── layout/        # Layout et navigation
│   │   └── ui/            # Composants d'interface
│   ├── lib/               # Utilitaires et configuration
│   │   ├── supabase.ts    # Configuration Supabase
│   │   ├── database.ts    # Fonctions CRUD
│   │   └── auth.ts        # Fonctions d'authentification
│   ├── types/             # Types TypeScript
│   └── data/              # Données mockées
├── .env.local             # Variables d'environnement
├── .env.example           # Template des variables
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## ✅ Vérification de l'Installation

Pour vérifier que tout fonctionne :

1. ✅ L'application démarre sans erreur
2. ✅ La page de connexion s'affiche
3. ✅ L'inscription/connexion fonctionne
4. ✅ Le dashboard s'affiche avec les statistiques
5. ✅ La page essieux affiche les données de test
6. ✅ Les opérations CRUD (ajouter/modifier/supprimer) fonctionnent

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifier que tous les prérequis sont installés
2. Vérifier la configuration Supabase
3. Consulter les logs dans le terminal
4. Vérifier les erreurs dans la console du navigateur

## 📝 Notes Importantes

- **Ne jamais commiter** le fichier `.env.local` (il contient des clés secrètes)
- **Toujours vérifier** que les variables d'environnement sont correctes
- **Sauvegarder** vos clés Supabase dans un endroit sûr
- **Tester** toutes les fonctionnalités après installation

---

🎉 **Félicitations !** Votre application de gestion des essieux est maintenant prête à être utilisée !
