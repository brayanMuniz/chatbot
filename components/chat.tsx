"use client";

import React, { useEffect, useState } from "react";
import { Conversation, Message, Role } from "@/types/chat";
import kuromoji from "kuromoji";
import RubyText from "./RubyText";
import ErrorMessage from "./ErrorMessage";
import Settings from "./Settings";
import SystemPrompt from "./SystemPrompt";

import { OpenAIApi, Configuration } from "openai";

interface ChatProps {}

export function Chat({}: ChatProps) {
  const userImageUrl = "/testImage2.jpg";
  const assistantImageUrl = "/testImage.jpg";

  const [openai, setOpenai] = useState<OpenAIApi | null>(null);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful Japanese language learning assistant. The web client will automatically generate furigana for all kanji characters, so there is no need for you to provide pronunciation guidance."
  );

  const [assistantIsTyping, setAssistantIsTyping] = useState(false);

  // Error handling
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [tokenizer, setTokenizer] =
    useState<kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null>(null);

  const [conversation, setConversation] = React.useState<Conversation>({
    messages: [],
  });

  const [message, setMessage] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Initialize Open AI API, tokenizer, and previous conversation
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
          clearInterval(typingInterval);
        }
      }, 20); // adjust the delay to control the typing speed

      setAssistantIsTyping(false);
    }
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
  }, [conversation]);

  return (
    <>
      <div className="w-3/12">
        <SystemPrompt onSystemPromptSet={handleSystemPromptSet} />
        <Settings onApiKeySet={handleApiKeySet} />
      </div>

      <div className="flex flex-col space-y-4 w-7/12">
        <div className="flex flex-col space-y-2 overflow-auto h-[80vh]">
          {conversation.messages.map((message, index) => (
            <div key={index} className="flex items-center text-lg">
              <div className="py-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={message.role === "user" ? userImageUrl : assistantImageUrl}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "defaultIcon.png";
                      }}
                      alt={message.role === "user" ? "User" : "Assistant"}
                      width="50"
                      height="50"
                    />
                  </div>

                  <div className="flex-grow">
                    {message.role === "assistant" ? (
                      message.content.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          <RubyText text={line} tokenizer={tokenizer} />
                          <br />
                        </React.Fragment>
                      ))
                    ) : (
                      <RubyText text={message.content} tokenizer={tokenizer} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {error ? <ErrorMessage message={errorMessage} /> : null}
          {assistantIsTyping ? <div>Loading ...</div> : null}

          <div ref={bottomRef} />
        </div>

        {/* Message  */}
        <div className="flex flex-col space-y-4">
          <input
            placeholder="Type a message..."
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(event) => {
              if (event.key === "Enter" && message.trim() !== "") {
                handleNewMessage("user", message);
                setMessage("");
              }
            }}
            disabled={assistantIsTyping || error}
            className="border p-2 bg-black text-white"
          />
        </div>
      </div>
      <div className="w-2/12">Vocabulary</div>
    </>
  );
}
