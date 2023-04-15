import { FC } from 'react';
import { File } from '@/types/file';
import { FileComponent } from './File';

interface Props {
  files: File[];
}

export const Files: FC<Props> = ({ files }) => {
  return <div className="flex w-full flex-col gap-1">
    {files
      .slice()
      .reverse()
      .map((file, index) => (
        <FileComponent key={index} file={file} />
      ))}
  </div>;
};
