import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { defaultSystemPrompt } from "@/types/chat";

interface SystemPromptProps {
  onSystemPromptSet: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SystemPrompt({
  onSystemPromptSet,
  open,
  setOpen,
}: SystemPromptProps) {
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [customPrompt, setCustomPrompt] = useState("");
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const systemPrompt: string | null = localStorage.getItem("systemPrompt");
    if (systemPrompt !== null) setSystemPrompt(systemPrompt);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(event.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("systemPrompt", systemPrompt);
    alert("System prompt saved!");
    onSystemPromptSet();
    setOpen(false);
  };

  const handleReset = () => {
    setSystemPrompt(defaultSystemPrompt);
    localStorage.setItem("systemPrompt", defaultSystemPrompt);
    alert("System prompt reset!");
    onSystemPromptSet();
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              {/* Default System Prompt */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-row">
                  <label htmlFor="systemPrompt" className="block">
                    System Prompt:
                  </label>
                  <button
                    onClick={handleReset}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faRedo} />
                  </button>
                  <button
                    onClick={handleSave}
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={handleInputChange}
                    className="border p-2 bg-black text-white w-full h-40 flex-grow"
                  />
                </div>
              </div>
              {/* Custom Prompt */}
              <div className="bg-gray-100 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-row">
                  <label htmlFor="customPrompt" className="block">
                    Custom Prompt:
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <textarea
                    id="customPrompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="border p-2 bg-black text-white w-full h-40 flex-grow"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
