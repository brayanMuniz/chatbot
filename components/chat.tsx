"use client";
import React, { useEffect, useState } from "react";
import { Conversation, Message, Role } from "@/types/chat";
import kuromoji from "kuromoji";

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
    const newMessage: Message = { role, content };
    setConversation((prevConversation) => ({
      messages: [...prevConversation.messages, newMessage],
    }));
  };

  // Scroll to bottom when new message is added
  const bottomRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Component to render text with ruby annotations
  interface RubyTextProps {
    text: string;
    tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null;
  }

  // Component to render text with ruby annotations
  const isKanji = (ch: string) => {
    return (
      (ch >= "\u4e00" && ch <= "\u9faf") || // CJK Unified Ideographs
      (ch >= "\u3400" && ch <= "\u4dbf") // CJK Unified Ideographs Extension A
    );
  };

  const RubyText: React.FC<RubyTextProps> = ({ text, tokenizer }) => {
    if (!tokenizer) return <>{text}</>;

    const tokens = tokenizer.tokenize(text);
    return (
      <>
        {tokens.map((token, index) =>
          token.reading && [...token.surface_form].some(isKanji) ? (
            <ruby key={index}>
              {token.surface_form}
              <rt>{token.reading}</rt>
            </ruby>
          ) : (
            token.surface_form
          )
        )}
      </>
    );
  };

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
