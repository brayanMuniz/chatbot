import { useState, useEffect } from 'react';
import { OpenAIApi, Configuration } from 'openai';

export const useOpenAI = (initialApiKey: string): [OpenAIApi | null, React.Dispatch<React.SetStateAction<OpenAIApi | null>>] => {
    const [openAI, setOpenAI] = useState<OpenAIApi | null>(null);

    useEffect(() => {
        const apiKey = initialApiKey || localStorage.getItem("openAiApiKey");

        if (apiKey === null) {
            return;
        }

        const configuration = new Configuration({ apiKey });
        const openai = new OpenAIApi(configuration);
        setOpenAI(openai);
        console.log("OpenAI API initialized");

    }, [initialApiKey]);

    return [openAI, setOpenAI];
};

