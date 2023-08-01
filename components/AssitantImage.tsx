import { emotionLinks } from "@/referenceImages";

export type Emotion = "hello" | "teasing" | "happy" | "surprised" | "disappointed";

interface ImageProps {
  emotion: Emotion | null;
}

const AssistantImage: React.FC<ImageProps> = ({ emotion }) => {
  if (emotion === null) {
    return null;
  }

  return <img src={emotionLinks[emotion]} alt={emotion} />;
};

export default AssistantImage;
