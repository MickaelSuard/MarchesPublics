import { useState } from 'react';
import { MarchePublic, FilterOptions, Document } from '../types';
import { Search, Filter, Plus, Download, Upload, FileText, Clock, CheckCircle2, X, FileText as DocIcon, StickyNote, Download as DownloadIcon } from 'lucide-react';
import { MarketCard } from './MarketCard';
import { MarketForm } from './MarketForm';
import { exportData, importData } from '../utils/dataManager';
import { useAlert } from '../context/AlertContext';

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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<MarchePublic[] | null>(null);
  const [detailMarche, setDetailMarche] = useState<MarchePublic | null>(null);
  const { showAlert } = useAlert();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedData = await importData(file);
          setPendingImport(importedData);
          setImportModalOpen(true);
        } catch (error) {
          showAlert('Erreur lors de l\'import: ' + (error as Error).message, 'error');
        }
      }
    };
    input.click();
  };

  const confirmImport = () => {
    if (pendingImport) {
      // Remplacer le localStorage
      window.localStorage.setItem('marches-publics', JSON.stringify(pendingImport));
      onImportData(pendingImport);
      showAlert(`${pendingImport.length} marché(s) importé(s)`, 'success');
    }
    setImportModalOpen(false);
    setPendingImport(null);
  };

  const cancelImport = () => {
    setImportModalOpen(false);
    setPendingImport(null);
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

  // Téléchargement document depuis la modal
  const handleDownloadDoc = (doc: Document) => {
    if (!doc.contenu) return;
    let blob;
    if (doc.contenu.startsWith('data:')) {
      const byteCharacters = atob(doc.contenu.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: doc.type });
    } else {
      blob = new Blob([doc.contenu], { type: doc.type });
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nom;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                onClick={() => {
                  exportData(marches);
                  showAlert('Export JSON effectué', 'success');
                }}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 ">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition hover:scale-105 duration-200">
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
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition hover:scale-105 duration-200 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-green-600">{stats.enCours}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition hover:scale-105 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-600">{stats.termines}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition hover:scale-105 duration-200">
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
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
          {filteredMarches.map(marche => (
            <div key={marche.id}>
              <MarketCard
                marche={marche}
                onEdit={(marche) => {
                  setEditingMarche(marche);
                  setShowForm(true);
                }}
                onDelete={onDeleteMarche}
                onView={() => setDetailMarche(marche)}
              />
            </div>
          ))}
        </div>

        {filteredMarches.length === 0 && (
          <div className="text-center py-12 ">
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

      {/* Import Confirmation Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Importer des marchés publics</h3>
            <p className="text-gray-700 mb-4">
              Attention : Les éléments actuels non sauvegardés seront <span className="font-bold text-red-600">supprimés définitivement</span> et remplacés par ceux du fichier importé.<br />
              Voulez-vous continuer ?
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelImport}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmImport}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Oui, remplacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails marché */}
      {detailMarche && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setDetailMarche(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{detailMarche.titre}</h2>
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Université :</span> {detailMarche.universite}
            </div>
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Statut :</span> {detailMarche.statut}
            </div>
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Montant :</span> {detailMarche.montant.toLocaleString('fr-FR')} €
            </div>
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Période :</span> {new Date(detailMarche.dateDebut).toLocaleDateString('fr-FR')} - {new Date(detailMarche.dateFin).toLocaleDateString('fr-FR')}
            </div>
            <div className="mb-4 text-sm text-gray-700">
              <span className="font-semibold">Description :</span>
              <div className="mt-1 whitespace-pre-line">{detailMarche.description}</div>
            </div>
            {/* Documents */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <DocIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-semibold text-gray-800">Documents ({detailMarche.documents.length})</span>
              </div>
              {detailMarche.documents.length > 0 ? (
                <ul className="space-y-2">
                  {detailMarche.documents.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <span className="truncate">{doc.nom}</span>
                      <button
                        className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs flex items-center"
                        onClick={() => handleDownloadDoc(doc)}
                      >
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Télécharger
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">Aucun document</span>
              )}
            </div>
            {/* Notes */}
            <div>
              <div className="flex items-center mb-2">
                <StickyNote className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-semibold text-gray-800">Notes ({detailMarche.notes.length})</span>
              </div>
              {detailMarche.notes.length > 0 ? (
                <ul className="space-y-2">
                  {detailMarche.notes.map(note => (
                    <li key={note.id} className="bg-gray-50 rounded px-3 py-2">
                      <div className="text-xs text-gray-700 whitespace-pre-line">{note.contenu}</div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        Par {note.auteur} le {new Date(note.dateCreation).toLocaleDateString('fr-FR')} à {new Date(note.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">Aucune note</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}