import React, { useRef } from 'react';
import { Document } from '../types';
import { Plus, FileText, Download, Trash2, Upload } from 'lucide-react';
import { generateId } from '../utils/dataManager';
import { useAlert } from '../context/AlertContext';

interface DocumentManagerProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
}

export function DocumentManager({ documents, onDocumentsChange }: DocumentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newDoc: Document = {
          id: generateId(),
          nom: file.name,
          type: file.type || 'application/octet-stream',
          taille: file.size,
          dateAjout: new Date().toISOString(),
          contenu: event.target?.result as string
        };

        onDocumentsChange([...documents, newDoc]);
        showAlert('Document ajouté', 'success');
      };
      
      if (file.type.startsWith('text/') || file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (doc: Document) => {
    if (!doc.contenu) return;

    let blob;
    if (doc.contenu.startsWith('data:')) {
      // Base64 data
      const byteCharacters = atob(doc.contenu.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: doc.type });
    } else {
      // Text content
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

  const handleDelete = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
    showAlert('Document supprimé', 'success');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Documents</h3>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter document
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.json,.jpg,.jpeg,.png"
        />

        {/* Upload Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            Cliquez pour sélectionner des fichiers ou glissez-déposez ici
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOC, TXT, JSON, images supportés
          </p>
        </div>
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Documents ajoutés ({documents.length})
          </h4>
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.nom}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.taille)} • {new Date(doc.dateAjout).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}