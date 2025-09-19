'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TravailleurTable from '@/components/ui/TravailleurTable';
import TravailleurEditModal from '@/components/ui/TravailleurEditModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Travailleur } from '@/types';
import { getTravailleurs, createTravailleur, updateTravailleur, deleteTravailleur } from '@/lib/database';

export default function TravailleursPage() {
  const [travailleurs, setTravailleurs] = useState<Travailleur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTravailleur, setEditingTravailleur] = useState<Travailleur | null>(null);

  // Charger les travailleurs au montage du composant
  useEffect(() => {
    loadTravailleurs();
  }, []);

  const loadTravailleurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTravailleurs();
      setTravailleurs(data);
    } catch (err) {
      console.error('Erreur lors du chargement des travailleurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des travailleurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTravailleur(null);
    setIsModalOpen(true);
  };

  const handleEdit = (travailleur: Travailleur) => {
    setEditingTravailleur(travailleur);
    setIsModalOpen(true);
  };

  const handleDelete = async (travailleur: Travailleur) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le technicien ${travailleur.prenom} ${travailleur.nom} ?`)) {
      try {
        await deleteTravailleur(travailleur.id);
        setTravailleurs(travailleurs.filter(t => t.id !== travailleur.id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression du technicien');
      }
    }
  };

  const handleSave = async (travailleurData: Omit<Travailleur, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingTravailleur) {
        // Modification
        const updatedTravailleur = await updateTravailleur(editingTravailleur.id, travailleurData);
        setTravailleurs(travailleurs.map(t => 
          t.id === editingTravailleur.id ? updatedTravailleur : t
        ));
      } else {
        // Création
        const newTravailleur = await createTravailleur(travailleurData);
        setTravailleurs([newTravailleur, ...travailleurs]);
      }
      
      setEditingTravailleur(null);
      // Le modal sera fermé par le composant modal lui-même
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      throw err; // Re-throw pour que le modal puisse afficher l'erreur
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">❌ Erreur</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadTravailleurs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

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
            addButtonText="Ajouter un Technicien"
          />

          <TravailleurEditModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTravailleur(null);
            }}
            onSave={handleSave}
            editingTravailleur={editingTravailleur}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}