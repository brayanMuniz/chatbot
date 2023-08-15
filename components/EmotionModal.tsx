import React, { useEffect, useState } from "react";
import { Dialog, Tab } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface EmotionCardProps {
  emotion: string;
  imageUrl: string;
  onImageLinkChange: (link: string) => void;
}

const EmotionCard: React.FC<EmotionCardProps> = ({
  emotion,
  imageUrl,
  onImageLinkChange,
}) => (
  <div className="card bg-background rounded-lg shadow-md m-2">
    <img
      src={imageUrl}
      alt={emotion}
      className="w-full h-48 object-cover rounded-lg "
    />
    <div className="card-body text-text-primary flex flex-row">
      <h5 className="card-title">{emotion}</h5>
      <button
        className="btn bg-button text-white hover:bg-button rounded-md py-1 px-2"
        onClick={() => {
          const newLink = prompt("Enter new image link");
          if (newLink !== null) {
            onImageLinkChange(newLink);
          }
        }}
      >
        <PencilSquareIcon className="h-6 w-6" />
      </button>
    </div>
  </div>
);

interface EmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmotionLinksSet: (links: Record<string, string>) => void;
}

const EmotionModal: React.FC<EmotionModalProps> = ({
  isOpen,
  onClose,
  onEmotionLinksSet,
}) => {
  const [emotionLinks, setEmotionLinks] = useState<Record<string, string>>({});

  const [newEmotionUrl, setNewEmotionUrl] = useState("");
  const [newEmotionName, setNewEmotionName] = useState("");

  useEffect(() => {
    const emotionLinksFromLocalStorage = localStorage.getItem("savedImageLinks");
    if (emotionLinksFromLocalStorage)
      setEmotionLinks(JSON.parse(emotionLinksFromLocalStorage));
  }, []);

  const handleImageLinkChange = (emotion: string, link: string) => {
    const updatedEmotionLinks = { ...emotionLinks, [emotion]: link };
    setEmotionLinks(updatedEmotionLinks);
    localStorage.setItem("savedImageLinks", JSON.stringify(updatedEmotionLinks));
  };

  const handleAddEmotion = () => {
    if (newEmotionName && newEmotionUrl) {
      handleImageLinkChange(newEmotionName, newEmotionUrl);
      setNewEmotionName("");
      setNewEmotionUrl("");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative transform overflow-hidden rounded-lg bg-user-background text-text-primary shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        {/* Todo: */}
          <div className="grid grid-rows-4 grid-flow-col gap-4 auto-cols-auto">
            {Object.entries(emotionLinks).map(([emotion, imageUrl]) => (
              <EmotionCard
                key={emotion}
                emotion={emotion}
                imageUrl={imageUrl}
                onImageLinkChange={(link) => handleImageLinkChange(emotion, link)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center bg-background p-4">
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:ml-2">
              <input
                type="text"
                placeholder="Emotion Name"
                value={newEmotionName}
                onChange={(e) => setNewEmotionName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-text-primary bg-user-background"
              />
            </div>
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:ml-2">
              <input
                type="text"
                placeholder="Emotion URL"
                value={newEmotionUrl}
                onChange={(e) => setNewEmotionUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-text-primary bg-user-background"
              />
            </div>
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:ml-2">
              <button
                onClick={handleAddEmotion}
                className="w-full bg-button text-white px-3 py-2 rounded-md hover:bg-button"
              >
                Add Emotion
              </button>
            </div>
          </div>

          <div className="bg-user-background px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-button px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-button sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-user-background px-3 py-2 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-user-background sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EmotionModal;
