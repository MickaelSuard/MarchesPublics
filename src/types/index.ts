export interface MarchePublic {
  id: string;
  titre: string;
  universite: string;
  nombreAnnees: number;
  statut: 'en_cours' | 'termine' | 'suspendu' | 'en_attente';
  montant: number;
  dateDebut: string;
  dateFin: string;
  description: string;
  documents: Document[];
  notes: Note[];
  dateCreation: string;
  dateModification: string;
}

export interface Document {
  id: string;
  nom: string;
  type: string;
  taille: number;
  dateAjout: string;
  contenu?: string; // Pour les documents texte
}

export interface Note {
  id: string;
  contenu: string;
  dateCreation: string;
  auteur: string;
}

export interface FilterOptions {
  statut: string;
  universite: string;
  recherche: string;
}