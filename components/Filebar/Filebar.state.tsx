import { DocumentFile } from '@/types/documentFile'

export interface FilebarInitialState {
    searchTerm: string;
    filteredFiles: DocumentFile[];
}

export const initialState: FilebarInitialState = {
    searchTerm: '',
    filteredFiles: [],
};
