'use client'

import { useState, useEffect } from 'react'
import { Panne, Essieu, Travailleur } from '@/types'

interface PanneEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (panne: Omit<Panne, 'id' | 'created_at' | 'updated_at'>) => void
  editingPanne?: Panne | null
  essieux: Essieu[]
  travailleurs: Travailleur[]
  loading?: boolean
}

export default function PanneEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPanne, 
  essieux,
  travailleurs,
  loading = false 
}: PanneEditModalProps) {
  const [formData, setFormData] = useState({
    date_detection: '',
    essieu_id: '',
    description: '',
    statut: 'EN_ATTENTE' as 'EN_ATTENTE' | 'EN_COURS' | 'RESOLUE',
    technicien_id: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingPanne) {
      setFormData({
        date_detection: editingPanne.date_detection,
        essieu_id: editingPanne.essieu_id,
        description: editingPanne.description,
        statut: editingPanne.statut,
        technicien_id: editingPanne.technicien_id
      })
    } else {
      // Reset form for new panne
      setFormData({
        date_detection: new Date().toISOString().split('T')[0],
        essieu_id: '',
        description: '',
        statut: 'EN_ATTENTE',
        technicien_id: ''
      })
    }
    setErrors({})
  }, [editingPanne, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.date_detection.trim()) {
      newErrors.date_detection = 'La date de détection est requise'
    }
    if (!formData.essieu_id.trim()) {
      newErrors.essieu_id = 'L\'essieu est requis'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise'
    }
    if (!formData.technicien_id.trim()) {
      newErrors.technicien_id = 'Le technicien est requis'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        <div className="bg-gradient-to-r from-red-600 to-pink-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingPanne ? 'Modifier la panne' : 'Ajouter une panne'}
              </h2>
              <p className="text-red-100 text-sm">
                {editingPanne ? 'Mise à jour des informations' : 'Nouvelle panne détectée'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de détection *
                </label>
                <input
                  type="date"
                  name="date_detection"
                  value={formData.date_detection}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.date_detection ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.date_detection && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_detection}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut *
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="RESOLUE">Résolue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Essieu concerné *
              </label>
              <select
                name="essieu_id"
                value={formData.essieu_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.essieu_id ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Sélectionner un essieu</option>
                {essieux.map(essieu => (
                  <option key={essieu.id} value={essieu.id}>
                    Série {essieu.serie} - Post {essieu.post} - Ordre {essieu.numero_ordre}
                  </option>
                ))}
              </select>
              {errors.essieu_id && (
                <p className="mt-1 text-sm text-red-600">{errors.essieu_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technicien assigné *
              </label>
              <select
                name="technicien_id"
                value={formData.technicien_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.technicien_id ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Sélectionner un technicien</option>
                {travailleurs.filter(t => t.statut === 'ACTIF').map(travailleur => (
                  <option key={travailleur.id} value={travailleur.id}>
                    {travailleur.prenom} {travailleur.nom} - {travailleur.specialite}
                  </option>
                ))}
              </select>
              {errors.technicien_id && (
                <p className="mt-1 text-sm text-red-600">{errors.technicien_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description de la panne *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Décrivez la panne détectée..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-500 rounded-lg hover:from-red-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : (editingPanne ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </div>
    </div>
  )
}
