import axios from "axios";

export interface WanikaniUser {
    level: number;
    subscribed: boolean;
    maxLevelGranted: number;
}

export interface WanikaniData {
    user: WanikaniUser;
    vocabulary: string[];
    apiKey: string | null;
}

export async function getVocabularyIdsNotInSrsStage9(bearerToken: string): Promise<number[]> {
    const ids: number[] = [];
    const url = 'https://api.wanikani.com/v2/assignments';
    const headers = { Authorization: `Bearer ${bearerToken}` };

    try {
        let response = await axios.get(url, { headers });
        let assignments = response.data.data;

        while (response.data.pages.next_url) {
            response = await axios.get(response.data.pages.next_url, { headers });
            assignments = [...assignments, ...response.data.data];
        }

        assignments.forEach((assignment: any) => {
            if (assignment.data.srs_stage !== 9 && assignment.data.subject_type === "vocabulary")
                ids.push(assignment.data.subject_id);

        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
    }

    return ids;
}


export async function getVocabularyNotInSrsStage9(bearerToken: string, ids: number[]): Promise<any[]> {
    const vocabularyData: any[] = [];
    const headers = { Authorization: `Bearer ${bearerToken}` };
    let pageAfterId = 0;

    try {
        while (true) {
            const url = `https://api.wanikani.com/v2/subjects?page_after_id=${pageAfterId}`;
            const response = await axios.get(url, { headers });
            const subjects = response.data.data;

            subjects.forEach((subject: any) => {
                if (subject.object === "vocabulary" && ids.includes(subject.id)) {
                    vocabularyData.push({
                        id: subject.id,
                        characters: subject.data.characters,
                        meanings: subject.data.meanings,
                        readings: subject.data.readings,
                    });
                }
            });

            if (response.data.pages.next_url)
                pageAfterId += 1000;
            else
                break;

        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }

    return vocabularyData;
}


