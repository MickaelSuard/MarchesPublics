import React, { useEffect } from 'react';
import { MarchePublic } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { generateId } from './utils/dataManager';

function App() {
  const [marches, setMarches] = useLocalStorage<MarchePublic[]>('marches-publics', []);

  // Données d'exemple si aucune donnée n'existe
  useEffect(() => {
    if (marches.length === 0) {
      const exemplesMarches: MarchePublic[] = [
        {
          id: generateId(),
          titre: 'Infrastructure IT Campus Nord',
          universite: 'Université de Lille',
          nombreAnnees: 3,
          statut: 'en_cours',
          montant: 150000,
          dateDebut: '2024-01-15',
          dateFin: '2026-12-31',
          description: 'Modernisation complète de l\'infrastructure informatique du campus nord incluant serveurs, réseaux et équipements.',
          documents: [],
          notes: [
            {
              id: generateId(),
              contenu: 'Réunion initiale programmée pour la semaine prochaine avec l\'équipe technique.',
              dateCreation: new Date().toISOString(),
              auteur: 'Marie Dubois'
            }
          ],
          dateCreation: new Date().toISOString(),
          dateModification: new Date().toISOString()
        },
        {
          id: generateId(),
          titre: 'Rénovation Bibliothèque Centrale',
          universite: 'Université Paris-Saclay',
          nombreAnnees: 2,
          statut: 'en_attente',
          montant: 250000,
          dateDebut: '2024-06-01',
          dateFin: '2026-05-31',
          description: 'Rénovation complète de la bibliothèque centrale avec création d\'espaces collaboratifs et mise aux normes énergétiques.',
          documents: [],
          notes: [],
          dateCreation: new Date().toISOString(),
          dateModification: new Date().toISOString()
        }
      ];
      setMarches(exemplesMarches);
    }
  }, [marches.length, setMarches]);

  const handleCreateMarche = (data: Omit<MarchePublic, 'id' | 'dateCreation' | 'dateModification'>) => {
    const newMarche: MarchePublic = {
      ...data,
      id: generateId(),
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };
    setMarches([...marches, newMarche]);
  };

  const handleUpdateMarche = (updatedMarche: MarchePublic) => {
    setMarches(marches.map(m => m.id === updatedMarche.id ? updatedMarche : m));
  };

  const handleDeleteMarche = (id: string) => {
    setMarches(marches.filter(m => m.id !== id));
  };

  const handleImportData = (importedMarches: MarchePublic[]) => {
    // Fusionner avec les données existantes
    const existingIds = new Set(marches.map(m => m.id));
    const newMarches = importedMarches.filter(m => !existingIds.has(m.id));
    setMarches([...marches, ...newMarches]);
  };

  return (
    <Dashboard
      marches={marches}
      onCreateMarche={handleCreateMarche}
      onUpdateMarche={handleUpdateMarche}
      onDeleteMarche={handleDeleteMarche}
      onImportData={handleImportData}
    />
  );
}

export default App;