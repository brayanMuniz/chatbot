import React, { useEffect, useState } from "react";

interface SettingsProps {
  onApiKeySet: () => void;
}

export default function Settings({ onApiKeySet }: SettingsProps) {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const apiKey: string | null = localStorage.getItem("apiKey");
    if (apiKey !== null) setApiKey(apiKey);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("apiKey", apiKey);
    alert("API Key saved!");
    onApiKeySet(); // Call the onApiKeySet function after the API key is saved
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
