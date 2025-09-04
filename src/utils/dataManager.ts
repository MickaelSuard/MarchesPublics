import { MarchePublic } from '../types';

export const exportData = (marches: MarchePublic[]) => {
  const dataStr = JSON.stringify(marches, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `marches_publics_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<MarchePublic[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data) && data.every(isValidMarche)) {
          resolve(data);
        } else {
          reject(new Error('Format de fichier invalide'));
        }
      } catch (error) {
        reject(new Error('Erreur lors de la lecture du fichier'));
      }
    };
    reader.readAsText(file);
  });
};

const isValidMarche = (obj: any): obj is MarchePublic => {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.titre === 'string' &&
    typeof obj.universite === 'string' &&
    typeof obj.nombreAnnees === 'number' &&
    ['en_cours', 'termine', 'suspendu', 'en_attente'].includes(obj.statut)
  );
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};