import { MarchePublic } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { generateId } from './utils/dataManager';
import { useAlert } from './context/AlertContext';

function App() {
  const [marches, setMarches] = useLocalStorage<MarchePublic[]>('marches-publics', []);
  const { showAlert } = useAlert();

  const handleCreateMarche = (data: Omit<MarchePublic, 'id' | 'dateCreation' | 'dateModification'>) => {
    const newMarche: MarchePublic = {
      ...data,
      id: generateId(),
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };
    setMarches([...marches, newMarche]);
    showAlert('Marché créé avec succès', 'success');
  };

  const handleUpdateMarche = (updatedMarche: MarchePublic) => {
    setMarches(marches.map(m => m.id === updatedMarche.id ? updatedMarche : m));
    showAlert('Marché mis à jour', 'success');
  };

  const handleDeleteMarche = (id: string) => {
    setMarches(marches.filter(m => m.id !== id));
    showAlert('Marché supprimé', 'success');
  };

  const handleImportData = (importedMarches: MarchePublic[]) => {
    // Fusionner avec les données existantes
    const existingIds = new Set(marches.map(m => m.id));
    const newMarches = importedMarches.filter(m => !existingIds.has(m.id));
    setMarches([...marches, ...newMarches]);
    showAlert(`${newMarches.length} marché(s) importé(s)`, 'success');
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