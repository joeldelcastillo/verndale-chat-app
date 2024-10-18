"use client";

import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
  InfoButton,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton,
} from "@chatscope/chat-ui-kit-react";
import { MessageModel } from "@chatscope/chat-ui-kit-react";
import { useRef, useState } from "react";

const kaiIco = "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg";

export default function Home() {
  const lastIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState<Record<string, MessageModel>>({});
  const handleSend = (message: unknown) => {
    const newMessage: MessageModel = {
      message: String(message),
      direction: "outgoing",
      position: "single",
      type: "text",
      sender: "Kai",
      sentTime: new Date().toISOString()
    };
    setMessages({ ...messages, [String(lastIdRef.current)]: newMessage });
    lastIdRef.current++;
    setMsgInputValue("");
    inputRef.current?.focus();
  };
  return (
    <ChatContainer style={{ height: "500px" }}>
      <ConversationHeader>
        <Avatar src={kaiIco} name="Kai" />
        <ConversationHeader.Content userName="Kai" info="Active 10 mins ago" />
        <ConversationHeader.Actions>
          <VoiceCallButton />
          <VideoCallButton />
          <InfoButton />
        </ConversationHeader.Actions>
      </ConversationHeader>
      <MessageList scrollBehavior="smooth" typingIndicator={<TypingIndicator content="Emily is typing" />}>
        {Object.values(messages).map((message, index) => (
          <Message key={index} model={message} />
        ))}
      </MessageList>
      <MessageInput placeholder="Type message here" onSend={handleSend} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />
    </ChatContainer>
  );

}
