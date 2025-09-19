'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getEssieux, getTravailleurs } from '@/lib/database';
import { Essieu, Travailleur } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Icônes pour les cartes
const ShoppingCartIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);


const ChartBarIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);





export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('essieux');
  const [essieux, setEssieux] = useState<Essieu[]>([]);
  const [travailleurs, setTravailleurs] = useState<Travailleur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [essieuxData, travailleursData] = await Promise.all([
        getEssieux(),
        getTravailleurs()
      ]);
      setEssieux(essieuxData);
      setTravailleurs(travailleursData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques essieux
  const totalEssieux = essieux.length;
  const essieuxEnExploitation = essieux.filter(e => e.situation === 'EN EXPLOITATION').length;
  const essieuxEnDemande = essieux.filter(e => e.situation === 'DEMANDE').length;
  const essieuxSansSituation = essieux.filter(e => e.situation === null).length;
  
  // Calcul des statistiques travailleurs
  const totalTravailleurs = travailleurs.length;
  const travailleursActifs = travailleurs.filter(t => t.statut === 'ACTIF').length;
  const travailleursEnConge = travailleurs.filter(t => t.statut === 'CONGE').length;
  const travailleursInactifs = travailleurs.filter(t => t.statut === 'INACTIF').length;
  
  // Calcul des métriques avancées
  const totalInterventions = travailleurs.reduce((sum, t) => sum + t.interventions_realisees, 0);
  const moyenneNote = travailleurs.length > 0 ? travailleurs.reduce((sum, t) => sum + t.note_moyenne, 0) / travailleurs.length : 0;
  const totalEssieuxAssignes = travailleurs.reduce((sum, t) => sum + t.essieux_assignes, 0);
  
  // Métriques essieux avancées
  const essieuxParSerie = essieux.reduce((acc, e) => {
    acc[e.serie] = (acc[e.serie] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  
  const ageMoyenCalage = essieux.length > 0 ? essieux.reduce((sum, e) => sum + e.age_calage_annee, 0) / essieux.length : 0;
  const diametreMoyenRoue = essieux.length > 0 ? essieux.reduce((sum, e) => sum + e.d_roue, 0) / essieux.length : 0;
  
  // Métriques travailleurs avancées
  const travailleursParNiveau = travailleurs.reduce((acc, t) => {
    acc[t.niveau] = (acc[t.niveau] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const meilleurTechnicien = travailleurs.length > 0 ? travailleurs.reduce((best, current) => 
    current.note_moyenne > best.note_moyenne ? current : best
  ) : null;
  
  const technicienPlusProductif = travailleurs.length > 0 ? travailleurs.reduce((best, current) => 
    current.interventions_realisees > best.interventions_realisees ? current : best
  ) : null;
  
  // Répartition par spécialité
  const specialites = travailleurs.reduce((acc, t) => {
    acc[t.specialite] = (acc[t.specialite] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Répartition par marque d'essieux
  const marques = essieux.reduce((acc, e) => {
    acc[e.marque] = (acc[e.marque] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Statistiques de performance
  const tauxOccupation = (totalEssieuxAssignes / totalEssieux) * 100;
  const efficaciteEquipe = (totalInterventions / totalTravailleurs).toFixed(1);
  const diversiteSpecialites = Object.keys(specialites).length;

  const tabs = [
    { key: 'essieux', label: 'Essieux' },
    { key: 'travailleurs', label: 'Travailleurs' },
    { key: 'performance', label: 'Performance' },
    { key: 'specialites', label: 'Spécialités' },
    { key: 'marques', label: 'Marques' },
    { key: 'analyses', label: 'Analyses Avancées' }
  ];

  // Gestion du chargement
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

  // Gestion des erreurs
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">❌ Erreur</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadData}
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
        {/* En-tête avec titre et actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Essieux</h1>
            <p className="mt-2 text-sm text-gray-600">
              Vue d&apos;ensemble du parc d&apos;essieux et de l&apos;équipe technique
            </p>
          </div>
              <div className="flex space-x-3">
                <button
                  onClick={loadData}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualiser
                </button>
                <a 
                  href="/essieux"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCartIcon />
                  <span className="ml-2">Voir les essieux →</span>
                </a>
              </div>
        </div>


        {/* Cartes de métriques */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Essieux - Bleu Professionnel */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #317AC1' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#317AC1' }}>
                  <ShoppingCartIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#317AC1' }}>Total Essieux</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalEssieux}</p>
                <p className="text-sm font-medium" style={{ color: '#317AC1' }}>{essieuxEnExploitation} en exploitation</p>
              </div>
            </div>
          </div>

          {/* Essieux en Demande - Orange Vif */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #F27438' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F27438' }}>
                  <ClockIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#F27438' }}>En Demande</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{essieuxEnDemande}</p>
                <p className="text-sm font-medium" style={{ color: '#F27438' }}>Nécessitent attention</p>
              </div>
            </div>
          </div>

          {/* Techniciens Actifs - Bleu Turquoise */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #00A0B0' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00A0B0' }}>
                  <ChartBarIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#00A0B0' }}>Techniciens Actifs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{travailleursActifs}</p>
                <p className="text-sm font-medium" style={{ color: '#00A0B0' }}>Sur {totalTravailleurs} total</p>
              </div>
            </div>
          </div>

          {/* Interventions Total - Rose Vif */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #FE277E' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FE277E' }}>
                  <CheckIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#FE277E' }}>Interventions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalInterventions}</p>
                <p className="text-sm font-medium" style={{ color: '#FE277E' }}>Note moyenne: {moyenneNote.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nouvelles cartes de métriques avancées */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Âge Moyen Calage - Rouge Bordeaux */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #A7001E' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#A7001E' }}>
                  <ClockIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#A7001E' }}>Âge Moyen Calage</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{ageMoyenCalage.toFixed(1)}</p>
                <p className="text-sm font-medium" style={{ color: '#A7001E' }}>années</p>
              </div>
            </div>
          </div>

          {/* Diamètre Moyen Roue - Vert Lime */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #A4BD01' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#A4BD01' }}>
                  <ChartBarIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#A4BD01' }}>Diamètre Moyen</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{diametreMoyenRoue.toFixed(0)}</p>
                <p className="text-sm font-medium" style={{ color: '#A4BD01' }}>mm</p>
              </div>
            </div>
          </div>

          {/* Taux Occupation - Bleu Foncé */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #2E3244' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2E3244' }}>
                  <CheckIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#2E3244' }}>Taux Occupation</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{tauxOccupation.toFixed(1)}%</p>
                <p className="text-sm font-medium" style={{ color: '#2E3244' }}>Essieux assignés</p>
              </div>
            </div>
          </div>

          {/* Efficacité Équipe - Orange Vif */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeft: '4px solid #F27438' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F27438' }}>
                  <ChartBarIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#F27438' }}>Efficacité Équipe</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{efficaciteEquipe}</p>
                <p className="text-sm font-medium" style={{ color: '#F27438' }}>interventions/technicien</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique Essieux par Situation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Répartition des Essieux</h3>
              <p className="text-sm text-gray-600 mt-1">Distribution par situation</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#317AC1' }}></div>
                    <span className="text-sm font-semibold text-gray-800">En Exploitation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-48 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${(essieuxEnExploitation / totalEssieux) * 100}%` }}>
                        <span className="text-xs font-bold text-white">{essieuxEnExploitation}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{((essieuxEnExploitation / totalEssieux) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#F27438' }}></div>
                    <span className="text-sm font-semibold text-gray-800">En Demande</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-48 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${(essieuxEnDemande / totalEssieux) * 100}%` }}>
                        <span className="text-xs font-bold text-white">{essieuxEnDemande}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{((essieuxEnDemande / totalEssieux) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#A7001E' }}></div>
                    <span className="text-sm font-semibold text-gray-800">Sans Situation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-48 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${(essieuxSansSituation / totalEssieux) * 100}%` }}>
                        <span className="text-xs font-bold text-white">{essieuxSansSituation}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{((essieuxSansSituation / totalEssieux) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique Techniciens par Statut */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Équipe Technique</h3>
              <p className="text-sm text-gray-600 mt-1">Répartition par statut</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#00A0B0' }}></div>
                    <span className="text-sm font-semibold text-gray-800">Actifs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-48 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${(travailleursActifs / totalTravailleurs) * 100}%` }}>
                        <span className="text-xs font-bold text-white">{travailleursActifs}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{((travailleursActifs / totalTravailleurs) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#F27438' }}></div>
                    <span className="text-sm font-semibold text-gray-800">En Congé</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-48 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${(travailleursEnConge / totalTravailleurs) * 100}%` }}>
                        <span className="text-xs font-bold text-white">{travailleursEnConge}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{((travailleursEnConge / totalTravailleurs) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#A7001E' }}></div>
                    <span className="text-sm font-semibold text-gray-800">Inactifs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-48 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${(travailleursInactifs / totalTravailleurs) * 100}%` }}>
                        <span className="text-xs font-bold text-white">{travailleursInactifs}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{((travailleursInactifs / totalTravailleurs) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Graphiques Avancés */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique Donut - Situation des Essieux */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Situation des Essieux</h3>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  {/* Donut Chart */}
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    {/* En Exploitation */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#317AC1"
                      strokeWidth="8"
                      strokeDasharray={`${(essieuxEnExploitation / totalEssieux) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    {/* En Demande */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#F27438"
                      strokeWidth="8"
                      strokeDasharray={`${(essieuxEnDemande / totalEssieux) * 251.2} 251.2`}
                      strokeDashoffset={`-${(essieuxEnExploitation / totalEssieux) * 251.2}`}
                    />
                    {/* Sans Situation */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#A7001E"
                      strokeWidth="8"
                      strokeDasharray={`${(essieuxSansSituation / totalEssieux) * 251.2} 251.2`}
                      strokeDashoffset={`-${((essieuxEnExploitation + essieuxEnDemande) / totalEssieux) * 251.2}`}
                    />
                  </svg>
                  {/* Centre du donut */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {((essieuxEnExploitation / totalEssieux) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">En Exploitation</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Légende */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#317AC1' }}></div>
                  <span className="text-sm font-semibold text-gray-800">En Exploitation</span>
                  <span className="ml-auto text-sm font-bold text-gray-900">{essieuxEnExploitation}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#F27438' }}></div>
                  <span className="text-sm font-semibold text-gray-800">En Demande</span>
                  <span className="ml-auto text-sm font-bold text-gray-900">{essieuxEnDemande}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#A7001E' }}></div>
                  <span className="text-sm font-semibold text-gray-800">Sans Situation</span>
                  <span className="ml-auto text-sm font-bold text-gray-900">{essieuxSansSituation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique Spécialités */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Spécialités Techniques</h3>
              <p className="text-sm text-gray-600 mt-1">Répartition par domaine d&apos;expertise</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(specialites).map(([specialite, count], index) => {
                  const colors = ['#317AC1', '#00A0B0', '#FE277E', '#F27438', '#A7001E', '#A4BD01', '#2E3244'];
                  const color = colors[index % colors.length];
                  const countNumber = count as number;
                  const percentage = ((countNumber / totalTravailleurs) * 100).toFixed(1);
                  return (
                    <div key={specialite} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-semibold text-gray-800">{specialite}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                          <div className="h-3 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{countNumber}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Graphique Marques */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Marques d&apos;Essieux</h3>
              <p className="text-sm text-gray-600 mt-1">Distribution par fabricant</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(marques).map(([marque, count], index) => {
                  const colors = ['#FE277E', '#317AC1', '#00A0B0', '#F27438', '#A7001E', '#A4BD01', '#2E3244'];
                  const color = colors[index % colors.length];
                  const countNumber = count as number;
                  const percentage = ((countNumber / totalEssieux) * 100).toFixed(1);
                  return (
                    <div key={marque} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-semibold text-gray-800">{marque}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                          <div className="h-3 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{countNumber}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section Analyses */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Analyses Avancées</h3>
            <p className="text-sm text-gray-600 mt-1">Données détaillées et insights métier</p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedTab === tab.key
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={selectedTab === tab.key ? { backgroundColor: '#317AC1' } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {selectedTab === 'essieux' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #317AC1' }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#317AC1' }}></div>
                      <span className="text-sm font-semibold" style={{ color: '#317AC1' }}>En Exploitation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                        <div className="h-3 rounded-full" style={{ width: `${(essieuxEnExploitation / totalEssieux) * 100}%`, backgroundColor: '#317AC1' }}></div>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#317AC1' }}>{essieuxEnExploitation}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #F27438' }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#F27438' }}></div>
                      <span className="text-sm font-semibold" style={{ color: '#F27438' }}>En Demande</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                        <div className="h-3 rounded-full" style={{ width: `${(essieuxEnDemande / totalEssieux) * 100}%`, backgroundColor: '#F27438' }}></div>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#F27438' }}>{essieuxEnDemande}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #A7001E' }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#A7001E' }}></div>
                      <span className="text-sm font-semibold" style={{ color: '#A7001E' }}>Sans Situation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                        <div className="h-3 rounded-full" style={{ width: `${(essieuxSansSituation / totalEssieux) * 100}%`, backgroundColor: '#A7001E' }}></div>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#A7001E' }}>{essieuxSansSituation}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTab === 'travailleurs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #00A0B0' }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#00A0B0' }}></div>
                      <span className="text-sm font-semibold" style={{ color: '#00A0B0' }}>Actifs</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                        <div className="h-3 rounded-full" style={{ width: `${(travailleursActifs / totalTravailleurs) * 100}%`, backgroundColor: '#00A0B0' }}></div>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#00A0B0' }}>{travailleursActifs}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #F27438' }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#F27438' }}></div>
                      <span className="text-sm font-semibold" style={{ color: '#F27438' }}>En Congé</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                        <div className="h-3 rounded-full" style={{ width: `${(travailleursEnConge / totalTravailleurs) * 100}%`, backgroundColor: '#F27438' }}></div>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#F27438' }}>{travailleursEnConge}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #A7001E' }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#A7001E' }}></div>
                      <span className="text-sm font-semibold" style={{ color: '#A7001E' }}>Inactifs</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                        <div className="h-3 rounded-full" style={{ width: `${(travailleursInactifs / totalTravailleurs) * 100}%`, backgroundColor: '#A7001E' }}></div>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#A7001E' }}>{travailleursInactifs}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: '#00A0B0' }}>
                          <CheckIcon />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Meilleur Technicien</h4>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        {meilleurTechnicien ? `${meilleurTechnicien.prenom} ${meilleurTechnicien.nom}` : 'Aucun technicien'}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: '#317AC1' }}>
                        Note: {meilleurTechnicien ? `${meilleurTechnicien.note_moyenne}/10` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Spécialité: {meilleurTechnicien ? meilleurTechnicien.specialite : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: '#F27438' }}>
                          <ChartBarIcon />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Plus Productif</h4>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        {technicienPlusProductif ? `${technicienPlusProductif.prenom} ${technicienPlusProductif.nom}` : 'Aucun technicien'}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: '#A7001E' }}>
                        {technicienPlusProductif ? `${technicienPlusProductif.interventions_realisees} interventions` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Niveau: {technicienPlusProductif ? technicienPlusProductif.niveau : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #2E3244' }}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#2E3244' }}></div>
                        <span className="text-sm font-semibold" style={{ color: '#2E3244' }}>Taux Occupation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                          <div className="h-3 rounded-full" style={{ width: `${tauxOccupation}%`, backgroundColor: '#2E3244' }}></div>
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#2E3244' }}>{tauxOccupation.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: '4px solid #F27438' }}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: '#F27438' }}></div>
                        <span className="text-sm font-semibold" style={{ color: '#F27438' }}>Efficacité Équipe</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                          <div className="h-3 rounded-full" style={{ width: `${Math.min(100, (parseFloat(efficaciteEquipe) / 50) * 100)}%`, backgroundColor: '#F27438' }}></div>
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#F27438' }}>{efficaciteEquipe}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTab === 'specialites' && (
                <div className="space-y-3">
                  {Object.entries(specialites).map(([specialite, count], index) => {
                    const colors = ['#317AC1', '#00A0B0', '#FE277E', '#F27438', '#A7001E', '#A4BD01', '#2E3244'];
                    const color = colors[index % colors.length];
                    const countNumber = count as number;
                    return (
                      <div key={specialite} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: `4px solid ${color}` }}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: color }}></div>
                          <span className="text-sm font-semibold" style={{ color: color }}>{specialite}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                            <div className="h-3 rounded-full" style={{ width: `${(countNumber / totalTravailleurs) * 100}%`, backgroundColor: color }}></div>
                          </div>
                          <span className="text-lg font-bold" style={{ color: color }}>{countNumber}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {selectedTab === 'marques' && (
                <div className="space-y-3">
                  {Object.entries(marques).map(([marque, count], index) => {
                    const colors = ['#FE277E', '#317AC1', '#00A0B0', '#F27438', '#A7001E', '#A4BD01', '#2E3244'];
                    const color = colors[index % colors.length];
                    const countNumber = count as number;
                    return (
                      <div key={marque} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg" style={{ borderLeft: `4px solid ${color}` }}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: color }}></div>
                          <span className="text-sm font-semibold" style={{ color: color }}>{marque}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-40 bg-gray-300 rounded-full h-3 mr-4">
                            <div className="h-3 rounded-full" style={{ width: `${(countNumber / totalEssieux) * 100}%`, backgroundColor: color }}></div>
                          </div>
                          <span className="text-lg font-bold" style={{ color: color }}>{countNumber}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {selectedTab === 'analyses' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Répartition par Niveau</h4>
                      <div className="space-y-2">
                        {Object.entries(travailleursParNiveau).map(([niveau, count]) => (
                          <div key={niveau} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">{niveau}</span>
                            <span className="text-sm font-semibold text-gray-900">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Essieux par Série</h4>
                      <div className="space-y-2">
                        {Object.entries(essieuxParSerie).map(([serie, count]) => (
                          <div key={serie} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Série {serie}</span>
                            <span className="text-sm font-semibold text-gray-900">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Diversité des Compétences</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Spécialités différentes</span>
                      <span className="text-lg font-bold text-gray-900">{diversiteSpecialites}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Résumé Rapide */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Résumé Rapide</h3>
            <p className="text-sm text-gray-600 mt-1">Indicateurs clés de performance</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300" style={{ borderLeft: '4px solid #317AC1' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#317AC1' }}>
                    <CheckIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold" style={{ color: '#317AC1' }}>Essieux en Exploitation</p>
                  <p className="text-xs text-gray-600">Fonctionnels</p>
                  <p className="text-xl font-bold" style={{ color: '#317AC1' }}>{essieuxEnExploitation}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300" style={{ borderLeft: '4px solid #F27438' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F27438' }}>
                    <ClockIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold" style={{ color: '#F27438' }}>Essieux en Demande</p>
                  <p className="text-xs text-gray-600">Nécessitent attention</p>
                  <p className="text-xl font-bold" style={{ color: '#F27438' }}>{essieuxEnDemande}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300" style={{ borderLeft: '4px solid #2E3244' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2E3244' }}>
                    <ChartBarIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold" style={{ color: '#2E3244' }}>Essieux Assignés</p>
                  <p className="text-xs text-gray-600">Aux techniciens</p>
                  <p className="text-xl font-bold" style={{ color: '#2E3244' }}>{totalEssieuxAssignes}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300" style={{ borderLeft: '4px solid #00A0B0' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00A0B0' }}>
                    <XIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold" style={{ color: '#00A0B0' }}>Note Moyenne</p>
                  <p className="text-xs text-gray-600">Performance équipe</p>
                  <p className="text-xl font-bold" style={{ color: '#00A0B0' }}>{moyenneNote.toFixed(1)}/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
      </Layout>
    </ProtectedRoute>
  );
}