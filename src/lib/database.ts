import { createClient } from './supabase-client'
import { Database } from './supabase'

type Essieu = Database['public']['Tables']['essieux']['Row']
type Travailleur = Database['public']['Tables']['travailleurs']['Row']
type StockItem = Database['public']['Tables']['stock_items']['Row']
type Panne = Database['public']['Tables']['pannes']['Row']

// Fonctions pour les Essieux
export async function getEssieux() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('essieux')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erreur lors de la récupération des essieux: ${error.message}`)
  }

  return data as Essieu[]
}

export async function createEssieu(essieu: Omit<Essieu, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('essieux')
    .insert([essieu])
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la création de l'essieu: ${error.message}`)
  }

  return data as Essieu
}

export async function updateEssieu(id: string, essieu: Partial<Omit<Essieu, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('essieux')
    .update({ ...essieu, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de l'essieu: ${error.message}`)
  }

  return data as Essieu
}

export async function deleteEssieu(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('essieux')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'essieu: ${error.message}`)
  }
}

// Fonctions pour les Travailleurs
export async function getTravailleurs() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('travailleurs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erreur lors de la récupération des travailleurs: ${error.message}`)
  }

  return data as Travailleur[]
}

export async function createTravailleur(travailleur: Omit<Travailleur, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('travailleurs')
    .insert([travailleur])
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la création du travailleur: ${error.message}`)
  }

  return data as Travailleur
}

export async function updateTravailleur(id: string, travailleur: Partial<Omit<Travailleur, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('travailleurs')
    .update({ ...travailleur, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du travailleur: ${error.message}`)
  }

  return data as Travailleur
}

export async function deleteTravailleur(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('travailleurs')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erreur lors de la suppression du travailleur: ${error.message}`)
  }
}

// Fonctions pour le Stock
export async function getStockItems() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stock_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erreur lors de la récupération du stock: ${error.message}`)
  }

  return data as StockItem[]
}

export async function createStockItem(item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stock_items')
    .insert([item])
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la création de l'article: ${error.message}`)
  }

  return data as StockItem
}

export async function updateStockItem(id: string, item: Partial<Omit<StockItem, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stock_items')
    .update({ ...item, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de l'article: ${error.message}`)
  }

  return data as StockItem
}

export async function deleteStockItem(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('stock_items')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'article: ${error.message}`)
  }
}

// Fonctions pour les Pannes
export async function getPannes() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('pannes')
    .select(`
      *,
      essieux:essieu_id(serie, numero_ordre),
      travailleurs:technicien_id(nom, prenom)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erreur lors de la récupération des pannes: ${error.message}`)
  }

  return data as (Panne & {
    essieux: { serie: number; numero_ordre: string } | null
    travailleurs: { nom: string; prenom: string } | null
  })[]
}

export async function createPanne(panne: Omit<Panne, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('pannes')
    .insert([panne])
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la création de la panne: ${error.message}`)
  }

  return data as Panne
}

export async function updatePanne(id: string, panne: Partial<Omit<Panne, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('pannes')
    .update({ ...panne, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de la panne: ${error.message}`)
  }

  return data as Panne
}

export async function deletePanne(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('pannes')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erreur lors de la suppression de la panne: ${error.message}`)
  }
}
