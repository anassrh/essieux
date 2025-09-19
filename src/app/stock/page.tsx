'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DataTable from '@/components/ui/DataTable';
import StockEditModal from '@/components/ui/StockEditModal';
import { StockItem } from '@/types';
import { mockStockItems } from '@/data/mockData';

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const columns = [
    {
      key: 'nom',
      label: 'Nom de la pièce'
    },
    {
      key: 'quantite',
      label: 'Quantité',
      render: (value: unknown) => value as number
    },
    {
      key: 'seuil_minimum',
      label: 'Seuil minimum',
      render: (value: unknown) => value as number
    },
    {
      key: 'date_derniere_commande',
      label: 'Dernière commande',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('fr-FR')
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: unknown, item: unknown) => {
        const stockItem = item as StockItem;
        const isLowStock = stockItem.quantite <= stockItem.seuil_minimum;
        const isCriticalStock = stockItem.quantite <= stockItem.seuil_minimum * 0.5;
        
        if (isCriticalStock) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Stock critique
            </span>
          );
        } else if (isLowStock) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Stock faible
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Stock normal
            </span>
          );
        }
      }
    }
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: StockItem) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${item.nom}" ?`)) {
      setStockItems(stockItems.filter(s => s.id !== item.id));
    }
  };

  const handleSave = (itemData: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingItem) {
      // Modification
      const updatedItem = { ...itemData, id: editingItem.id, created_at: editingItem.created_at, updated_at: new Date().toISOString() };
      setStockItems(stockItems.map(s => s.id === editingItem.id ? updatedItem : s));
    } else {
      // Création
      const newItem = { 
        ...itemData, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
      setStockItems([newItem, ...stockItems]);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
            <p className="mt-1 text-sm text-gray-500">
              Suivi des pièces de rechange et des articles en stock
            </p>
          </div>

          <DataTable
            data={stockItems}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            addButtonText="Ajouter un Article"
            searchPlaceholder="Rechercher un article..."
          />

          <StockEditModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            onSave={handleSave}
            editingItem={editingItem}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}