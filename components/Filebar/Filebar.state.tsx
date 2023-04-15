import { File } from '@/types/file'

export interface FilebarInitialState {
    searchTerm: string;
    filteredFiles: File[];
}

export const initialState: FilebarInitialState = {
    searchTerm: '',
    filteredFiles: [],
};
