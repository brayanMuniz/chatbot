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
  }, [conversation]);

  if (tokenizer === null) return null;

  const parseContent = (content: string, messageIndex: number) => {
    const textParts: JSX.Element[] = [];
    const images: JSX.Element[] = [];

    content.split(/<Image emotion=(.*?)>/g).forEach((part, index) => {
      if (index % 2 !== 0) {
        images.push(
          <HelperImage
            key={`image-${messageIndex}-${index}`}
            image={part as AssistantImage}
            imageLinks={savedImageLinks}
          />
        );
      } else {
        part.split("\n").forEach((line, i) => {
          textParts.push(
            <React.Fragment key={`text-${messageIndex}-${index}-${i}`}>
              <RubyText text={line} tokenizer={tokenizer} />
              {line !== "" && <br />}
            </React.Fragment>
          );
        });
      }
    });

    return { textParts, images };
  };

  return (
    <>
      {conversation.messages.map((message, index) => {
        const { textParts, images } = parseContent(message.content, index);
        return (
          <div
            key={index}
            className={`flex items-center text-lg p-2 ${
              message.role === "user" ? "bg-user-background" : ""
            }`}
          >
            <div className="py-2 flex-grow">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                </div>
                <div className="flex-grow">{textParts}</div>
              </div>
            </div>
            {images.length > 0 && (
              <div className="ml-4">
                {images.map((image) => (
                  <div key={image.key}>{image}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
};

export default MessageList;
