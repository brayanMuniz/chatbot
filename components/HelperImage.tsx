import { AssistantImage } from "@/types/AssistantImage";

interface ImageProps {
  imageLinks: Record<AssistantImage, string>;
  image: AssistantImage;
}

const HelperImage: React.FC<ImageProps> = ({ image, imageLinks }) => {
  return <img src={imageLinks[image]} alt={image} />;
};

export default HelperImage;
