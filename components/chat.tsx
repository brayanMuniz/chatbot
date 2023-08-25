"use client";

import React, { useEffect, useState } from "react";
import { Conversation, Message, Role, defaultSystemPrompt } from "@/types/chat";
import {
  WanikaniUser,
  getVocabularyIdsNotInSrsStage9,
  getVocabularyNotInSrsStage9,
} from "@/types/wanikani";

import axios from "axios";
import kuromoji from "kuromoji";

// Components
import ErrorMessage from "./ErrorMessage";
import SystemPromptModal from "./SystemPromptModal";
import MessageList from "./MessageList";
import InputField from "./InputField";
import EmotionModal from "./EmotionModal";
import ApiKeyInputs from "./KeyInput";

import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { OpenAIApi, Configuration } from "openai";

interface ChatProps {}

export function Chat({}: ChatProps) {
  const [openAI, setOpenAI] = useState<OpenAIApi | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");

  const [wanikaniApiKey, setWanikaniApiKey] = useState("");
  const [wanikaniUser, setWanikaniUser] = useState<WanikaniUser>({
    subscribed: false,
    maxLevelGranted: 0,
    level: -1,
  });
  const [currentWanikaniLearningVocabulary, setCurrentWanikaniLearningVocabulary] =
    useState<string[]>([]);

  const [assistantIsTyping, setAssistantIsTyping] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [tokenizer, setTokenizer] =
    useState<kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null>(null);

  const [conversation, setConversation] = React.useState<Conversation>({
    messages: [],
  });

  const [message, setMessage] = React.useState("");

  // Modal States
  const [openPromptModal, setPromptModal] = useState(false);
  const [openEmotionModal, setOpenEmotionModal] = useState(false);

  const [emotionLinks, setEmotionLinks] = useState({});

  function getTotalPrompt(): string {
    let totalPrompt = defaultSystemPrompt;

    const links = localStorage.getItem("savedImageLinks");
    if (links) {
      totalPrompt +=
        "\n\nYou are also able to express emotions and greeting simply by typing <Image emotion=emotionName>. It is encouraged to use emotions and expressions. This is the emotionName list: ";
      setEmotionLinks(JSON.parse(links));

      for (const [key, value] of Object.entries(emotionLinks)) {
        totalPrompt += `${key}, `;
      }
    }

    // if custom prompt in local storage, add it to the prompt
    const customPrompt = localStorage.getItem("customPrompt");
    if (customPrompt) {
      totalPrompt +=
        "\n\nHere is what the user says about themselves: " + customPrompt;
    }

    if (wanikaniUser.level !== -1) {
      totalPrompt += `\n\nUser's current Wanikani level: ${wanikaniUser.level} and the user is currently learning the following vocabulary: ${currentWanikaniLearningVocabulary}`;
    }

    return totalPrompt;
  }

  const configureOpenAIKey = (key: string) => {
    const configuration = new Configuration({ apiKey: key });
    const openai = new OpenAIApi(configuration);
    setOpenAI(openai);
  };

  const configureWanikaniKey = (key: string) => {
    setWanikaniApiKey(key);
    localStorage.setItem("wanikaniApiKey", key);
  };

  // Initialize
  useEffect(() => {
    // Open AI API
    const apiKey: string | null = localStorage.getItem("openAiApiKey");
    if (apiKey === null) {
      setError(true);
      setErrorMessage(
        "API Key not found. Please enter your API Key in the Settings panel."
      );
      return;
    }
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    console.log("OpenAI API initialized");
    setOpenAI(openai);

    // System Prompt
    const customPrompt: string | null = localStorage.getItem("customPrompt");
    if (customPrompt !== null) {
      console.log("Using Saved Custom Prompt");
      setCustomPrompt(customPrompt);
    }

    // Tokenizer
    kuromoji.builder({ dicPath: "/dict" }).build(function (err, builtTokenizer) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("Tokenizer initialized");
      setTokenizer(builtTokenizer);
    });

    // Previous conversation
    const savedConversation: string | null = localStorage.getItem("conversation");
    if (savedConversation !== null) {
      console.log("Using Saved Conversation");
      setConversation({ messages: JSON.parse(savedConversation) });
    }

    // Retrieve emotion links from local storage
    const links = localStorage.getItem("savedImageLinks");
    if (links) {
      setEmotionLinks(JSON.parse(links));
    }

    // Retrieve wanikani api key from local storage
    const wanikaniApiKey: string | null = localStorage.getItem("wanikaniApiKey");
    if (wanikaniApiKey !== null) {
      setWanikaniApiKey(wanikaniApiKey);

      axios
        .get("https://api.wanikani.com/v2/user", {
          headers: { Authorization: `Bearer ${wanikaniApiKey}` },
        })
        .then(async (response) => {
          const subscriptionStatus = response.data.data.subscription.active;
          const maxLevelGranted = response.data.data.subscription.max_level_granted;
          const level = response.data.data.level;

          console.log("Subscription Status:", subscriptionStatus);
          console.log("Max Level Granted:", maxLevelGranted);
          setWanikaniUser({ level, subscribed: subscriptionStatus, maxLevelGranted });

          const vocabularyIds = await getVocabularyIdsNotInSrsStage9(wanikaniApiKey);
          console.log("Vocabulary IDs:", vocabularyIds);
          if (vocabularyIds.length != 0) {
            const vocabularyData = await getVocabularyNotInSrsStage9(
              wanikaniApiKey,
              vocabularyIds
            );
            console.log("Vocabulary Data:", vocabularyData);
            const charactersArray = vocabularyData.map((item) => item.characters);
            setCurrentWanikaniLearningVocabulary(charactersArray);
            console.log("Characters Array:", charactersArray);
          }
        })
        .catch((error) => {
          console.error("Error retrieving user data:", error);
        });
    }

    console.log(getTotalPrompt());
  }, []);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleNewMessage = async (role: Role, content: string) => {
    if (!openAI || !tokenizer) return;

    const newMessage: Message = { role, content };

    if (role === "user") {
      // Set the user's message and save it to local storage
      setConversation((prevConversation) => {
        const updatedMessages = [...prevConversation.messages, newMessage];
        // Save the updated conversation to local storage
        localStorage.setItem("conversation", JSON.stringify(updatedMessages));
        return { messages: updatedMessages };
      });

      // Call OpenAI API
      setAssistantIsTyping(true);
      try {
        const response = await openAI.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: getTotalPrompt(),
            },
            ...conversation.messages,
            newMessage,
          ],
        });

        if (response.data.choices[0].message?.content) {
          handleNewMessage("assistant", response.data.choices[0].message.content);
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorMessage("Problem with OpenAI API. Please try again later.");
      }
    } else if (role === "assistant") {
      setAssistantIsTyping(true);
      // Add the assistant's message and save it to local storage
      setConversation((prevConversation) => {
        const updatedMessages = [...prevConversation.messages, newMessage];
        localStorage.setItem("conversation", JSON.stringify(updatedMessages));
        return { messages: updatedMessages };
      });
      setAssistantIsTyping(false);
    }
  };

  const clearChatHistory = () => {
    console.log("Clearing chat history...");
    localStorage.removeItem("conversation");
    setConversation({ messages: [] });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-background text-text-primary">
      {/* Modals */}
      <SystemPromptModal
        onSystemPromptSet={setCustomPrompt}
        open={openPromptModal}
        setOpen={setPromptModal}
      />

      <EmotionModal
        isOpen={openEmotionModal}
        onClose={() => setOpenEmotionModal(false)}
        onEmotionLinksSet={setEmotionLinks}
      />

      <div className="w-3/12 flex flex-col space-y-4 mr-2">
        <div>こんにちは！</div>
        <div className="text-text-secondary space-y-2 overflow-auto h-[80vh]">
          Vocabulary
        </div>

        <ApiKeyInputs
          onApiKeySet={configureWanikaniKey}
          onError={setError}
          label="wanikani"
          storageKey="wanikaniApiKey"
        />
        <ApiKeyInputs
          onApiKeySet={configureOpenAIKey}
          onError={setError}
          label="openAI"
          storageKey="openAiApiKey"
        />
      </div>

      <div className="w-8/12 flex flex-col space-y-4">
        <div className="flex flex-row justify-between">
          <button
            onClick={clearChatHistory}
            className="bg-button hover:bg-button text-white font-bold py-2 px-4 rounded"
          >
            Clear Chat History
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => setOpenEmotionModal(true)}
              className="bg-button hover:bg-button text-white font-bold py-2 px-4 rounded mb-2"
            >
              <FaceSmileIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setPromptModal(true)}
              className="bg-button hover:bg-button text-white font-bold py-2 px-4 rounded mb-2 flex flex-row"
            >
              <PencilSquareIcon className="h-6 w-6" />
              System Prompt
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2 overflow-auto h-[80vh]">
          <MessageList conversation={conversation} tokenizer={tokenizer} />
          {error ? <ErrorMessage message={errorMessage} /> : null}
          {assistantIsTyping && !error ? (
            <div className="text-text-secondary">Loading ...</div>
          ) : null}
        </div>

        <div className="flex flex-col space-y-4">
          <InputField
            message={message}
            assistantIsTyping={assistantIsTyping}
            error={error}
            onMessageChange={handleMessageChange}
            onEnterPress={(message) => {
              handleNewMessage("user", message);
              setMessage("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
