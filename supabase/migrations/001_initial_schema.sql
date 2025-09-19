-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create essieux table
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

-- Create travailleurs table
CREATE TABLE travailleurs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    matricule VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    specialite VARCHAR(50) NOT NULL,
    niveau VARCHAR(20) NOT NULL CHECK (niveau IN ('junior', 'senior', 'expert')),
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('actif', 'inactif', 'en_conge')),
    date_embauche VARCHAR(20) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    essieux_assignes INTEGER DEFAULT 0,
    interventions_realisees INTEGER DEFAULT 0,
    note_moyenne DECIMAL(3,1) DEFAULT 0.0,
    derniere_intervention VARCHAR(20) DEFAULT '',
    competences TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_items table
CREATE TABLE stock_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 0,
    seuil_minimum INTEGER NOT NULL DEFAULT 0,
    derniere_entree VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pannes table
CREATE TABLE pannes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date VARCHAR(20) NOT NULL,
    essieu_id UUID NOT NULL REFERENCES essieux(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('ouverte', 'en_cours', 'fermée')),
    technicien_id UUID NOT NULL REFERENCES travailleurs(id) ON DELETE CASCADE,
    notes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_essieux_situation ON essieux(situation);
CREATE INDEX idx_essieux_serie ON essieux(serie);
CREATE INDEX idx_essieux_wagon ON essieux(wagon);
CREATE INDEX idx_travailleurs_statut ON travailleurs(statut);
CREATE INDEX idx_travailleurs_specialite ON travailleurs(specialite);
CREATE INDEX idx_travailleurs_niveau ON travailleurs(niveau);
CREATE INDEX idx_pannes_statut ON pannes(statut);
CREATE INDEX idx_pannes_essieu_id ON pannes(essieu_id);
CREATE INDEX idx_pannes_technicien_id ON pannes(technicien_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_essieux_updated_at BEFORE UPDATE ON essieux
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travailleurs_updated_at BEFORE UPDATE ON travailleurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_items_updated_at BEFORE UPDATE ON stock_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pannes_updated_at BEFORE UPDATE ON pannes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE essieux ENABLE ROW LEVEL SECURITY;
ALTER TABLE travailleurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pannes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON essieux
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON travailleurs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON stock_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON pannes
    FOR ALL USING (auth.role() = 'authenticated');
