'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import AlertBadge from '@/components/ui/AlertBadge';
import { Panne, Essieu, Travailleur } from '@/types';
import { mockPannes, mockEssieux, mockTravailleurs } from '@/data/mockData';

export default function PannesPage() {
  const [pannes, setPannes] = useState<Panne[]>(mockPannes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPanne, setEditingPanne] = useState<Panne | null>(null);
  const [formData, setFormData] = useState<Partial<Panne>>({
    date: '',
    essieu_id: '',
    description: '',
    statut: 'ouverte',
    technicien_id: '',
    notes: []
  });
  const [newNote, setNewNote] = useState('');

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'essieu_id',
      label: 'Essieu',
      render: (value: string) => {
        const essieu = mockEssieux.find(e => e.id === value);
        return essieu ? essieu.numero_ordre : 'N/A';
      }
    },
    {
      key: 'description',
      label: 'Description'
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: string) => <AlertBadge status={value} />
    },
    {
      key: 'technicien_id',
      label: 'Technicien',
      render: (value: string) => {
        const technicien = mockTravailleurs.find(t => t.id === value);
        return technicien ? `${technicien.prenom} ${technicien.nom}` : 'N/A';
      }
    }
  ];

  const handleAdd = () => {
    setEditingPanne(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      essieu_id: '',
      description: '',
      statut: 'ouverte',
      technicien_id: '',
      notes: []
    });
    setNewNote('');
    setIsModalOpen(true);
  };

  const handleEdit = (panne: Panne) => {
    setEditingPanne(panne);
    setFormData(panne);
    setNewNote('');
    setIsModalOpen(true);
  };

  const handleDelete = (panne: Panne) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette panne ?')) {
      setPannes(pannes.filter(p => p.id !== panne.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPanne) {
      // Modification
      setPannes(pannes.map(p => 
        p.id === editingPanne.id 
          ? { ...p, ...formData } as Panne
          : p
      ));
    } else {
      // Ajout
      const newPanne: Panne = {
        id: Date.now().toString(),
        ...formData
      } as Panne;
      setPannes([...pannes, newPanne]);
    }
    
    setIsModalOpen(false);
    setFormData({
      date: '',
      essieu_id: '',
      description: '',
      statut: 'ouverte',
      technicien_id: '',
      notes: []
    });
    setNewNote('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setFormData(prev => ({
        ...prev,
        notes: [...(prev.notes || []), newNote.trim()]
      }));
      setNewNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Pannes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les interventions et le suivi des pannes
          </p>
        </div>

        <DataTable
          data={pannes}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonText="Ajouter une Panne"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPanne ? 'Modifier la panne' : 'Ajouter une panne'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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
                  <option value="ouverte">Ouverte</option>
                  <option value="en_cours">En cours</option>
                  <option value="fermée">Fermée</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="essieu_id" className="block text-sm font-medium text-gray-700">
                Essieu concerné
              </label>
              <select
                name="essieu_id"
                id="essieu_id"
                value={formData.essieu_id}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner un essieu</option>
                {mockEssieux.map(essieu => (
                  <option key={essieu.id} value={essieu.id}>
                    {essieu.numero_ordre} - {essieu.type} ({essieu.localisation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="technicien_id" className="block text-sm font-medium text-gray-700">
                Technicien assigné
              </label>
              <select
                name="technicien_id"
                id="technicien_id"
                value={formData.technicien_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner un technicien</option>
                {mockTravailleurs.filter(t => t.statut === 'actif').map(technicien => (
                  <option key={technicien.id} value={technicien.id}>
                    {technicien.prenom} {technicien.nom} - {technicien.specialite}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes d'intervention
              </label>
              <div className="space-y-2">
                {formData.notes?.map((note, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{note}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
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
                {editingPanne ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
