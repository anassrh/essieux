'use client';

import { useState, useMemo } from 'react';
import { Essieu } from '@/types';

interface EssieuTableProps {
  data: Essieu[];
  onEdit?: (essieu: Essieu) => void;
  onDelete?: (essieu: Essieu) => void;
  onAdd?: () => void;
}

// Icônes pour les actions
const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SortIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function EssieuTable({ data, onEdit, onDelete, onAdd }: EssieuTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [situationFilter, setSituationFilter] = useState<string>('all');
  const [wagonFilter, setWagonFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  const columns = [
    { key: 'serie', label: 'Série', width: 'w-20', align: 'center' },
    { key: 'post', label: 'Position', width: 'w-16', align: 'center' },
    { key: 'numero_ordre', label: 'N° D\'ordre', width: 'w-28', align: 'left' },
    { key: 'date_rev', label: 'Date Révision', width: 'w-28', align: 'center' },
    { key: 'mise_sce_rmt', label: 'Mise en Service', width: 'w-32', align: 'center' },
    { key: 'd_roue', label: 'Diamètre Roue', width: 'w-24', align: 'right' },
    { key: 'wagon', label: 'Wagon', width: 'w-28', align: 'left' },
    { key: 'bogie1', label: 'Bogie 1', width: 'w-20', align: 'right' },
    { key: 'bogie2', label: 'Bogie 2', width: 'w-20', align: 'right' },
    { key: 'situation', label: 'Situation', width: 'w-36', align: 'center' },
    { key: 'age_revision_jours', label: 'Âge Révision', width: 'w-44', align: 'left' },
    { key: 'age_calage_annee', label: 'Âge Calage (ans)', width: 'w-32', align: 'right' },
    { key: 'marque', label: 'Marque', width: 'w-24', align: 'center' }
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(essieu => {
      const matchesSearch = Object.values(essieu).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSituation = situationFilter === 'all' || 
        (situationFilter === 'null' && essieu.situation === null) ||
        essieu.situation === situationFilter;
      const matchesWagon = !wagonFilter || 
        essieu.wagon.toLowerCase().includes(wagonFilter.toLowerCase());
      
      return matchesSearch && matchesSituation && matchesWagon;
    });
  }, [data, searchTerm, situationFilter, wagonFilter]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField as keyof Essieu];
      const bValue = b[sortField as keyof Essieu];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = aValue.toString().toLowerCase();
      const bStr = bValue.toString().toLowerCase();
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const getSituationStyle = (situation: string | null) => {
    switch (situation) {
      case 'EN EXPLOITATION':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'DEMANDE':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getSituationIcon = (situation: string | null) => {
    switch (situation) {
      case 'EN EXPLOITATION':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'DEMANDE':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const csvContent = [
      headers,
      ...sortedData.map(essieu => 
        columns.map(col => {
          const value = essieu[col.key as keyof Essieu];
          return value !== null && value !== undefined ? `"${value}"` : '""';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'essieux.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
      {/* Header avec contrôles */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Parc Essieux</h3>
              <p className="text-sm text-gray-600">
                {filteredData.length} essieux • {data.filter(e => e.situation === 'EN EXPLOITATION').length} en exploitation
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <DownloadIcon />
              <span className="ml-2">Export CSV</span>
            </button>
            {onAdd && (
              <button
                onClick={onAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un Essieu
              </button>
            )}
          </div>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="mt-6">
          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Rechercher par numéro d'ordre, wagon, marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex space-x-3">
              <select
                value={situationFilter}
                onChange={(e) => setSituationFilter(e.target.value)}
                className="block border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5"
              >
                <option value="all">Toutes les situations</option>
                <option value="EN EXPLOITATION">En exploitation</option>
                <option value="DEMANDE">Demandé</option>
                <option value="null">Non défini</option>
              </select>
              <input
                type="text"
                placeholder="Filtrer par wagon..."
                value={wagonFilter}
                onChange={(e) => setWagonFilter(e.target.value)}
                className="block border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 px-3"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FilterIcon />
                <span className="ml-1">Filtres</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.width} px-4 py-4 text-${column.align} text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors group`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    <span className="group-hover:text-indigo-200 transition-colors">{column.label}</span>
                    {sortField === column.key ? (
                      <SortIcon />
                    ) : (
                      <svg className="ml-1 h-4 w-4 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="w-32 px-4 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((essieu, index) => (
              <tr key={essieu.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-${columns[0].align}`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {essieu.serie}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-${columns[1].align}`}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                    {essieu.post}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-${columns[2].align}`}>
                  <span className="font-mono text-indigo-600">{essieu.numero_ordre}</span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[3].align}`}>
                  {essieu.date_rev}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[4].align}`}>
                  {essieu.mise_sce_rmt}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-${columns[5].align}`}>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-semibold">
                    {essieu.d_roue}mm
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-${columns[6].align}`}>
                  <span className="font-mono text-slate-700">{essieu.wagon}</span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[7].align}`}>
                  {essieu.bogie1}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[8].align}`}>
                  {essieu.bogie2}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-${columns[9].align}`}>
                  <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${getSituationStyle(essieu.situation)}`}>
                    {getSituationIcon(essieu.situation)}
                    {essieu.situation || 'Non défini'}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[10].align}`}>
                  <span className="font-medium">{essieu.age_revision_jours}</span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[11].align}`}>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                    {essieu.age_calage_annee} ans
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-${columns[12].align}`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {essieu.marque}
                  </span>
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(essieu)}
                          className="inline-flex items-center p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <EditIcon />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(essieu)}
                          className="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-semibold text-gray-900">{startIndex + 1}</span> à{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(startIndex + itemsPerPage, sortedData.length)}
                </span>{' '}
                sur <span className="font-semibold text-gray-900">{sortedData.length}</span> résultats
              </p>
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Filtré
                </span>
              )}
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
