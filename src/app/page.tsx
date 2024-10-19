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
import useWindowSize from "../hooks/useWindow";
import Navbar from "../components/Navbar";
import { useAuth } from "@/providers/AuthProvider";

const kaiIco = "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg";

export default function Home() {
  const lastIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { conversations } = useAuth();
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState<Record<string, MessageModel>>({});
  const { width, } = useWindowSize();

  // console.log(conversations);

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

  const [sidebarVisible, setSidebarVisible] = useState(true);
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

  return (
    <div>
      <Navbar />
      <div style={{ height: "90vh", position: "relative" }}>
        <MainContainer responsive>
          {/* <Sidebar position="left" scrollable={false} style={sidebarStyle}> */}
          <Sidebar position="left" scrollable={false} style={width && width < 576 ? sidebarStyle : {}}>
            <ConversationList>
              {
                Object.values(conversations).map((conversation, index) => (
                  <Conversation
                    key={index}
                    onClick={handleConversationClick}
                  >
                    <Avatar src={kaiIco} name="Lilly" status="available" style={conversationAvatarStyle} />
                    <Conversation.Content name="Office" lastSenderName="Lilly" info={conversation.lastMessage.message}
                      style={conversationContentStyle} />
                    {/* <Avatar src={kaiIco} name={'Office'} status="available" style={conversationAvatarStyle} /> */}
                  </Conversation>
                ))
              }
            </ConversationList>
          </Sidebar>
          {/* <ChatContainer style={chatContainerStyle}> */}
          {
            sidebarVisible === false ? (
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
            ) : (
              <ChatContainer style={width && width < 576 ? chatContainerStyle : {}}>
                <MessageList>
                  <MessageList.Content
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '1.2em',
                      height: '100%',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {width}
                  </MessageList.Content>
                </MessageList>
              </ChatContainer>
            )

          }

        </MainContainer>
      </div>
    </div>



  );
}
