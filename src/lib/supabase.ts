import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export type Database = {
  public: {
    Tables: {
      essieux: {
        Row: {
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
        Insert: {
          id?: string
          serie: number
          post: number
          numero_ordre: string
          date_rev: string
          mise_sce_rmt: string
          d_roue: number
          wagon: string
          bogie1: number
          bogie2: number
          situation?: 'EN EXPLOITATION' | 'DEMANDE' | null
          age_revision_jours: string
          age_calage_annee: number
          marque: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          serie?: number
          post?: number
          numero_ordre?: string
          date_rev?: string
          mise_sce_rmt?: string
          d_roue?: number
          wagon?: string
          bogie1?: number
          bogie2?: number
          situation?: 'EN EXPLOITATION' | 'DEMANDE' | null
          age_revision_jours?: string
          age_calage_annee?: number
          marque?: string
          created_at?: string
          updated_at?: string
        }
      }
      travailleurs: {
        Row: {
          id: string
          matricule: string
          nom: string
          prenom: string
          specialite: string
          niveau: 'junior' | 'senior' | 'expert'
          statut: 'actif' | 'inactif' | 'en_conge'
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
        Insert: {
          id?: string
          matricule: string
          nom: string
          prenom: string
          specialite: string
          niveau: 'junior' | 'senior' | 'expert'
          statut: 'actif' | 'inactif' | 'en_conge'
          date_embauche: string
          telephone: string
          email: string
          essieux_assignes?: number
          interventions_realisees?: number
          note_moyenne?: number
          derniere_intervention?: string
          competences?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          matricule?: string
          nom?: string
          prenom?: string
          specialite?: string
          niveau?: 'junior' | 'senior' | 'expert'
          statut?: 'actif' | 'inactif' | 'en_conge'
          date_embauche?: string
          telephone?: string
          email?: string
          essieux_assignes?: number
          interventions_realisees?: number
          note_moyenne?: number
          derniere_intervention?: string
          competences?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      stock_items: {
        Row: {
          id: string
          nom: string
          quantite: number
          seuil_minimum: number
          derniere_entree: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          quantite: number
          seuil_minimum: number
          derniere_entree: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          quantite?: number
          seuil_minimum?: number
          derniere_entree?: string
          created_at?: string
          updated_at?: string
        }
      }
      pannes: {
        Row: {
          id: string
          date: string
          essieu_id: string
          description: string
          statut: 'ouverte' | 'en_cours' | 'fermée'
          technicien_id: string
          notes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          essieu_id: string
          description: string
          statut: 'ouverte' | 'en_cours' | 'fermée'
          technicien_id: string
          notes?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          essieu_id?: string
          description?: string
          statut?: 'ouverte' | 'en_cours' | 'fermée'
          technicien_id?: string
          notes?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
