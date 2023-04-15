import { Dispatch, createContext } from 'react';
import { ActionType } from '@/hooks/useCreateReducer';
import { File } from '@/types/file'
import { FilebarInitialState } from "./Filebar.state";

export interface FilebarContextProps {
    state: FilebarInitialState;
    dispatch: Dispatch<ActionType<FilebarInitialState>>;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleButtonClick: () => void;
    handleDeleteFile: (file: File) => void;
    handleRenameFile: (file: File, name: string) => void;
}

const FilebarContext = createContext<FilebarContextProps>(undefined!);

export default FilebarContext;
