import React, { useState, useEffect } from 'react';
import { MarchePublic } from '../types';
import { X, Save, Calendar,Euro, Clock, FileText } from 'lucide-react';
import { DocumentManager } from './DocumentManager';
import { NotesSection } from './NotesSection';

interface MarketFormProps {
  marche?: MarchePublic | null;
  onSubmit: (marche: Omit<MarchePublic, 'id' | 'dateCreation' | 'dateModification'>) => void;
  onCancel: () => void;
}

export function MarketForm({ marche, onSubmit, onCancel }: MarketFormProps) {
  const [formData, setFormData] = useState<Omit<MarchePublic, 'id' | 'dateCreation' | 'dateModification'>>({
    titre: '',
    universite: '',
    nombreAnnees: 1,
    statut: 'en_attente',
    montant: 0,
    dateDebut: '',
    dateFin: '',
    description: '',
    documents: [],
    notes: []
  });

  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (marche) {
      setFormData({
        titre: marche.titre,
        universite: marche.universite,
        nombreAnnees: marche.nombreAnnees,
        statut: marche.statut,
        montant: marche.montant,
        dateDebut: marche.dateDebut,
        dateFin: marche.dateFin,
        description: marche.description,
        documents: marche.documents,
        notes: marche.notes
      });
    }
  }, [marche]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis';
    if (!formData.universite.trim()) newErrors.universite = 'L\'université est requise';
    if (formData.nombreAnnees < 1) newErrors.nombreAnnees = 'Le nombre d\'années doit être positif';
    if (formData.montant < 0) newErrors.montant = 'Le montant ne peut pas être négatif';
    if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
    if (!formData.dateFin) newErrors.dateFin = 'La date de fin est requise';
    if (formData.dateDebut && formData.dateFin && new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      newErrors.dateFin = 'La date de fin doit être après la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const tabs = [
    { id: 'general', label: 'Informations générales', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {marche ? 'Modifier le marché' : 'Nouveau marché public'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du marché *
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => updateFormData('titre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.titre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nom du marché public"
            />
            {errors.titre && <p className="mt-1 text-sm text-red-600">{errors.titre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Université *
            </label>
            <input
              type="text"
              value={formData.universite}
              onChange={(e) => updateFormData('universite', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.universite ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nom de l'université"
            />
            {errors.universite && <p className="mt-1 text-sm text-red-600">{errors.universite}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Nombre d'années *
            </label>
            <input
              type="number"
              min="1"
              value={formData.nombreAnnees}
              onChange={(e) => updateFormData('nombreAnnees', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombreAnnees ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.nombreAnnees && <p className="mt-1 text-sm text-red-600">{errors.nombreAnnees}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.statut}
              onChange={(e) => updateFormData('statut', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="suspendu">Suspendu</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Euro className="w-4 h-4 inline mr-1" />
              Montant (€) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.montant}
              onChange={(e) => updateFormData('montant', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.montant ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.montant && <p className="mt-1 text-sm text-red-600">{errors.montant}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date de début *
            </label>
            <input
              type="date"
              value={formData.dateDebut}
              onChange={(e) => updateFormData('dateDebut', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dateDebut ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.dateDebut && <p className="mt-1 text-sm text-red-600">{errors.dateDebut}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date de fin *
            </label>
            <input
              type="date"
              value={formData.dateFin}
              onChange={(e) => updateFormData('dateFin', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dateFin ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.dateFin && <p className="mt-1 text-sm text-red-600">{errors.dateFin}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description détaillée du marché public"
            />
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <DocumentManager
          documents={formData.documents}
          onDocumentsChange={(documents) => updateFormData('documents', documents)}
        />
      )}

      {activeTab === 'notes' && (
        <NotesSection
          notes={formData.notes}
          onNotesChange={(notes) => updateFormData('notes', notes)}
        />
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {marche ? 'Mettre à jour' : 'Créer le marché'}
        </button>
      </div>
    </form>
  );
}