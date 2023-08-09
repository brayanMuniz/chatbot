"use client";

import React, { useEffect, useState } from "react";
// Types
import { Conversation, Message, Role, defaultSystemPrompt } from "@/types/chat";

// Tokenizer
import kuromoji from "kuromoji";

// Components
import ErrorMessage from "./ErrorMessage";
import Settings from "./Settings";
import SystemPrompt from "./SystemPrompt";
import MessageList from "./MessageList";
import InputField from "./InputField";
import EmotionModal from "./EmotionModal";

import { OpenAIApi, Configuration } from "openai";

interface ChatProps {}

export function Chat({}: ChatProps) {
  const [openai, setOpenai] = useState<OpenAIApi | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");

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

    totalPrompt +=
      "\n\nYou are also able to express emotions and greeting simply by typing <Image emotion=emotionName>. It is encouraged to use emotions and expressions. This is the emotionName list: ";
    const links = localStorage.getItem("savedImageLinks");
    if (links) setEmotionLinks(JSON.parse(links));

    for (const [key, value] of Object.entries(emotionLinks)) {
      totalPrompt += `${key}, `;
    }

    // if custom prompt in local storage, add it to the prompt
    const customPrompt = localStorage.getItem("customPrompt");
    if (customPrompt) {
      totalPrompt +=
        "\n\nHere is what the user says about themselves: " + customPrompt;
    }

    return totalPrompt;
  }

  // Initialize
  useEffect(() => {
    // Open AI API
    const apiKey: string | null = localStorage.getItem("apiKey");
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
    setOpenai(openai);

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

    console.log(getTotalPrompt());
  }, []);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleNewMessage = async (role: Role, content: string) => {
    if (!openai || !tokenizer) return;

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
        const response = await openai.createChatCompletion({
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
    <>
      <div className="w-3/12">
        <div className="flex flex-col space-y-4 mr-2">
          <div className="border-b pb-4">
            <button
              onClick={() => setPromptModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Edit System Prompt
            </button>
            <SystemPrompt
              onSystemPromptSet={setCustomPrompt}
              open={openPromptModal}
              setOpen={setPromptModal}
            />

            <button
              onClick={() => setOpenEmotionModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Edit Emotions & Expressions
            </button>
            <EmotionModal
              isOpen={openEmotionModal}
              onClose={() => setOpenEmotionModal(false)}
              onEmotionLinksSet={setEmotionLinks}
            />
          </div>
          <div className="border-b pb-4">
            <Settings onApiKeySet={setOpenai} onError={setError} />
          </div>
          <div className="pb-4">
            <button
              onClick={clearChatHistory}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Clear Chat History
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 w-8/12">
        <div className="flex flex-col space-y-2 overflow-auto h-[80vh]">
          <MessageList conversation={conversation} tokenizer={tokenizer} />
          {error ? <ErrorMessage message={errorMessage} /> : null}
          {assistantIsTyping && !error ? <div>Loading ...</div> : null}
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
    </>
  );
}
