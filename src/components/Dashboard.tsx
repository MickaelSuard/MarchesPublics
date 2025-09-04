import React, { useState } from 'react';
import { MarchePublic, FilterOptions } from '../types';
import { Search, Filter, Plus, Download, Upload, FileText } from 'lucide-react';
import { MarketCard } from './MarketCard';
import { MarketForm } from './MarketForm';
import { exportData, importData } from '../utils/dataManager';

interface DashboardProps {
  marches: MarchePublic[];
  onCreateMarche: (marche: Omit<MarchePublic, 'id' | 'dateCreation' | 'dateModification'>) => void;
  onUpdateMarche: (marche: MarchePublic) => void;
  onDeleteMarche: (id: string) => void;
  onImportData: (marches: MarchePublic[]) => void;
}

export function Dashboard({ 
  marches, 
  onCreateMarche, 
  onUpdateMarche, 
  onDeleteMarche,
  onImportData
}: DashboardProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    statut: '',
    universite: '',
    recherche: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingMarche, setEditingMarche] = useState<MarchePublic | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedData = await importData(file);
          onImportData(importedData);
          alert(`${importedData.length} marchés importés avec succès!`);
        } catch (error) {
          alert('Erreur lors de l\'import: ' + (error as Error).message);
        }
      }
    };
    input.click();
  };

  const filteredMarches = marches.filter(marche => {
    const matchStatut = !filters.statut || marche.statut === filters.statut;
    const matchUniversite = !filters.universite || marche.universite.toLowerCase().includes(filters.universite.toLowerCase());
    const matchRecherche = !filters.recherche || 
      marche.titre.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      marche.description.toLowerCase().includes(filters.recherche.toLowerCase());
    
    return matchStatut && matchUniversite && matchRecherche;
  });

  const stats = {
    total: marches.length,
    enCours: marches.filter(m => m.statut === 'en_cours').length,
    termines: marches.filter(m => m.statut === 'termine').length,
    montantTotal: marches.reduce((sum, m) => sum + m.montant, 0)
  };

  const universites = Array.from(new Set(marches.map(m => m.universite)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Marchés Publics</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportData(marches)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <button
                onClick={handleImport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau marché
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-green-600">{stats.enCours}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-600">{stats.termines}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant total</p>
                <p className="text-2xl font-bold text-orange-600">{stats.montantTotal.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                value={filters.recherche}
                onChange={(e) => setFilters({ ...filters, recherche: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.statut}
                  onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="en_attente">En attente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Université</label>
                <select
                  value={filters.universite}
                  onChange={(e) => setFilters({ ...filters, universite: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les universités</option>
                  {universites.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMarches.map(marche => (
            <MarketCard
              key={marche.id}
              marche={marche}
              onEdit={(marche) => {
                setEditingMarche(marche);
                setShowForm(true);
              }}
              onDelete={onDeleteMarche}
            />
          ))}
        </div>

        {filteredMarches.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun marché trouvé</h3>
            <p className="text-gray-500">
              {marches.length === 0 
                ? "Commencez par ajouter votre premier marché public"
                : "Essayez de modifier vos filtres de recherche"
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <MarketForm
              marche={editingMarche}
              onSubmit={(data) => {
                if (editingMarche) {
                  onUpdateMarche({ ...editingMarche, ...data, dateModification: new Date().toISOString() });
                } else {
                  onCreateMarche(data);
                }
                setShowForm(false);
                setEditingMarche(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingMarche(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}