'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EssieuTable from '@/components/ui/EssieuTable';
import EssieuEditModal from '@/components/ui/EssieuEditModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Essieu } from '@/types';
import { getEssieux, createEssieu, updateEssieu, deleteEssieu } from '@/lib/database';

export default function EssieuxPage() {
  const [essieux, setEssieux] = useState<Essieu[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEssieu, setEditingEssieu] = useState<Essieu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données au montage du composant
  useEffect(() => {
    loadEssieux();
  }, []);

  const loadEssieux = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEssieux();
      setEssieux(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des essieux');
      console.error('Erreur lors du chargement des essieux:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEssieu(null);
    setIsModalOpen(true);
  };

  const handleEdit = (essieu: Essieu) => {
    setEditingEssieu(essieu);
    setIsModalOpen(true);
  };

  const handleDelete = async (essieu: Essieu) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet essieu ?')) {
      try {
        await deleteEssieu(essieu.id);
        await loadEssieux(); // Recharger les données
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const handleSave = async (essieuData: Omit<Essieu, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    setError(null);
    
    try {
      if (editingEssieu) {
        // Modification
        await updateEssieu(editingEssieu.id, essieuData as Partial<Essieu>);
      } else {
        // Ajout
        await createEssieu(essieuData);
      }
      
      await loadEssieux(); // Recharger les données
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur lors de la sauvegarde:', err);
      throw err; // Re-throw pour que le modal puisse gérer l'erreur
    } finally {
      setSaving(false);
    }
  };


  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parc Essieux</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion complète du parc d'essieux avec suivi des révisions et maintenance
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <button
                    onClick={loadEssieux}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Affichage du chargement */}
        {loading ? (
          <LoadingSpinner message="Chargement des essieux..." />
        ) : (
          <EssieuTable
            data={essieux}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <EssieuEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          editingEssieu={editingEssieu}
          loading={saving}
        />
          <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="serie" className="block text-sm font-medium text-gray-700">
                  Serie
                </label>
                <input
                  type="number"
                  name="serie"
                  id="serie"
                  value={formData.serie}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="post" className="block text-sm font-medium text-gray-700">
                  POST
                </label>
                <input
                  type="number"
                  name="post"
                  id="post"
                  value={formData.post}
                  onChange={handleInputChange}
                  min="1"
                  max="4"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="numero_ordre" className="block text-sm font-medium text-gray-700">
                N° D'ordre
              </label>
              <input
                type="text"
                name="numero_ordre"
                id="numero_ordre"
                value={formData.numero_ordre}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date_rev" className="block text-sm font-medium text-gray-700">
                  Date-Rev (DD/M/YY)
                </label>
                <input
                  type="text"
                  name="date_rev"
                  id="date_rev"
                  value={formData.date_rev}
                  onChange={handleInputChange}
                  placeholder="9/4/21"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="mise_sce_rmt" className="block text-sm font-medium text-gray-700">
                  Mise-Sce-Rmt (DD/M/YY)
                </label>
                <input
                  type="text"
                  name="mise_sce_rmt"
                  id="mise_sce_rmt"
                  value={formData.mise_sce_rmt}
                  onChange={handleInputChange}
                  placeholder="19/6/07"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="d_roue" className="block text-sm font-medium text-gray-700">
                  D.roue
                </label>
                <input
                  type="number"
                  name="d_roue"
                  id="d_roue"
                  value={formData.d_roue}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bogie1" className="block text-sm font-medium text-gray-700">
                  Bogie1
                </label>
                <input
                  type="number"
                  name="bogie1"
                  id="bogie1"
                  value={formData.bogie1}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bogie2" className="block text-sm font-medium text-gray-700">
                  Bogie-2
                </label>
                <input
                  type="number"
                  name="bogie2"
                  id="bogie2"
                  value={formData.bogie2}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="wagon" className="block text-sm font-medium text-gray-700">
                WAGON
              </label>
              <input
                type="text"
                name="wagon"
                id="wagon"
                value={formData.wagon}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="situation" className="block text-sm font-medium text-gray-700">
                SITUATION
              </label>
              <select
                name="situation"
                id="situation"
                value={formData.situation || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Vide</option>
                <option value="EN EXPLOITATION">EN EXPLOITATION</option>
                <option value="DEMANDE">DEMANDE</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age_revision_jours" className="block text-sm font-medium text-gray-700">
                  Age De Révision par jours
                </label>
                <input
                  type="text"
                  name="age_revision_jours"
                  id="age_revision_jours"
                  value={formData.age_revision_jours}
                  onChange={handleInputChange}
                  placeholder="4ans2mois23jours"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="age_calage_annee" className="block text-sm font-medium text-gray-700">
                  Age De Calage par année
                </label>
                <input
                  type="number"
                  name="age_calage_annee"
                  id="age_calage_annee"
                  value={formData.age_calage_annee}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="marque" className="block text-sm font-medium text-gray-700">
                MARQUE
              </label>
              <input
                type="text"
                name="marque"
                id="marque"
                value={formData.marque}
                onChange={handleInputChange}
                required
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
                {editingEssieu ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
