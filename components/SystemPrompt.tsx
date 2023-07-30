import React, { useState, useEffect } from "react";
import { defaultSystemPrompt } from "@/types/chat";

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

  return (
    <div>
      <label htmlFor="systemPrompt" className="block mb-2">
        System Prompt:
      </label>
      <textarea
        id="systemPrompt"
        value={systemPrompt}
        onChange={handleInputChange}
        className="border p-2 bg-black text-white w-full h-20"
      />
      <button onClick={handleSave} className="mt-2">
        Save
      </button>
    </div>
  );
}
