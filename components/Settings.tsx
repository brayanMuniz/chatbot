import React, { useEffect, useState } from "react";
import { OpenAIApi, Configuration } from "openai";

interface SettingsProps {
  onApiKeySet: (openai: OpenAIApi) => void;
  onError: (error: boolean) => void;
}

export default function Settings({ onApiKeySet, onError }: SettingsProps) {
  const [apiKey, setApiKey] = useState("");

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
    <div className="w-2/12 flex flex-row">
      <label htmlFor="apiKey">API Key:</label>
      <input
        type="text"
        id="apiKey"
        value={apiKey}
        onChange={handleInputChange}
        className="border p-2 bg-black text-white"
      />
      <button
        onClick={handleSave}
        className=" ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
}
