import React from "react";
import { Dialog, Tab } from "@headlessui/react";

interface EmotionInputProps {
  label: string;
}

const EmotionInput: React.FC<EmotionInputProps> = ({ label }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
      {label}:
    </label>
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id={label}
      type="text"
      placeholder={`Enter link for ${label}`}
    />
  </div>
);

interface EmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmotionModal: React.FC<EmotionModalProps> = ({ isOpen, onClose }) => {
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
            <Tab.List className="border-b flex space-x-4">
              <Tab>Positive Emotions</Tab>
              <Tab>Negative Emotions</Tab>
              <Tab>Expressions</Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel className="p-4">
                {/* Positive Emotions */}
                <EmotionInput label="Happy" />
                <EmotionInput label="Excited" />
                {/* More positive emotions */}
              </Tab.Panel>

              <Tab.Panel className="p-4">
                {/* Negative Emotions */}
                <EmotionInput label="Sad" />
                <EmotionInput label="Angry" />
                {/* More negative emotions */}
              </Tab.Panel>

              <Tab.Panel className="p-4">
                {/* Expressions */}
                <EmotionInput label="Hello" />
                <EmotionInput label="Goodbye" />
                {/* More expressions */}
              </Tab.Panel>
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
