import React from "react";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import RubyText from "./RubyText";
import kuromoji from "kuromoji";

import HelperImage from "./HelperImage";
import { Conversation } from "@/types/chat";
import { AssistantImage, defaultLinks } from "@/types/AssistantImage";

interface MessageListProps {
  conversation: Conversation;
  tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null;
}

const MessageList: React.FC<MessageListProps> = ({ conversation, tokenizer }) => {
  const [savedImageLinks, setSavedImageLinks] =
    useState<Record<AssistantImage, string>>(defaultLinks);

  const bottomRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imagesString = localStorage.getItem("savedImageLinks");
    if (imagesString) {
      const images = JSON.parse(imagesString) as Record<AssistantImage, string>;
      setSavedImageLinks(images);
    }
  }, []);

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    localStorage.setItem("conversation", JSON.stringify(conversation.messages));
  }, [conversation]);

  if (tokenizer === null) return null;

  const parseContent = (content: string, messageIndex: number) => {
    return content.split(/<Image emotion=(.*?)>/g).flatMap((part, index) => {
      if (index % 2 !== 0) {
        return (
          <HelperImage
            key={`image-${messageIndex}-${index}`}
            image={part as AssistantImage}
            imageLinks={savedImageLinks}
          />
        );
      }
      return part.split("\n").map((line, i) => (
        <React.Fragment key={`text-${messageIndex}-${index}-${i}`}>
          <RubyText text={line} tokenizer={tokenizer} />
          {line !== "" && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <>
      {conversation.messages.map((message, index) => (
        <div key={index} className="flex items-center text-lg border-b p-2">
          <div className="py-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
              </div>
              <div className="flex-grow">
                {message.role === "assistant" ? (
                  parseContent(message.content, index)
                ) : (
                  <RubyText text={message.content} tokenizer={tokenizer} />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </>
  );
};

export default MessageList;
