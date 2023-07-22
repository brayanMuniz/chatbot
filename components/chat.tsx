"use client";
import React, { useEffect, useState } from "react";
import { Conversation, Message, Role } from "@/types/chat";
import kuromoji from "kuromoji";

import RubyText from "./RubyText";

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
    // Default conversation
    messages: [
      { role: "user", content: "こんにちは、ボットさん！" },
      {
        role: "bot",
        content: "こんにちは、ユーザーさん！何かお手伝いできることがありますか？",
      },
      { role: "user", content: "日本語を勉強しています。" },
      {
        role: "bot",
        content: "それは素晴らしいですね！どのようにお手伝いできますか？",
      },
    ],
  });

  // Chat-input
  const [message, setMessage] = React.useState("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleNewMessage = (role: Role, content: string) => {
    if (role === "bot") {
      // ! This is a simple implementation of a bot that types out the message
      // ! when the api is called. You can replace this with a more complex code that depends on the message content and output.
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
      }, 100); // adjust the delay to control the typing speed
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
              {message.role === "user" ? "User" : "Bot"}:
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
