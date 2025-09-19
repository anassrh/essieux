'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TravailleurTable from '@/components/ui/TravailleurTable';
import Modal from '@/components/ui/Modal';
import { Travailleur } from '@/types';
import { mockTravailleurs } from '@/data/mockData';

export default function TravailleursPage() {
  const [travailleurs, setTravailleurs] = useState<Travailleur[]>(mockTravailleurs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTravailleur, setEditingTravailleur] = useState<Travailleur | null>(null);
  const [formData, setFormData] = useState<Partial<Travailleur>>({
    matricule: '',
    nom: '',
    prenom: '',
    specialite: '',
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
  });

  const handleAdd = () => {
    setEditingTravailleur(null);
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      specialite: '',
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
    });
    setIsModalOpen(true);
  };

  const handleEdit = (travailleur: Travailleur) => {
    setEditingTravailleur(travailleur);
    setFormData(travailleur);
    setIsModalOpen(true);
  };

  const handleDelete = (travailleur: Travailleur) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce technicien ?')) {
      setTravailleurs(travailleurs.filter(t => t.id !== travailleur.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTravailleur) {
      // Modification
      setTravailleurs(travailleurs.map(t => 
        t.id === editingTravailleur.id 
          ? { ...t, ...formData } as Travailleur
          : t
      ));
    } else {
      // Ajout
      const newTravailleur: Travailleur = {
        id: Date.now().toString(),
        ...formData
      } as Travailleur;
      setTravailleurs([...travailleurs, newTravailleur]);
    }
    
    setIsModalOpen(false);
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      specialite: '',
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
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('essieux_assignes') || name.includes('interventions_realisees') || 
              name.includes('note_moyenne') ? 
              parseFloat(value) || 0 : value
    }));
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Équipe Technique</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion complète de l&apos;équipe technique et des techniciens
          </p>
        </div>

        <TravailleurTable
          data={travailleurs}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTravailleur ? 'Modifier le technicien' : 'Ajouter un technicien'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">
                  Matricule
                </label>
                <input
                  type="text"
                  name="matricule"
                  id="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  placeholder="TECH-001"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">
                  Niveau
                </label>
                <select
                  name="niveau"
                  id="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  id="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
                  Spécialité
                </label>
                <select
                  name="specialite"
                  id="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner une spécialité</option>
                  <option value="Mécanique">Mécanique</option>
                  <option value="Électronique">Électronique</option>
                  <option value="Hydraulique">Hydraulique</option>
                </select>
              </div>
              <div>
                <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  name="statut"
                  id="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="actif">Actif</option>
                  <option value="en_conge">En congé</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date_embauche" className="block text-sm font-medium text-gray-700">
                  Date d&apos;embauche (DD/M/YYYY)
                </label>
                <input
                  type="text"
                  name="date_embauche"
                  id="date_embauche"
                  value={formData.date_embauche}
                  onChange={handleInputChange}
                  placeholder="15/3/2018"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  id="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="06.12.34.56.78"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="j.dupont@essieux.fr"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="essieux_assignes" className="block text-sm font-medium text-gray-700">
                  Essieux Assignés
                </label>
                <input
                  type="number"
                  name="essieux_assignes"
                  id="essieux_assignes"
                  value={formData.essieux_assignes}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="interventions_realisees" className="block text-sm font-medium text-gray-700">
                  Interventions Réalisées
                </label>
                <input
                  type="number"
                  name="interventions_realisees"
                  id="interventions_realisees"
                  value={formData.interventions_realisees}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="note_moyenne" className="block text-sm font-medium text-gray-700">
                  Note Moyenne
                </label>
                <input
                  type="number"
                  name="note_moyenne"
                  id="note_moyenne"
                  value={formData.note_moyenne}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="derniere_intervention" className="block text-sm font-medium text-gray-700">
                Dernière Intervention (DD/M/YY)
              </label>
              <input
                type="text"
                name="derniere_intervention"
                id="derniere_intervention"
                value={formData.derniere_intervention}
                onChange={handleInputChange}
                placeholder="2/3/24"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingTravailleur ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
