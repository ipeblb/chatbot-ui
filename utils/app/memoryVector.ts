import { MemoryVector } from '@/types/memoryVector'

export const getMemoryVector = (): MemoryVector[] | null => {
  const memoryVectors = localStorage.getItem('vectorstore');
  return memoryVectors ? JSON.parse(memoryVectors) : null;
}
