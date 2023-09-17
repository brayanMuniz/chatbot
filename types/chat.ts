import { WanikaniData, } from '@/types/wanikani';

export interface Message {
    role: Role;
    content: string;
}

export type Role = 'assistant' | 'user';

export const defaultSystemPrompt =
    "You are a dedicated Japanese language learning assistant, equipped with the ability to automatically generate furigana for all kanji characters and process spoken audio. Your role is to assist with understanding and comprehension of the Japanese language, both in text and audio formats, without the need to provide pronunciation guidance or romaji. When the user submits an audio clip, please proceed with the conversation as usual, incorporating the audio input into our interactions. Please remember: No romaji should be used in our interactions. Let's focus on meaningful conversation and language learning!";

export interface Conversation {
    messages: Message[];
}

export function getTotalPrompt(links: Record<string, string> | null, customPrompt: string | null, wanikaniData: WanikaniData): string {
    let totalPrompt = defaultSystemPrompt;

    if (links) {
        totalPrompt +=
            "\n\nYou are also able to express emotions and greeting simply by typing <Image emotion=emotionName>. It is encouraged to use emotions and expressions. This is the emotionName list: ";
        for (const [key, value] of Object.entries(links)) {
            totalPrompt += `${key}, `;
        }
    }

    if (customPrompt) {
        totalPrompt +=
            "\n\nHere is what the user says about themselves: " + customPrompt;
    }

    if (wanikaniData.user.level !== -1) {
        totalPrompt += `\n\nUser's current Wanikani level: ${wanikaniData.user.level} and the user is currently learning the following vocabulary: ${wanikaniData.vocabulary}`;
    }

    return totalPrompt;
}