export interface Message {
    role: Role;
    content: string;
}

export type Role = 'bot' | 'user';

export interface Conversation {
    messages: Message[];
}