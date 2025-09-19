'use client'

import { useState, useEffect } from 'react'
import { Travailleur } from '@/types'

interface TravailleurEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (travailleur: Omit<Travailleur, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  editingTravailleur?: Travailleur | null
  loading?: boolean
}

export default function TravailleurEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTravailleur, 
  loading = false 
}: TravailleurEditModalProps) {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    specialite: 'Mécanique',
    niveau: 'junior',
    statut: 'ACTIF' as 'ACTIF' | 'INACTIF' | 'CONGE',
    date_embauche: '',
    telephone: '',
    email: '',
    essieux_assignes: 0,
    interventions_realisees: 0,
    note_moyenne: 0,
    derniere_intervention: '',
    competences: [] as string[]
  })

  const [activeSection, setActiveSection] = useState('identification')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const [newCompetence, setNewCompetence] = useState('')

  useEffect(() => {
    if (editingTravailleur) {
      setFormData({
        matricule: editingTravailleur.matricule,
        nom: editingTravailleur.nom,
        prenom: editingTravailleur.prenom,
        specialite: editingTravailleur.specialite,
        niveau: editingTravailleur.niveau,
        statut: editingTravailleur.statut,
        date_embauche: editingTravailleur.date_embauche,
        telephone: editingTravailleur.telephone,
        email: editingTravailleur.email,
        essieux_assignes: editingTravailleur.essieux_assignes,
        interventions_realisees: editingTravailleur.interventions_realisees,
        note_moyenne: editingTravailleur.note_moyenne,
        derniere_intervention: editingTravailleur.derniere_intervention,
        competences: editingTravailleur.competences
      })
    } else {
      // Reset form for new travailleur
      setFormData({
        matricule: '',
        nom: '',
        prenom: '',
        specialite: 'Mécanique',
        niveau: 'junior',
        statut: 'ACTIF',
        date_embauche: '',
        telephone: '',
        email: '',
        essieux_assignes: 0,
        interventions_realisees: 0,
        note_moyenne: 0,
        derniere_intervention: '',
        competences: []
      })
    }
    setErrors({})
    setSaveError(null)
    setActiveSection('identification')
  }, [editingTravailleur, isOpen])

  const sections = [
    { key: 'identification', label: 'Identification', icon: '🆔' },
    { key: 'professionnel', label: 'Informations Professionnelles', icon: '💼' },
    { key: 'contact', label: 'Contact', icon: '📞' },
    { key: 'performance', label: 'Performance', icon: '📊' }
  ]

  const specialites = [
    'Mécanique',
    'Électricité',
    'Soudure',
    'Inspection',
    'Maintenance',
    'Diagnostic',
    'Formation',
    'Supervision'
  ]

  const niveaux = ['junior', 'intermediaire', 'senior', 'expert']

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis'
    }
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis'
    }
    if (!formData.date_embauche.trim()) {
      newErrors.date_embauche = 'La date d\'embauche est requise'
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
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('essieux_assignes') || name.includes('interventions_realisees') || name.includes('note_moyenne') ? 
        parseInt(value) || 0 : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddCompetence = () => {
    if (newCompetence.trim() && !formData.competences.includes(newCompetence.trim())) {
      setFormData(prev => ({
        ...prev,
        competences: [...prev.competences, newCompetence.trim()]
      }))
      setNewCompetence('')
    }
  }

  const handleRemoveCompetence = (competence: string) => {
    setFormData(prev => ({
      ...prev,
      competences: prev.competences.filter(c => c !== competence)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingTravailleur ? 'Modifier le technicien' : 'Ajouter un technicien'}
              </h2>
              <p className="text-blue-100 text-sm">
                {editingTravailleur ? 'Mise à jour des informations' : 'Nouveau technicien dans l\'équipe'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
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
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
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
                    Matricule *
                  </label>
                  <input
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.matricule ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: T001"
                    required
                  />
                  {errors.matricule && (
                    <p className="mt-1 text-sm text-red-600">{errors.matricule}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Benali"
                    required
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Ahmed"
                    required
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d&apos;embauche *
                  </label>
                  <input
                    type="date"
                    name="date_embauche"
                    value={formData.date_embauche}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.date_embauche ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.date_embauche && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_embauche}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section: Professionnel */}
          {activeSection === 'professionnel' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💼</span>
                Informations professionnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialité
                  </label>
                  <select
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {specialites.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                  </label>
                  <select
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {niveaux.map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIF">Actif</option>
                    <option value="INACTIF">Inactif</option>
                    <option value="CONGE">En congé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Essieux assignés
                  </label>
                  <input
                    type="number"
                    name="essieux_assignes"
                    value={formData.essieux_assignes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Contact */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📞</span>
                Informations de contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: ahmed.benali@emsi.ma"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.telephone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: +212 6 12 34 56 78"
                    required
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compétences
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCompetence}
                      onChange={(e) => setNewCompetence(e.target.value)}
                      placeholder="Ajouter une compétence..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                    />
                    <button
                      type="button"
                      onClick={handleAddCompetence}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.competences.map((competence, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {competence}
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetence(competence)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Performance */}
          {activeSection === 'performance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Indicateurs de performance
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interventions réalisées
                  </label>
                  <input
                    type="number"
                    name="interventions_realisees"
                    value={formData.interventions_realisees}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note moyenne (/10)
                  </label>
                  <input
                    type="number"
                    name="note_moyenne"
                    value={formData.note_moyenne}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dernière intervention
                  </label>
                  <input
                    type="date"
                    name="derniere_intervention"
                    value={formData.derniere_intervention}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : (editingTravailleur ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </div>
    </div>
  )
}
