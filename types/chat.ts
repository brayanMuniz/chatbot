export interface Message {
    role: Role;
    content: string;
}

export type Role = 'assistant' | 'user';

export const defaultSystemPrompt =
    "You are a helpful Japanese language learning assistant. The web client will automatically generate furigana for all kanji characters, so there is no need for you to provide pronunciation guidance.";


export interface Conversation {
    messages: Message[];
}