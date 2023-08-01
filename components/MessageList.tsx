import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import RubyText from "./RubyText";
import kuromoji from "kuromoji";
import { Conversation } from "@/types/chat";

interface MessageListProps {
  conversation: Conversation;
  tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null;
}

const MessageList: React.FC<MessageListProps> = ({ conversation, tokenizer }) => {
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
    </>
  );
};

export default MessageList;
