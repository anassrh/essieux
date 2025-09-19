'use client';

import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import EMSILogo from '@/components/ui/EMSILogo';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header avec utilisateur connecté */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <EMSILogo size="sm" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Gestion des Essieux</h2>
                <p className="text-sm text-gray-500">EMSI - Système de Gestion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Connecté en tant que <span className="font-medium text-gray-900">YOUNES GUERMAT</span>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
