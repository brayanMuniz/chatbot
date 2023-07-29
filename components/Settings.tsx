import React, { useState } from "react";

interface SettingsProps {
  onApiKeySet: () => void;
}

export default function Settings({ onApiKeySet }: SettingsProps) {
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("apiKey", apiKey);
    alert("API Key saved!");
    onApiKeySet(); // Call the onApiKeySet function after the API key is saved
  };

  return (
    <div className="w-2/12">
      <label htmlFor="apiKey">API Key:</label>
      <input
        type="text"
        id="apiKey"
        value={apiKey}
        onChange={handleInputChange}
        className="border p-2 bg-black text-white"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
