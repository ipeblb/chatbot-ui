import { OpenAIModel } from './openai';
import { MemoryVector } from './memoryVector';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
}

export interface ChatQABody extends ChatBody {
  vectorStore: MemoryVector[];
}

export interface MessageToSendBody {
  model: OpenAIModel;
  messages: Message[];
  prompt: string;
}
