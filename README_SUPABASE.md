# Configuration Supabase pour l'Application Essieux

## 📋 Prérequis

1. **Compte Supabase** : Créez un compte sur [supabase.com](https://supabase.com)
2. **Projet Supabase** : Créez un nouveau projet
3. **Clés API** : Récupérez vos clés API depuis le dashboard Supabase

## 🔧 Configuration

### 1. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec vos clés Supabase :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Configuration
DATABASE_URL=your_database_url_here
```

### 2. Récupération des Clés API

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configuration de la Base de Données

#### Option A : Via l'Interface Supabase
1. Allez dans **SQL Editor**
2. Copiez le contenu de `supabase/migrations/001_initial_schema.sql`
3. Exécutez le script

#### Option B : Via Supabase CLI
```bash
# Installer Supabase CLI
npm install -g supabase

# Initialiser le projet
supabase init

# Lier au projet distant
supabase link --project-ref your-project-ref

# Appliquer les migrations
supabase db push
```

### 4. Données de Test

Pour insérer les données de test :
1. Allez dans **SQL Editor**
2. Copiez le contenu de `supabase/seed.sql`
3. Exécutez le script

## 🔐 Configuration de l'Authentification

### 1. Activer l'Authentification par Email

1. Allez dans **Authentication** > **Settings**
2. Activez **Enable email confirmations**
3. Configurez **Site URL** : `http://localhost:3000` (développement)
4. Configurez **Redirect URLs** : `http://localhost:3000/**`

### 2. Configuration Email (Optionnel)

Pour la production, configurez un service email :
1. Allez dans **Authentication** > **Settings** > **SMTP Settings**
2. Configurez votre service email (SendGrid, Mailgun, etc.)

## 🚀 Utilisation

### 1. Démarrer l'Application

```bash
npm run dev
```

### 2. Tester l'Authentification

1. Allez sur `http://localhost:3000`
2. Vous serez redirigé vers la page de connexion
3. Créez un compte ou connectez-vous

### 3. Fonctionnalités Disponibles

- ✅ **Authentification** : Connexion/Inscription/Déconnexion
- ✅ **Gestion des Essieux** : CRUD complet
- ✅ **Gestion des Travailleurs** : CRUD complet
- ✅ **Gestion du Stock** : CRUD complet
- ✅ **Gestion des Pannes** : CRUD complet
- ✅ **Dashboard** : Statistiques en temps réel

## 📊 Structure de la Base de Données

### Tables Principales

1. **essieux** : Gestion du parc d'essieux
2. **travailleurs** : Gestion de l'équipe technique
3. **stock_items** : Gestion des pièces de rechange
4. **pannes** : Gestion des interventions

### Relations

- `pannes.essieu_id` → `essieux.id`
- `pannes.technicien_id` → `travailleurs.id`

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables ont RLS activé avec des politiques pour les utilisateurs authentifiés.

### Politiques de Sécurité

```sql
-- Exemple de politique
CREATE POLICY "Allow all operations for authenticated users" ON essieux
    FOR ALL USING (auth.role() = 'authenticated');
```

## 🛠️ Développement

### Fonctions Utiles

```typescript
// Récupérer les essieux
const essieux = await getEssieux()

// Créer un essieu
const nouvelEssieu = await createEssieu({
  serie: 9101,
  post: 1,
  numero_ordre: '11212',
  // ... autres champs
})

// Mettre à jour un essieu
await updateEssieu(id, { situation: 'EN EXPLOITATION' })

// Supprimer un essieu
await deleteEssieu(id)
```

### Hooks d'Authentification

```typescript
// Dans un composant
const { user, loading, signOut } = useAuth()

if (loading) return <div>Chargement...</div>
if (!user) return <LoginForm />

// Utilisateur connecté
return <div>Bonjour {user.email}!</div>
```

## 🚨 Dépannage

### Erreurs Courantes

1. **"Invalid API key"** : Vérifiez vos clés dans `.env.local`
2. **"Row Level Security"** : Vérifiez que RLS est configuré
3. **"CORS error"** : Vérifiez les URLs dans Supabase Auth

### Logs

Consultez les logs dans :
- **Supabase Dashboard** > **Logs**
- **Console du navigateur** pour les erreurs frontend

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Authentification Supabase](https://supabase.com/docs/guides/auth)
