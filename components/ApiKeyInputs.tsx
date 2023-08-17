import React, { useEffect, useState, useRef } from "react";
import { OpenAIApi, Configuration } from "openai";
import { KeyIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ApiKeyInputsProps {
  onApiKeySet: (openai: OpenAIApi) => void;
  onError: (error: boolean) => void;
}

export default function ApiKeyInputs({ onApiKeySet, onError }: ApiKeyInputsProps) {
  const [apiKey, setApiKey] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [newKey, setNewKey] = useState(apiKey);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey: string | null = localStorage.getItem("apiKey");
    if (storedApiKey !== null) {
      setApiKey(storedApiKey);
      setNewKey(storedApiKey);
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSave();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      handleCancel();
    }
  };

  useEffect(() => {
    if (isChanging) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChanging]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewKey(event.target.value);
  };

  const handleSave = () => {
    const trimmedApiKey = newKey.trim();
    if (trimmedApiKey === "") {
      onError(true);
      alert("API Key not found. Please enter your API Key in the Settings panel.");
      return;
    }
    localStorage.setItem("apiKey", trimmedApiKey);
    const configuration = new Configuration({ apiKey: trimmedApiKey });
    const openai = new OpenAIApi(configuration);
    onApiKeySet(openai);
    onError(false);
    setIsChanging(false);
    alert("API Key saved!");
  };

  const handleCancel = () => {
    setIsChanging(false);
    setNewKey(apiKey);
  };

  return isChanging ? (
    <div ref={containerRef} className="flex flex-row text-text-primary ">
      <KeyIcon className="h-6 w-6 text-button mr-1 mt-1" />
      <input
        ref={inputRef}
        type="text"
        value={newKey}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="border p-1 bg-background text-text-primary rounded-md mr-2"
      />
      <CheckIcon
        onClick={handleSave}
        className="h-6 w-6 text-button mt-1 hover:text-button-hover cursor-pointer"
      />
      <XMarkIcon
        onClick={handleCancel}
        className="h-6 w-6 text-button mt-1 hover:text-button-hover cursor-pointer"
      />
    </div>
  ) : (
    <div
      className="flex flex-row text-text-primary cursor-pointer"
      onClick={() => setIsChanging(true)}
    >
      <KeyIcon
        className={apiKey ? "h-6 w-6 text-button mr-1" : "h-6 w-6 text-button mr-1"}
      />
      <span>OpenAI API Key</span>
    </div>
  );
}
