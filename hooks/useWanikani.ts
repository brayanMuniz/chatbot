import axios from 'axios';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { WanikaniData, getVocabularyIdsNotInSrsStage9, getVocabularyNotInSrsStage9 } from '@/types/wanikani';

export const useWanikani = (): [WanikaniData, Dispatch<SetStateAction<WanikaniData>>] => {
    const [wanikaniData, setWanikaniData] = useState<WanikaniData>({
        user: {
            level: -1,
            subscribed: false,
            maxLevelGranted: 0,
        },
        vocabulary: [],
    });

    useEffect(() => {
        const wanikaniApiKey: string | null = localStorage.getItem("wanikaniApiKey");
        if (wanikaniApiKey !== null) {
            axios
                .get("https://api.wanikani.com/v2/user", {
                    headers: { Authorization: `Bearer ${wanikaniApiKey}` },
                })
                .then(async (response) => {
                    const subscriptionStatus = response.data.data.subscription.active;
                    const maxLevelGranted = response.data.data.subscription.max_level_granted;
                    const level = response.data.data.level;

                    const vocabularyIds = await getVocabularyIdsNotInSrsStage9(wanikaniApiKey);
                    if (vocabularyIds.length !== 0) {
                        const vocabularyData = await getVocabularyNotInSrsStage9(wanikaniApiKey, vocabularyIds);
                        const charactersArray = vocabularyData.map((item) => item.characters);

                        console.log("Wanikani data retrieved successfully.");
                        setWanikaniData({
                            user: { level, subscribed: subscriptionStatus, maxLevelGranted },
                            vocabulary: charactersArray,
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error retrieving user data:", error);
                });
        }
    }, []);

    return [wanikaniData, setWanikaniData];
};
