import { emotionLinks } from "@/referenceImages";

export type Emotion = "hello" | "teasing" | "happy" | "surprised" | "disappointed";

interface ImageProps {
  emotion: Emotion;
}

const Image: React.FC<ImageProps> = ({ emotion }) => {
  return <img src={emotionLinks[emotion]} alt={emotion} />;
};

export default Image;
