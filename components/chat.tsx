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
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);

  const [assistantIsTyping, setAssistantIsTyping] = useState(false);

  // Error handling
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [tokenizer, setTokenizer] =
    useState<kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null>(null);

  const [conversation, setConversation] = React.useState<Conversation>({
    messages: [],
  });

  const [openEmotionModal, setOpenEmotionModal] = useState(false);

  const [message, setMessage] = React.useState("");

  const [openModal, setOpenModal] = useState(false);

  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    // Initialize Open AI API
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

    // Initialize System Prompt
    const systemPrompt: string | null = localStorage.getItem("systemPrompt");
    if (systemPrompt !== null) setSystemPrompt(systemPrompt);

    // Initialize tokenizer
    kuromoji.builder({ dicPath: "/dict" }).build(function (err, builtTokenizer) {
      if (err) {
        console.log(err);
        return;
      }

      // Save the built tokenizer
      console.log("Tokenizer initialized");
      setTokenizer(builtTokenizer);
    });

    // Initialize previous conversation
    const savedConversation = localStorage.getItem("conversation");
    if (savedConversation) {
      console.log("Saved conversation: " + savedConversation);
      setConversation({ messages: JSON.parse(savedConversation) });
    }
  }, []);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleNewMessage = async (role: Role, content: string) => {
    if (openai === null) return;
    if (tokenizer === null) return;

    if (role === "user") {
      const newMessage: Message = { role, content };
      setConversation((prevConversation) => ({
        messages: [...prevConversation.messages, newMessage],
      }));

      // Call OpenAI API
      setAssistantIsTyping(true);
      console.log("Calling OpenAI API, displaying response...");
      await openai
        .createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...conversation.messages,
            { role: "user", content: content },
          ],
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.choices[0].message?.content)
            handleNewMessage("assistant", response.data.choices[0].message?.content);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
          setErrorMessage(error.message);
        });
    } else if (role === "assistant") {
      setAssistantIsTyping(true);

      // Add an empty message
      setConversation((prevConversation) => ({
        messages: [...prevConversation.messages, { role, content: content[0] }],
      }));

      // Type out the message one character at a time
      let i = 0;
      const typingInterval = setInterval(() => {
        setConversation((prevConversation) => {
          const messages = [...prevConversation.messages];
          messages[messages.length - 1].content += content[i];
          return { messages };
        });

        i++;
        if (i >= content.length - 1) {
          setAssistantIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 2); // adjust the delay to control the typing speed
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem("conversation");
    setConversation({ messages: [] });
  };

  const handleSystemPromptSet = () => {
    const systemPrompt: string | null = localStorage.getItem("systemPrompt");
    if (systemPrompt !== null) {
      console.log("System prompt set to: " + systemPrompt);
      setSystemPrompt(systemPrompt);
    }
  };

  const handleApiKeySet = () => {
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
    setOpenai(openai);
    setError(false);
  };

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    localStorage.setItem("conversation", JSON.stringify(conversation.messages));
  }, [conversation]);

  return (
    <>
      <div className="w-3/12">
        <div className="flex flex-col space-y-4 mr-2">
          <div className="border-b pb-4">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Edit System Prompt
            </button>
            <SystemPrompt
              onSystemPromptSet={handleSystemPromptSet}
              open={openModal}
              setOpen={setOpenModal}
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
            />
          </div>
          <div className="border-b pb-4">
            <Settings onApiKeySet={handleApiKeySet} />
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
          <div ref={bottomRef} />
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
