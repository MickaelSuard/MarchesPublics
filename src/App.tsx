import { MarchePublic } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { generateId } from './utils/dataManager';

function App() {
  const [marches, setMarches] = useLocalStorage<MarchePublic[]>('marches-publics', []);

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