"use client";

import React, { useEffect, useState, useRef } from "react";
import { Conversation, Message, Role, getTotalPrompt } from "@/types/chat";

import axios from "axios";
import kuromoji from "kuromoji";
import { OpenAIApi, Configuration } from "openai";

// hooks
import { useOpenAI } from "@/hooks/useOpenAI";
import { useWanikani } from "@/hooks/useWanikani";

// components
import ErrorMessage from "./ErrorMessage";
import SystemPromptModal from "./SystemPromptModal";
import MessageList from "./MessageList";
import InputField from "./InputField";
import EmotionModal from "./EmotionModal";
import ApiKeyInputs from "./KeyInput";
// import MicrophoneRecorder from "./MicrophoneRecorder";

import { FaceSmileIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface ChatProps { }

export function Chat({ }: ChatProps) {
  const [openAI, setOpenAI] = useOpenAI("");
  const [customPrompt, setCustomPrompt] = useState("");

  const [wanikaniData, setWanikaniData] = useWanikani();

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

  const [emotionLinks, setEmotionLinks] = useState<Record<string, string> | null>(
    null
  );

  const configureOpenAIKey = (key: string) => {
    const configuration = new Configuration({ apiKey: key });
    const openai = new OpenAIApi(configuration);
    setOpenAI(openai);
  };

  const configureWanikaniKey = (key: string) => {
    localStorage.setItem("wanikaniApiKey", key);
    setWanikaniData((prevData) => ({ ...prevData, apiKey: key }));
  };

  // Initialize
  useEffect(() => {
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
              content: getTotalPrompt(emotionLinks, customPrompt, wanikaniData),
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

  const handleAudioBlob = async (blob: Blob) => {
    const apiKey: string | null = localStorage.getItem("openAiApiKey");
    const sizeInBytes = blob.size;
    const sizeInMegabytes = sizeInBytes / (1024 * 1024);
    console.log("Audio Blob:", blob);
    if (sizeInMegabytes < 25 && apiKey) {
      console.log("Using OpenAI API to transcribe audio file...");

      const formData = new FormData();

      formData.append("file", blob);
      formData.append("model", "whisper-1");
      formData.append("language", "ja");

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          formData,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        setMessage(response.data.text);
      } catch (error) {
        // Handle the error
        console.error(error);
      }
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
        <div className="text-3xl">こんにちは！</div>
        <div className="text-text-secondary space-y-2 overflow-auto h-[80vh]">
          {/* Vocabulary */}
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

        <div className="flex space-y-4">
          <InputField
            message={message}
            assistantIsTyping={assistantIsTyping}
            error={error}
            onMessageChange={handleMessageChange}
            onEnterPress={(message) => {
              handleNewMessage("user", message);
              setMessage("");
            }}
            width="w-11/12"
          />
          {/* <MicrophoneRecorder onAudioBlob={handleAudioBlob} /> */}
        </div>
      </div>
    </div>
  );
}
