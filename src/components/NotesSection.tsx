import React, { useState } from 'react';
import { Note } from '../types';
import { Plus, Edit3, Trash2, Save, X, FileText } from 'lucide-react';
import { generateId } from '../utils/dataManager';

interface NotesSectionProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [authorName, setAuthorName] = useState('Utilisateur');

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: generateId(),
      contenu: newNote.trim(),
      dateCreation: new Date().toISOString(),
      auteur: authorName
    };

    onNotesChange([...notes, note]);
    setNewNote('');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.contenu);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    const updatedNotes = notes.map(note =>
      note.id === editingNote
        ? { ...note, contenu: editContent.trim() }
        : note
    );

    onNotesChange(updatedNotes);
    setEditingNote(null);
    setEditContent('');
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      onNotesChange(notes.filter(note => note.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes et commentaires</h3>
        
        {/* Add Note Form */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'auteur
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Votre nom"
            />
          </div>
          
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une note ou un commentaire..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter note
            </button>
          </div>
        </div>

        {/* Notes List */}
        {notes.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">
              Notes existantes ({notes.length})
            </h4>
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                {editingNote === note.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNote(null);
                          setEditContent('');
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{note.contenu}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Par {note.auteur} le {new Date(note.dateCreation).toLocaleDateString('fr-FR')} à{' '}
                        {new Date(note.dateCreation).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditNote(note)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucune note ajoutée pour ce marché</p>
          </div>
        )}
      </div>
    </div>
  );
}