export interface Message {
    role: Role;
    content: string;
}

export type Role = 'assistant' | 'user';

export interface Conversation {
    messages: Message[];
}