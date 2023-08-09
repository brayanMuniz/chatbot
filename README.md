# Japanese Language Learning Assistant

This project is a Japanese language learning assistant that leverages OpenAI's GPT-3.5-turbo model to assist users in understanding and comprehending the Japanese language. It includes features like automatic generation of furigana for kanji characters, emotion expressions, and a chat interface.

## Features

- **Japanese Tokenizer**: Utilizes `kuromoji` for tokenizing Japanese text.
- **Emotion Expressions**: Allows the assistant to express emotions through special tags.
- **Customizable System Prompts**: Users can edit the system prompt and emotions.
- **Conversation History**: Saves and retrieves conversation history from local storage.
- **Error Handling**: Displays error messages when necessary, such as when the OpenAI API key is not found.

## Components

- **ErrorMessage**: Displays error messages.
- **Settings**: Allows users to set the OpenAI API key.
- **SystemPrompt**: Enables editing of the system prompt.
- **MessageList**: Displays the conversation messages.
- **InputField**: Provides an input field for user messages.
- **EmotionModal**: Manages the emotions and expressions.

## How It Works

1. **Initialization**: On load, the OpenAI API is initialized, and previous conversations and custom prompts are retrieved from local storage. The Japanese tokenizer is also initialized.
2. **User Interaction**: Users can send messages, edit the system prompt, manage emotions, and clear chat history.
3. **OpenAI Integration**: User messages are sent to the OpenAI API, and the assistant's responses are displayed in the chat.
4. **Emotion Handling**: Emotions can be expressed using the `<Image emotion=emotionName>` tag.
5. **Local Storage**: Conversations are saved and retrieved from local storage.

## Dependencies

- React
- kuromoji
- openai

## Usage

This code snippet is a React functional component that can be integrated into a larger React application. Make sure to import the necessary dependencies and types, and set up the required components and styles.

## Customization

- **Emotions & Expressions**: You can edit the emotions and expressions through the `EmotionModal`.
- **System Prompt**: You can customize the system prompt through the `SystemPrompt`.

## Note

Make sure to provide a valid OpenAI API key and ensure that the necessary dependencies are installed.

