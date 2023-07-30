import React from "react";

interface InputFieldProps {
  message: string;
  assistantIsTyping: boolean;
  error: boolean;
  onMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress: (message: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  message,
  assistantIsTyping,
  error,
  onMessageChange,
  onEnterPress,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.trim() !== "") {
      onEnterPress(message);
    }
  };

  return (
    <input
      placeholder="Type a message..."
      type="text"
      value={message}
      onChange={onMessageChange}
      onKeyDown={handleKeyDown}
      disabled={assistantIsTyping || error}
      className="border p-2 bg-black text-white"
    />
  );
};

export default InputField;
