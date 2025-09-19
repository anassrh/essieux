'use client'

import { useState, useEffect } from 'react'
import { Essieu } from '@/types'

interface EssieuEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (essieu: Omit<Essieu, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  editingEssieu?: Essieu | null
  loading?: boolean
}

export default function EssieuEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingEssieu, 
  loading = false 
}: EssieuEditModalProps) {
  const [formData, setFormData] = useState({
    serie: 9101,
    post: 1,
    numero_ordre: '',
    date_rev: '',
    mise_sce_rmt: '',
    d_roue: 896,
    wagon: '',
    bogie1: 0,
    bogie2: 0,
    situation: 'EN EXPLOITATION' as 'EN EXPLOITATION' | 'DEMANDE' | null,
    age_revision_jours: '',
    age_calage_annee: 0,
    marque: 'SKF'
  })

  const [activeSection, setActiveSection] = useState('identification')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (editingEssieu) {
      setFormData({
        serie: editingEssieu.serie,
        post: editingEssieu.post,
        numero_ordre: editingEssieu.numero_ordre,
        date_rev: editingEssieu.date_rev,
        mise_sce_rmt: editingEssieu.mise_sce_rmt,
        d_roue: editingEssieu.d_roue,
        wagon: editingEssieu.wagon,
        bogie1: editingEssieu.bogie1,
        bogie2: editingEssieu.bogie2,
        situation: editingEssieu.situation,
        age_revision_jours: editingEssieu.age_revision_jours,
        age_calage_annee: editingEssieu.age_calage_annee,
        marque: editingEssieu.marque
      })
    } else {
      // Reset form for new essieu
      setFormData({
        serie: 9101,
        post: 1,
        numero_ordre: '',
        date_rev: '',
        mise_sce_rmt: '',
        d_roue: 896,
        wagon: '',
        bogie1: 0,
        bogie2: 0,
        situation: 'EN EXPLOITATION',
        age_revision_jours: '',
        age_calage_annee: 0,
        marque: 'SKF'
      })
    }
    setErrors({})
    setSaveError(null)
    setActiveSection('identification')
  }, [editingEssieu, isOpen])

  const sections = [
    { key: 'identification', label: 'Identification', icon: '🆔' },
    { key: 'caracteristiques', label: 'Caractéristiques', icon: '⚙️' },
    { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { key: 'localisation', label: 'Localisation', icon: '📍' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.numero_ordre.trim()) {
      newErrors.numero_ordre = 'Le numéro d\'ordre est requis'
    }
    if (!formData.date_rev.trim()) {
      newErrors.date_rev = 'La date de révision est requise'
    }
    if (!formData.wagon.trim()) {
      newErrors.wagon = 'Le wagon est requis'
    }
    if (formData.d_roue <= 0) {
      newErrors.d_roue = 'Le diamètre de roue doit être positif'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSave(formData)
      // onClose() sera appelé automatiquement par la fonction handleSave du parent
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde')
      // Le modal reste ouvert en cas d'erreur
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('serie') || name.includes('post') || name.includes('bogie') || name.includes('age_calage') || name.includes('d_roue') ? 
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingEssieu ? 'Modifier l&apos;essieu' : 'Ajouter un essieu'}
              </h2>
              <p className="text-purple-100 text-sm">
                {editingEssieu ? 'Mise à jour des informations' : 'Nouvel essieu dans le parc'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="flex space-x-1">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-white'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto">
          {/* Section: Identification */}
          {activeSection === 'identification' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🆔</span>
                Informations d&apos;identification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Série
                  </label>
                  <input
                    type="number"
                    name="serie"
                    value={formData.serie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post
                  </label>
                  <input
                    type="number"
                    name="post"
                    value={formData.post}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro d&apos;ordre *
                  </label>
                  <input
                    type="text"
                    name="numero_ordre"
                    value={formData.numero_ordre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.numero_ordre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 11212"
                    required
                  />
                  {errors.numero_ordre && (
                    <p className="mt-1 text-sm text-red-600">{errors.numero_ordre}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section: Caractéristiques */}
          {activeSection === 'caracteristiques' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚙️</span>
                Caractéristiques techniques
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diamètre de roue (mm) *
                  </label>
                  <input
                    type="number"
                    name="d_roue"
                    value={formData.d_roue}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.d_roue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.d_roue && (
                    <p className="mt-1 text-sm text-red-600">{errors.d_roue}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <select
                    name="marque"
                    value={formData.marque}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="SKF">SKF</option>
                    <option value="TIMKEN">TIMKEN</option>
                    <option value="NSK">NSK</option>
                    <option value="FAG">FAG</option>
                    <option value="INA">INA</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bogie 1
                  </label>
                  <input
                    type="number"
                    name="bogie1"
                    value={formData.bogie1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bogie 2
                  </label>
                  <input
                    type="number"
                    name="bogie2"
                    value={formData.bogie2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Maintenance */}
          {activeSection === 'maintenance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🔧</span>
                Informations de maintenance
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de révision *
                  </label>
                  <input
                    type="text"
                    name="date_rev"
                    value={formData.date_rev}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.date_rev ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 15/3/24"
                    required
                  />
                  {errors.date_rev && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_rev}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mise en service/Retrait
                  </label>
                  <input
                    type="text"
                    name="mise_sce_rmt"
                    value={formData.mise_sce_rmt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 10/2/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Âge de révision (jours)
                  </label>
                  <input
                    type="text"
                    name="age_revision_jours"
                    value={formData.age_revision_jours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: 4ans2mois23jours"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Âge de calage (années)
                  </label>
                  <input
                    type="number"
                    name="age_calage_annee"
                    value={formData.age_calage_annee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Localisation */}
          {activeSection === 'localisation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Localisation et statut
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wagon *
                  </label>
                  <input
                    type="text"
                    name="wagon"
                    value={formData.wagon}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.wagon ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 9310001"
                    required
                  />
                  {errors.wagon && (
                    <p className="mt-1 text-sm text-red-600">{errors.wagon}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Situation
                  </label>
                  <select
                    name="situation"
                    value={formData.situation || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Sélectionner une situation</option>
                    <option value="EN EXPLOITATION">En Exploitation</option>
                    <option value="DEMANDE">En Demande</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Affichage des erreurs de sauvegarde */}
        {saveError && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de sauvegarde</h3>
                <div className="mt-1 text-sm text-red-700">{saveError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : (editingEssieu ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </div>
    </div>
  )
}
