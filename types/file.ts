export interface File {
  id: string;
  name: string;
  description: string;
  content: string | null;
  folderId: string | null;
}
