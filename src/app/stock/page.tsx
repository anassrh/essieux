'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import AlertBadge from '@/components/ui/AlertBadge';
import { StockItem } from '@/types';
import { mockStockItems } from '@/data/mockData';

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState<Partial<StockItem>>({
    nom: '',
    quantite: 0,
    seuil_minimum: 0,
    derniere_entree: ''
  });

  const columns = [
    {
      key: 'nom',
      label: 'Nom de la pièce'
    },
    {
      key: 'quantite',
      label: 'Quantité'
    },
    {
      key: 'seuil_minimum',
      label: 'Seuil minimum'
    },
    {
      key: 'derniere_entree',
      label: 'Dernière entrée',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: unknown, item: StockItem) => {
        const isLowStock = item.quantite <= item.seuil_minimum;
        return (
          <AlertBadge 
            status={isLowStock ? 'Stock faible' : 'Stock normal'} 
            type={isLowStock ? 'warning' : 'success'}
          />
        );
      }
    }
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      nom: '',
      quantite: 0,
      seuil_minimum: 0,
      derniere_entree: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: StockItem) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article du stock ?')) {
      setStockItems(stockItems.filter(s => s.id !== item.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Modification
      setStockItems(stockItems.map(s => 
        s.id === editingItem.id 
          ? { ...s, ...formData } as StockItem
          : s
      ));
    } else {
      // Ajout
      const newItem: StockItem = {
        id: Date.now().toString(),
        ...formData
      } as StockItem;
      setStockItems([...stockItems, newItem]);
    }
    
    setIsModalOpen(false);
    setFormData({
      nom: '',
      quantite: 0,
      seuil_minimum: 0,
      derniere_entree: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantite' || name === 'seuil_minimum' ? parseInt(value) || 0 : value
    }));
  };

  const lowStockItems = stockItems.filter(item => item.quantite <= item.seuil_minimum);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez l&apos;inventaire des pièces et surveillez les niveaux de stock
          </p>
        </div>

        {/* Alertes de stock faible */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Attention :</strong> {lowStockItems.length} article(s) en stock faible
                </p>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {lowStockItems.map(item => (
                      <li key={item.id}>
                        {item.nom} - Quantité: {item.quantite} (seuil: {item.seuil_minimum})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <DataTable
          data={stockItems}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonText="Ajouter un Article"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Modifier l\'article' : 'Ajouter un article'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom de la pièce
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
                  Quantité actuelle
                </label>
                <input
                  type="number"
                  name="quantite"
                  id="quantite"
                  value={formData.quantite}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="seuil_minimum" className="block text-sm font-medium text-gray-700">
                  Seuil minimum
                </label>
                <input
                  type="number"
                  name="seuil_minimum"
                  id="seuil_minimum"
                  value={formData.seuil_minimum}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="derniere_entree" className="block text-sm font-medium text-gray-700">
                Dernière entrée
              </label>
              <input
                type="date"
                name="derniere_entree"
                id="derniere_entree"
                value={formData.derniere_entree}
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
                {editingItem ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
