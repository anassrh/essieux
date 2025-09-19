export interface Essieu {
  id: string
  serie: number
  post: number
  numero_ordre: string
  date_rev: string
  mise_sce_rmt: string
  d_roue: number
  wagon: string
  bogie1: number
  bogie2: number
  situation: 'EN EXPLOITATION' | 'DEMANDE' | null
  age_revision_jours: string
  age_calage_annee: number
  marque: string
  created_at: string
  updated_at: string
}

export interface Travailleur {
  id: string
  matricule: string
  nom: string
  prenom: string
  specialite: string
  niveau: string
  statut: 'ACTIF' | 'INACTIF' | 'CONGE'
  date_embauche: string
  telephone: string
  email: string
  essieux_assignes: number
  interventions_realisees: number
  note_moyenne: number
  derniere_intervention: string
  competences: string[]
  created_at: string
  updated_at: string
}

export interface StockItem {
  id: string
  nom: string
  reference: string
  quantite: number
  seuil_minimum: number
  prix_unitaire: number
  fournisseur: string
  emplacement: string
  date_derniere_commande: string
  date_expiration?: string
  statut: 'EN_STOCK' | 'RUPTURE' | 'COMMANDE_EN_COURS'
}

export interface Panne {
  id: string
  essieu_id: string
  type: string
  description: string
  date_detection: string
  niveau_urgence: 'FAIBLE' | 'MOYEN' | 'ELEVE' | 'CRITIQUE'
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLUE'
  technicien_id?: string
  date_intervention?: string
  duree_intervention?: number
  cout_reparation?: number
  pieces_utilisees?: string[]
  notes_intervention?: string
}