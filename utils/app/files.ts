import { File } from '@/types/file'

export const updateFile = (updatedFile: File, allFiles: File[]) => {
    const updatedFiles = allFiles.map((c) => {
        if (c.id === updatedFile.id) {
        return updatedFile;
        }

        return c;
    });

    saveFiles(updatedFiles);

    return {
        single: updatedFile,
        all: updatedFiles,
    };
    }

export const saveFiles = (files: File[]) => {
    localStorage.setItem('files', JSON.stringify(files));
}
