"use client";

import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
  TypingIndicator,
  MainContainer,
  Conversation,
  ConversationList,
  Sidebar,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { MessageModel } from "@chatscope/chat-ui-kit-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

  // --------------------------------------------------------- SideBar    ---------------------------------------------------------

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});


  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  const handleConversationClick = useCallback(() => {

    if (sidebarVisible) {
      setSidebarVisible(false);
    }

  }, [sidebarVisible, setSidebarVisible]);

  useEffect(() => {

    if (sidebarVisible) {

      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%"
      });

      setConversationContentStyle({
        display: "flex"
      });

      setConversationAvatarStyle({
        marginRight: "1em"
      });

      setChatContainerStyle({
        display: "none"
      });
    } else {
      setSidebarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }

  }, [sidebarVisible, setSidebarVisible, setConversationContentStyle, setConversationAvatarStyle, setSidebarStyle, setChatContainerStyle]);


  // --------------------------------------------------------- MessageList ---------------------------------------------------------

  const idRef = useRef(7);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (loadingMore === true) {
      setTimeout(() => {
        const newConversations = [];

        // Add 4 conversations                      
        for (let i = 0; i < 4; i++) {
          newConversations.push({ _id: ++idRef.current, name: `Emily ${idRef.current}`, avatarSrc: kaiIco });
        }

        setConversations(conversations.concat(newConversations));
        setLoadingMore(false);

      }, 1500);
    }
  }, [loadingMore]);

  // const onYReachEnd = () => setLoadingMore(true);

  const [conversations, setConversations] = useState([
    { _id: 0, name: "Lilly", avatarSrc: kaiIco },
    { _id: 1, name: "Joe", avatarSrc: kaiIco },
    { _id: 2, name: "Emily", avatarSrc: kaiIco },
    { _id: 3, name: "Kai", avatarSrc: kaiIco },
    { _id: 4, name: "Akane", avatarSrc: kaiIco },
    { _id: 5, name: "Eliot", avatarSrc: kaiIco },
    { _id: 6, name: "Zoe", avatarSrc: kaiIco },
    { _id: 7, name: "Patrik", avatarSrc: kaiIco }
  ]);

  return (

    <div style={{ height: "100vh", position: "relative" }}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false} style={sidebarStyle}>
          <ConversationList>
            <Conversation onClick={handleConversationClick}>
              <Avatar src={kaiIco} name="Lilly" status="available" style={conversationAvatarStyle} />
              <Conversation.Content name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you"
                style={conversationContentStyle} />
            </Conversation>
          </ConversationList>
        </Sidebar>
        <ChatContainer style={chatContainerStyle}>
          <ConversationHeader>
            <ConversationHeader.Back onClick={handleBackClick} />
            <Avatar src={kaiIco} name="Zoe" />
            <ConversationHeader.Content userName="Zoe" info="Active 10 mins ago" />
          </ConversationHeader>

          <MessageList scrollBehavior="smooth" typingIndicator={<TypingIndicator content="Emily is typing" />}>
            <MessageSeparator content="thursday, 15 July 2021" />
            {Object.values(messages).map((message, index) => (
              <Message key={index} model={message} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />
        </ChatContainer>
      </MainContainer>
    </div>


  );
}
