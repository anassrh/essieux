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
      setIsModalOpen(false); // Fermer le modal après succès
      setEditingEssieu(null); // Reset editing state
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
              Gestion complète du parc d&apos;essieux avec suivi des révisions et maintenance
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
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
