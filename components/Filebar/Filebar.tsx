import { useRef, useContext, useEffect, useState } from 'react';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { FilebarInitialState, initialState } from './Filebar.state';
import { IconFolderPlus, IconMistOff, IconPlus, IconFileText } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import { File } from '@/types/file';
import HomeContext from '@/pages/api/home/home.context';
import { saveFiles } from '@/utils/app/files';
import { Files } from './components/Files';
import FilebarContext from './Filebar.context';

export const Filebar = () => {
  const fileBarContextValue = useCreateReducer<FilebarInitialState>({
    initialState,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state: {files},
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleCreateFile(file?.name || '')
    console.log(items.length)
    console.log(file)
  };

  const handleCreateFile = (fileName: string) => {
    const newFile: File = {
        id: uuidv4(),
        name: fileName || `File ${files.length + 1}`,
        description: '',
        content: '',
        folderId: null,
    };
    const updatedFiles = [...files, newFile];
    homeDispatch({ field: 'files', value: updatedFiles });
    saveFiles(updatedFiles);
  }

  const handleRenameFile = (file: File, name: string) => {
    const updatedFiles = files.map((f) => {
      if (f.id === file.id) {
        return { ...f, name };
      }
      return f;
    });
    homeDispatch({ field: 'files', value: updatedFiles });
    saveFiles(updatedFiles);
  };

  const handleDeleteFile = (file: File) => {
    const updatedFiles = files.filter((f) => f.id !== file.id);
    homeDispatch({ field: 'files', value: updatedFiles });
    saveFiles(updatedFiles);
  };

  useEffect(() => {
    if (searchTerm) {
      fileDispatch({
        field: 'filteredFiles',
        value: files.filter((file) => {
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
      fileDispatch({ field: 'filteredFiles', value: files });
    }
  }, [searchTerm, files]);

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
