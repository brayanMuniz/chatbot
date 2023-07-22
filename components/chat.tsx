"use client";

import React, { useEffect, useState } from "react";
import { Conversation, Message, Role } from "@/types/chat";
import kuromoji from "kuromoji";
import RubyText from "./RubyText";

import { OpenAIApi, Configuration } from "openai";
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_KEY,
});
const openai = new OpenAIApi(configuration);

interface ChatProps {}

export function Chat({}: ChatProps) {
  const [tokenizer, setTokenizer] =
    useState<kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null>(null);

  // Read dictionary and build tokenizer
  useEffect(() => {
    kuromoji.builder({ dicPath: "/dict" }).build(function (err, builtTokenizer) {
      if (err) {
        console.log(err);
        return;
      }

      // Save the built tokenizer
      setTokenizer(builtTokenizer);
    });
  }, []);

  // Chat-history
  const [conversation, setConversation] = React.useState<Conversation>({
    messages: [],
  });

  // Chat-input
  const [message, setMessage] = React.useState("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleNewMessage = async (role: Role, content: string) => {
    if (role === "user") {
      const newMessage: Message = { role, content };
      setConversation((prevConversation) => ({
        messages: [...prevConversation.messages, newMessage],
      }));

      // Call OpenAI API
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful Japanese language learning assistant.",
          },
          ...conversation.messages,
          { role: "user", content: content },
        ],
      });
      console.log(response.data);
      if (response.data.choices[0].message?.content)
        handleNewMessage("assistant", response.data.choices[0].message?.content);
    } else if (role === "assistant") {
      // Add an empty message
      setConversation((prevConversation) => ({
        messages: [...prevConversation.messages, { role, content: "" }],
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
      }, 50); // adjust the delay to control the typing speed
    } else {
      const newMessage: Message = { role, content };
      setConversation((prevConversation) => ({
        messages: [...prevConversation.messages, newMessage],
      }));
    }
  };

  // Scroll to bottom when new message is added
  const bottomRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <div className="flex flex-col space-y-4 w-1/2">
      <div className="flex flex-col space-y-2 overflow-auto h-[80vh]">
        {conversation.messages.map((message, index) => (
          <div key={index} className="flex items-center text-lg">
            <p className="py-2">
              {message.role === "user" ? "User" : "assistant"}:
              <RubyText text={message.content} tokenizer={tokenizer} />
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && message.trim() !== "") {
              handleNewMessage("user", message);
              setMessage("");
            }
          }}
          className="border p-2 bg-black text-white"
        />
      </div>
    </div>
  );
}
