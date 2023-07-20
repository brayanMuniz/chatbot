"use client";
import * as React from "react";
import { Conversation, Message, Role } from "@/types/chat";

interface ChatProps {}

export function Chat({}: ChatProps) {
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
      { role: "bot", content: "それは素晴らしいですね！どのようにお手伝いできますか？" },
    ]
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

  return (
    <div className="flex flex-col space-y-4 w-1/2">
      <div className="flex flex-col space-y-2 overflow-auto h-[80vh]">
        {conversation.messages.map((message, index) => (
          <div key={index} className="flex items-center text-lg">
            <p className="py-2">
              {message.role === "user" ? "User" : "Bot"}:<p>{message.content}</p>
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
