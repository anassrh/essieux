'use client'

import { useState, useEffect } from 'react'
import { StockItem } from '@/types'

interface StockEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) => void
  editingItem?: StockItem | null
  loading?: boolean
}

export default function StockEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingItem, 
  loading = false 
}: StockEditModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    quantite: 0,
    seuil_minimum: 0,
    date_derniere_commande: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingItem) {
      setFormData({
        nom: editingItem.nom,
        quantite: editingItem.quantite,
        seuil_minimum: editingItem.seuil_minimum,
        date_derniere_commande: editingItem.date_derniere_commande
      })
    } else {
      // Reset form for new item
      setFormData({
        nom: '',
        quantite: 0,
        seuil_minimum: 0,
        date_derniere_commande: new Date().toISOString().split('T')[0]
      })
    }
    setErrors({})
  }, [editingItem, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de l\'article est requis'
    }
    if (formData.quantite < 0) {
      newErrors.quantite = 'La quantité ne peut pas être négative'
    }
    if (formData.seuil_minimum < 0) {
      newErrors.seuil_minimum = 'Le seuil minimum ne peut pas être négatif'
    }
    if (!formData.date_derniere_commande.trim()) {
      newErrors.date_derniere_commande = 'La date de dernière commande est requise'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSave(formData)
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('quantite') || name.includes('seuil_minimum') ? 
        parseInt(value) || 0 : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingItem ? 'Modifier l\'article' : 'Ajouter un article'}
              </h2>
              <p className="text-green-100 text-sm">
                {editingItem ? 'Mise à jour des informations' : 'Nouvel article en stock'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l&apos;article *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Roulement SKF 6205"
                required
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité en stock *
                </label>
                <input
                  type="number"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.quantite ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  required
                />
                {errors.quantite && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantite}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil minimum *
                </label>
                <input
                  type="number"
                  name="seuil_minimum"
                  value={formData.seuil_minimum}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.seuil_minimum ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  required
                />
                {errors.seuil_minimum && (
                  <p className="mt-1 text-sm text-red-600">{errors.seuil_minimum}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de dernière commande *
              </label>
              <input
                type="date"
                name="date_derniere_commande"
                value={formData.date_derniere_commande}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.date_derniere_commande ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.date_derniere_commande && (
                <p className="mt-1 text-sm text-red-600">{errors.date_derniere_commande}</p>
              )}
            </div>

            {/* Indicateur de statut */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Statut du stock</h4>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.quantite <= formData.seuil_minimum 
                    ? 'bg-red-100 text-red-800' 
                    : formData.quantite <= formData.seuil_minimum * 1.5
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {formData.quantite <= formData.seuil_minimum 
                    ? 'Stock critique' 
                    : formData.quantite <= formData.seuil_minimum * 1.5
                    ? 'Stock faible'
                    : 'Stock normal'
                  }
                </div>
                <span className="text-sm text-gray-600">
                  {formData.quantite} / {formData.seuil_minimum} minimum
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : (editingItem ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </div>
    </div>
  )
}
