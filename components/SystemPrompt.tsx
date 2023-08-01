import React, { useState, useEffect } from "react";
import { defaultSystemPrompt } from "@/types/chat";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

interface SystemPromptProps {
  onSystemPromptSet: () => void;
}

export default function SystemPrompt({ onSystemPromptSet }: SystemPromptProps) {
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);

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
  };

  const handleReset = () => {
    setSystemPrompt(defaultSystemPrompt);
    localStorage.setItem("systemPrompt", defaultSystemPrompt);
    alert("System prompt reset!");
    onSystemPromptSet();
  };

  return (
    <div>
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
          className="border p-2 bg-black text-white w-full h-40 flex-grow" // Increased height to h-40
        />
      </div>
    </div>
  );
}
