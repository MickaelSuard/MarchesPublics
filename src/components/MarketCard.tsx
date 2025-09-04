import { MarchePublic } from '../types';
import { Calendar, Building2, Edit, Trash2, FileText, StickyNote, Clock, Euro, Eye } from 'lucide-react';

interface MarketCardProps {
  marche: MarchePublic;
  onEdit: (marche: MarchePublic) => void;
  onDelete: (id: string) => void;
  onView?: () => void; // nouvelle prop
}

const statusColors = {
  en_cours: 'bg-green-100 text-green-800 border-green-200',
  termine: 'bg-gray-100 text-gray-800 border-gray-200',
  suspendu: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  en_attente: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusLabels = {
  en_cours: 'En cours',
  termine: 'Terminé',
  suspendu: 'Suspendu',
  en_attente: 'En attente'
};

export function MarketCard({ marche, onEdit, onDelete, onView }: MarketCardProps) {
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce marché ?')) {
      onDelete(marche.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md  transition hover:scale-105 duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{marche.titre}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Building2 className="w-4 h-4 mr-1" />
              {marche.universite}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[marche.statut]}`}>
            {statusLabels[marche.statut]}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{marche.nombreAnnees} an{marche.nombreAnnees > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Euro className="w-4 h-4 mr-2 text-gray-400" />
            <span>{marche.montant.toLocaleString('fr-FR')}€</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {new Date(marche.dateDebut).toLocaleDateString('fr-FR')} - {' '}
            {new Date(marche.dateFin).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{marche.description}</p>

        {/* Documents and Notes indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {marche.documents.length > 0 && (
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                <span>{marche.documents.length} document{marche.documents.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {marche.notes.length > 0 && (
              <div className="flex items-center">
                <StickyNote className="w-4 h-4 mr-1" />
                <span>{marche.notes.length} note{marche.notes.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          {onView && (
            <button
              onClick={onView}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              Voir plus
            </button>
          )}

          <button
            onClick={() => onEdit(marche)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Supprimer
          </button>

        </div>
      </div>
    </div>
  );
}