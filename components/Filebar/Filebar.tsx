import { useRef, useContext, useEffect, useState, useCallback } from 'react';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { FilebarInitialState, initialState } from './Filebar.state';
import { IconFolderPlus, IconMistOff, IconPlus, IconFileText } from '@tabler/icons-react';
import { DocumentFile } from '@/types/documentFile';
import HomeContext from '@/pages/api/home/home.context';
import { saveFiles } from '@/utils/app/documentFiles';
import { Files } from './components/DocumentFiles';
import FilebarContext from './Filebar.context';

export const Filebar = () => {
  const fileBarContextValue = useCreateReducer<FilebarInitialState>({
    initialState,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state: {documentFiles, apiKey},
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredFiles },
    dispatch: fileDispatch,
  } = fileBarContextValue;

  const items = filteredFiles;

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const data = file && await handleUpload(file)
      const index = data.index
      console.log(index)
      handleCreateFile(file?.name || '', data.fileId)
      localStorage.setItem('vectorstore', JSON.stringify(index))
    }
    event.target.value = '';
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('api/upload', {
      method: 'POST',
      body: formData,
    });
    console.log(response)
    if (response.ok) {
      const data = await response.json();
      console.log('File uploaded successfully');
      return data;
    }
  };

  const handleCreateFile = (fileName: string, fileId: string) => {
    const newFile: DocumentFile = {
        id: fileId,
        name: fileName || `DocumentFile ${documentFiles.length + 1}`,
        description: '',
        content: '',
        folderId: null,
    };
    const updatedFiles = [...documentFiles, newFile];
    homeDispatch({ field: 'documentFiles', value: updatedFiles });
    saveFiles(updatedFiles);
  }

  const handleRenameFile = (file: DocumentFile, name: string) => {
    const updatedFiles = documentFiles.map((f) => {
      if (f.id === file.id) {
        return { ...f, name };
      }
      return f;
    });
    homeDispatch({ field: 'documentFiles', value: updatedFiles });
    saveFiles(updatedFiles);
  };

  const handleDeleteFile = (file: DocumentFile) => {
    const updatedFiles = documentFiles.filter((f) => f.id !== file.id);
    homeDispatch({ field: 'documentFiles', value: updatedFiles });
    saveFiles(updatedFiles);
  };

  useEffect(() => {
    if (searchTerm) {
      fileDispatch({
        field: 'filteredFiles',
        value: documentFiles.filter((file) => {
          const searchable =
            file.name.toLowerCase() +
            ' ' +
            file.description.toLowerCase() +
            ' ' +
            file.content?.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      fileDispatch({ field: 'filteredFiles', value: documentFiles });
    }
  }, [searchTerm, documentFiles]);

  return (
  <FilebarContext.Provider
    value={{
      ...fileBarContextValue,
      handleFileChange,
      handleButtonClick,
      handleDeleteFile,
      handleRenameFile,
    }}
  >
  <div className="flex-col h-full w-full flex-grow items-center space-y-1 border-t border-white/20 pt-1 text-sm overflow-auto">
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
    <button
      className="text-sidebar flex w-full flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={handleButtonClick}
    >
      <IconPlus size={16} />
      New Document
    </button>
    <div className="flex-grow overflow-auto">
        {items?.length > 0 ? (
            <div
              className="pt-2"
            >
              <Files files={items} />
            </div>
          ) : (
            <div className="mt-8 select-none text-center text-white opacity-50">
              <IconMistOff className="mx-auto mb-3" />
              <span className="text-[14px] leading-normal">
                No Files.
              </span>
            </div>
          )}
    </div>
  </div>
  </FilebarContext.Provider>
  );
};
