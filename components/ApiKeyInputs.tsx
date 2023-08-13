import React, { useEffect, useState } from "react";
import { OpenAIApi, Configuration } from "openai";
import { KeyIcon } from "@heroicons/react/24/outline";

interface ApiKeyInputsProps {
  onApiKeySet: (openai: OpenAIApi) => void;
  onError: (error: boolean) => void;
}

export default function ApiKeyInputs({ onApiKeySet, onError }: ApiKeyInputsProps) {
  const [apiKey, setApiKey] = useState("");
  const isValidKey = apiKey.length > 0; // Todo: check if valid key

  useEffect(() => {
    const apiKey: string | null = localStorage.getItem("apiKey");
    if (apiKey !== null) setApiKey(apiKey);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSave = () => {
    if (apiKey === "") {
      onError(true);
      alert("API Key not found. Please enter your API Key in the Settings panel.");
      return;
    }
    localStorage.setItem("apiKey", apiKey);
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    onApiKeySet(openai);
    onError(false);
    alert("API Key saved!");
  };

  return (
    <div className="flex flex-row text-text-primary">
      <label htmlFor="apiKey" className="mt-2 mr-1">
        <KeyIcon className="h-6 w-6 text-button" />
      </label>
      <input
        type="text"
        id="apiKey"
        value={apiKey}
        onChange={handleInputChange}
        className="border p-1 bg-background text-text-primary rounded-md"
      />
      <button
        onClick={handleSave}
        className="ml-2 bg-button hover:bg-button text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
}
