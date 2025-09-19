'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DataTable from '@/components/ui/DataTable';
import PanneEditModal from '@/components/ui/PanneEditModal';
import { Panne, Essieu, Travailleur } from '@/types';
import { mockPannes, mockEssieux, mockTravailleurs } from '@/data/mockData';

export default function PannesPage() {
  const [pannes, setPannes] = useState<Panne[]>(mockPannes);
  const [essieux] = useState<Essieu[]>(mockEssieux);
  const [travailleurs] = useState<Travailleur[]>(mockTravailleurs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPanne, setEditingPanne] = useState<Panne | null>(null);

  const columns = [
    {
      key: 'date_detection',
      label: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('fr-FR')
    },
    {
      key: 'essieu_id',
      label: 'Essieu',
      render: (value: unknown, item: unknown) => {
        const panne = item as Panne;
        const essieu = essieux.find(e => e.id === panne.essieu_id);
        return essieu ? `Série ${essieu.serie} - Post ${essieu.post}` : 'N/A';
      }
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: unknown) => (value as string).substring(0, 50) + '...'
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: unknown) => {
        const statut = value as string;
        const colors = {
          'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
          'EN_COURS': 'bg-blue-100 text-blue-800',
          'RESOLUE': 'bg-green-100 text-green-800'
        };
        const labels = {
          'EN_ATTENTE': 'En attente',
          'EN_COURS': 'En cours',
          'RESOLUE': 'Résolue'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[statut as keyof typeof colors]}`}>
            {labels[statut as keyof typeof labels]}
          </span>
        );
      }
    },
    {
      key: 'technicien_id',
      label: 'Technicien',
      render: (value: unknown, item: unknown) => {
        const panne = item as Panne;
        const technicien = travailleurs.find(t => t.id === panne.technicien_id);
        return technicien ? `${technicien.prenom} ${technicien.nom}` : 'N/A';
      }
    }
  ];

  const handleAdd = () => {
    setEditingPanne(null);
    setIsModalOpen(true);
  };

  const handleEdit = (panne: Panne) => {
    setEditingPanne(panne);
    setIsModalOpen(true);
  };

  const handleDelete = (panne: Panne) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette panne ?`)) {
      setPannes(pannes.filter(p => p.id !== panne.id));
    }
  };

  const handleSave = (panneData: Omit<Panne, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPanne) {
      // Modification
      const updatedPanne = { ...panneData, id: editingPanne.id, created_at: editingPanne.created_at, updated_at: new Date().toISOString() };
      setPannes(pannes.map(p => p.id === editingPanne.id ? updatedPanne : p));
    } else {
      // Création
      const newPanne = { 
        ...panneData, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
      setPannes([newPanne, ...pannes]);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Pannes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Suivi et résolution des pannes détectées sur les essieux
            </p>
          </div>

          <DataTable
            data={pannes}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            addButtonText="Ajouter une Panne"
            searchPlaceholder="Rechercher une panne..."
          />

          <PanneEditModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPanne(null);
            }}
            onSave={handleSave}
            editingPanne={editingPanne}
            essieux={essieux}
            travailleurs={travailleurs}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}