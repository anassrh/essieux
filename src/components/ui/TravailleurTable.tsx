'use client';

import { useState, useMemo } from 'react';
import { Travailleur } from '@/types';

interface TravailleurTableProps {
  data: Travailleur[];
  onEdit?: (travailleur: Travailleur) => void;
  onDelete?: (travailleur: Travailleur) => void;
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

const StarIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function TravailleurTable({ data, onEdit, onDelete, onAdd }: TravailleurTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('all');
  const [specialiteFilter, setSpecialiteFilter] = useState<string>('all');
  const [niveauFilter, setNiveauFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  const columns = [
    { key: 'matricule', label: 'Matricule', width: 'w-24', align: 'left' },
    { key: 'nom', label: 'Nom', width: 'w-32', align: 'left' },
    { key: 'prenom', label: 'Prénom', width: 'w-32', align: 'left' },
    { key: 'specialite', label: 'Spécialité', width: 'w-32', align: 'center' },
    { key: 'niveau', label: 'Niveau', width: 'w-24', align: 'center' },
    { key: 'statut', label: 'Statut', width: 'w-28', align: 'center' },
    { key: 'date_embauche', label: 'Date Embauche', width: 'w-28', align: 'center' },
    { key: 'telephone', label: 'Téléphone', width: 'w-32', align: 'left' },
    { key: 'email', label: 'Email', width: 'w-48', align: 'left' },
    { key: 'essieux_assignes', label: 'Essieux Assignés', width: 'w-32', align: 'right' },
    { key: 'interventions_realisees', label: 'Interventions', width: 'w-28', align: 'right' },
    { key: 'note_moyenne', label: 'Note Moyenne', width: 'w-28', align: 'right' },
    { key: 'derniere_intervention', label: 'Dernière Intervention', width: 'w-36', align: 'center' },
    { key: 'competences', label: 'Compétences', width: 'w-48', align: 'left' }
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
    return data.filter(travailleur => {
      const matchesSearch = Object.values(travailleur).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatut = statutFilter === 'all' || travailleur.statut === statutFilter;
      const matchesSpecialite = specialiteFilter === 'all' || travailleur.specialite === specialiteFilter;
      const matchesNiveau = niveauFilter === 'all' || travailleur.niveau === niveauFilter;
      
      return matchesSearch && matchesStatut && matchesSpecialite && matchesNiveau;
    });
  }, [data, searchTerm, statutFilter, specialiteFilter, niveauFilter]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField as keyof Travailleur];
      const bValue = b[sortField as keyof Travailleur];
      
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

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'en_conge':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'inactif':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'actif':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'en_conge':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      case 'inactif':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNiveauStyle = (niveau: string) => {
    switch (niveau) {
      case 'expert':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'senior':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'junior':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getSpecialiteStyle = (specialite: string) => {
    switch (specialite) {
      case 'Mécanique':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Électronique':
        return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      case 'Hydraulique':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getNoteColor = (note: number) => {
    if (note >= 4.5) return 'text-green-600';
    if (note >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const csvContent = [
      headers,
      ...sortedData.map(travailleur => 
        columns.map(col => {
          const value = travailleur[col.key as keyof Travailleur];
          if (col.key === 'competences') {
            return `"${(value as string[]).join('; ')}"`;
          }
          return value !== null && value !== undefined ? `"${value}"` : '""';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'travailleurs.csv');
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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Équipe Technique</h3>
              <p className="text-sm text-gray-600">
                {filteredData.length} techniciens • {data.filter(t => t.statut === 'ACTIF').length} actifs
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
                Ajouter un Technicien
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
                placeholder="Rechercher par nom, matricule, spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex space-x-3">
              <select
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="block border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="en_conge">En congé</option>
                <option value="inactif">Inactif</option>
              </select>
              <select
                value={specialiteFilter}
                onChange={(e) => setSpecialiteFilter(e.target.value)}
                className="block border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5"
              >
                <option value="all">Toutes spécialités</option>
                <option value="Mécanique">Mécanique</option>
                <option value="Électronique">Électronique</option>
                <option value="Hydraulique">Hydraulique</option>
              </select>
              <select
                value={niveauFilter}
                onChange={(e) => setNiveauFilter(e.target.value)}
                className="block border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5"
              >
                <option value="all">Tous niveaux</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="expert">Expert</option>
              </select>
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
            {paginatedData.map((travailleur, index) => (
              <tr key={travailleur.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-${columns[0].align}`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {travailleur.matricule}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-${columns[1].align}`}>
                  {travailleur.nom}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-${columns[2].align}`}>
                  {travailleur.prenom}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-${columns[3].align}`}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecialiteStyle(travailleur.specialite)}`}>
                    {travailleur.specialite}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-${columns[4].align}`}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNiveauStyle(travailleur.niveau)}`}>
                    {travailleur.niveau}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-${columns[5].align}`}>
                  <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${getStatutStyle(travailleur.statut)}`}>
                    {getStatutIcon(travailleur.statut)}
                    {travailleur.statut}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[6].align}`}>
                  {travailleur.date_embauche}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[7].align}`}>
                  <span className="font-mono">{travailleur.telephone}</span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[8].align}`}>
                  <span className="font-mono text-xs">{travailleur.email}</span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-${columns[9].align}`}>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                    {travailleur.essieux_assignes}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-${columns[10].align}`}>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                    {travailleur.interventions_realisees}
                  </span>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-${columns[11].align}`}>
                  <div className="flex items-center">
                    <StarIcon />
                    <span className={`ml-1 font-semibold ${getNoteColor(travailleur.note_moyenne)}`}>
                      {travailleur.note_moyenne}
                    </span>
                  </div>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[12].align}`}>
                  {travailleur.derniere_intervention}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-${columns[13].align}`}>
                  <div className="flex flex-wrap gap-1">
                    {travailleur.competences.slice(0, 2).map((competence, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {competence}
                      </span>
                    ))}
                    {travailleur.competences.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                        +{travailleur.competences.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(travailleur)}
                          className="inline-flex items-center p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <EditIcon />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(travailleur)}
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
