import React, { useEffect, useState, useRef } from "react";
import { OpenAIApi, Configuration } from "openai";
import { KeyIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ApiKeyInputsProps {
  label: string;
  storageKey: string;
  onApiKeySet: (apiKey: string) => void;
  onError: (error: boolean) => void;
}

export default function ApiKeyInputs({
  onApiKeySet,
  onError,
  label,
  storageKey,
}: ApiKeyInputsProps) {
  const [apiKey, setApiKey] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [newKey, setNewKey] = useState(apiKey);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey: string | null = localStorage.getItem(storageKey);
    if (storedApiKey !== null) {
      setApiKey(storedApiKey);
      setNewKey(storedApiKey);
    }
  }, [storageKey]);

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
      alert("Api key is empty");
      return;
    }
    localStorage.setItem(storageKey, trimmedApiKey);
    const configuration = new Configuration({ apiKey: trimmedApiKey });
    const openai = new OpenAIApi(configuration);
    // ! Argument of type 'OpenAIApi' is not assignable to parameter of type 'string'.ts(2345)
    // onApiKeySet(openai);
    setApiKey(trimmedApiKey);
    onApiKeySet(trimmedApiKey); // Correctly pass the API key as a string
    onError(false);
    setIsChanging(false);
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
      <span>{label}</span>
    </div>
  );
}
