export type Emotion =
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "disappointed"
    | "teasing"
    | "confused"
    | "excited"
    | "scared"
    | "bored"
    | "anxious"
    | "curious"
    | "embarrassed"
    | "frustrated"
    | "impressed"
    | "inquisitive"
    | "jealous"
    | "joyful"
    | "nervous"
    | "proud"
    | "relieved"
    | "shy"
    | "skeptical"
    | "sorrowful"
    | "thoughtful"
    | "tired"
    | "triumphant"
    | "worried";

export type Expression =
    | "hello"
    | "goodbye"
    | "thankYou"
    | "please"
    | "congratulations";

export type AssistantImage = Emotion | Expression;

export const defaultLinks: Record<AssistantImage, string> = {
    happy: "",
    sad: "",
    angry: "",
    surprised: "",
    disappointed: "",
    teasing: "",
    confused: "",
    excited: "",
    scared: "",
    bored: "",
    anxious: "",
    curious: "",
    embarrassed: "",
    frustrated: "",
    impressed: "",
    inquisitive: "",
    jealous: "",
    joyful: "",
    nervous: "",
    proud: "",
    relieved: "",
    shy: "",
    skeptical: "",
    sorrowful: "",
    thoughtful: "",
    tired: "",
    triumphant: "",
    worried: "",
    hello: "",
    goodbye: "",
    thankYou: "",
    please: "",
    congratulations: "",
};

