import { useRef } from 'react';
import { ClearConversations } from '@/components/Chatbar/components/ClearConversations';
import { IconFolderPlus, IconMistOff, IconPlus, IconFileText } from '@tabler/icons-react';


export const Filebar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
  };

  return (
  <div className="flex flex-col flex-grow items-center space-y-1 border-t border-white/20 pt-1 text-sm">
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
    </div>
    <ClearConversations onClearConversations={() => {}} />
  </div>
  );
};
