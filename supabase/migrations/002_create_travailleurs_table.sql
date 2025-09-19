-- Création de la table travailleurs
CREATE TABLE IF NOT EXISTS travailleurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matricule VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  specialite VARCHAR(50) NOT NULL DEFAULT 'Mécanique',
  niveau VARCHAR(20) NOT NULL DEFAULT 'junior' CHECK (niveau IN ('junior', 'intermediaire', 'senior', 'expert')),
  statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF', 'CONGE')),
  date_embauche DATE NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  essieux_assignes INTEGER DEFAULT 0 CHECK (essieux_assignes >= 0),
  interventions_realisees INTEGER DEFAULT 0 CHECK (interventions_realisees >= 0),
  note_moyenne DECIMAL(3,1) DEFAULT 0 CHECK (note_moyenne >= 0 AND note_moyenne <= 10),
  derniere_intervention DATE,
  competences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index sur le matricule pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_travailleurs_matricule ON travailleurs(matricule);

-- Création d'un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_travailleurs_email ON travailleurs(email);

-- Création d'un index sur la spécialité pour les filtres
CREATE INDEX IF NOT EXISTS idx_travailleurs_specialite ON travailleurs(specialite);

-- Création d'un index sur le statut pour les filtres
CREATE INDEX IF NOT EXISTS idx_travailleurs_statut ON travailleurs(statut);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_travailleurs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER trigger_update_travailleurs_updated_at
  BEFORE UPDATE ON travailleurs
  FOR EACH ROW
  EXECUTE FUNCTION update_travailleurs_updated_at();

-- Politiques RLS (Row Level Security)
ALTER TABLE travailleurs ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read travailleurs" ON travailleurs
  FOR SELECT TO authenticated
  USING (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to insert travailleurs" ON travailleurs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update travailleurs" ON travailleurs
  FOR UPDATE TO authenticated
  USING (true);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete travailleurs" ON travailleurs
  FOR DELETE TO authenticated
  USING (true);
