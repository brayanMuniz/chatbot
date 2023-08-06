import React, { useState } from "react";
import { Dialog, Tab } from "@headlessui/react";

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
  <div className="card">
    <img src={imageUrl} alt={emotion} className="card-img-top" />
    <div className="card-body">
      <h5 className="card-title">{emotion}</h5>
      <button
        className="btn btn-primary"
        onClick={() => {
          const newLink = prompt("Enter new image link");
          if (newLink !== null) {
            onImageLinkChange(newLink);
          }
        }}
      >
        Change Image
      </button>
    </div>
  </div>
);

interface EmotionInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const EmotionInput: React.FC<EmotionInputProps> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
      {label}:
    </label>
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id={label}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter link for ${label}`}
    />
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
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [emotionLinks, setEmotionLinks] = useState<Record<string, string>>({
    // Initialize with some default emotions and image links
    Happy: "",
    // ...
  });

  const handleImageLinkChange = (emotion: string, link: string) => {
    setEmotionLinks({ ...emotionLinks, [emotion]: link });
  };

  const handleSave = () => {
    localStorage.setItem("emotionLinks", JSON.stringify(emotionLinks));
    onEmotionLinksSet(emotionLinks);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative transform overflow-hidden rounded-lg bg-gray text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <Tab.Group>
            <Tab.Panels>
              <Tab.Panel className="p-4">
                {/* Positive Emotions */}
                {Object.entries(emotionLinks).map(([emotion, imageUrl]) => (
                  <EmotionCard
                    key={emotion} // Add this line
                    emotion={emotion}
                    imageUrl={imageUrl}
                    onImageLinkChange={(link) => handleImageLinkChange(emotion, link)}
                  />
                ))}
              </Tab.Panel>
              {/* ... */}
            </Tab.Panels>
          </Tab.Group>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
