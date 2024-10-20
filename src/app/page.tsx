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
import { useCallback, useEffect, useRef, useState } from "react";
import useWindowSize from "../hooks/useWindow";
import Navbar from "../components/Navbar";
import { useAuth } from "@/providers/AuthProvider";
import type { Conversation as ConversationType } from "@/types/Conversation";
import { messageInitialState, type Message as MessageType } from "@/types/Message";
import { getMessagesCollectionRef, sendMessage } from "@/helpers/getReferences";
import { onSnapshot } from "firebase/firestore";
import { Auth } from "@/providers/config";
import { User } from "@/types/User";
// import { User } from "@/types/User";

const kaiIco = "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg";

export default function Home() {
  // Context access
  const { conversations, messages, setMessages, users } = useAuth() as {
    conversations: Record<string, ConversationType>;
    messages: Record<string, Record<string, MessageType>>;
    users: Record<string, User>;
    setMessages: React.Dispatch<
      React.SetStateAction<Record<string, Record<string, MessageType>>>
    >;
  };

  // Current conversation state
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationType | null>(null);
  const [otherUserId, setOtherUserId] = useState<string>();
  const [otherUser, setOtherUser] = useState<User | null>();
  const [msgInputValue, setMsgInputValue] = useState("");
  const { width } = useWindowSize();

  // Sidebar state
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});

  // As soon as the current conversation changes, we need to fetch the messages
  // For next time we access the same conversation, we can use the cache
  useEffect(() => {
    console.log(currentConversation);
    if (!currentConversation || !currentConversation.id) return;

    const messagesRef = getMessagesCollectionRef(currentConversation.id);
    // Would be awesome to add cache here
    const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
      setMessages(
        (prevMessages: Record<string, Record<string, MessageType>>) => {
          const updatedMessages: Record<string, Record<string, MessageType>> = {
            ...prevMessages,
          };
          querySnapshot.docs.forEach((doc) => {
            updatedMessages[currentConversation.id] = {
              ...updatedMessages[currentConversation.id],
              [doc.id]: doc.data() as MessageType,
            };
          });
          return updatedMessages;
        }
      );
    });

    return () => unsubscribe();
  }, [currentConversation, setMessages]);

  // Send message function to be called when the user sends a message
  const handleSend = (message: unknown) => {
    if (!currentConversation || !Auth || !Auth.currentUser || !otherUserId)
      return;
    console.log(currentConversation);
    const newMessage: MessageType = {
      ...messageInitialState,
      message: String(message),
      direction: "outgoing",
      position: "single",
      type: "text",
      sender: Auth.currentUser?.uid || "",
      sentTime: new Date().toISOString(),
      id: "",
      conversation: "",
      createdAt: new Date(),
    };
    sendMessage({
      newMessage: newMessage,
      otherUser: otherUserId,
      conversationId: currentConversation.id,
      type: "message",
      setCurrentConversation,
    });
    setMsgInputValue("");
    inputRef.current?.focus();
  };

  //Sidebar click handlers

  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  const handleConversationClick = useCallback(
    (conversation: ConversationType) => {
      setCurrentConversation(conversation);
    },
    []
  );

  useEffect(() => {
    if (!currentConversation) return;
    const handleNewConversation = () => {
      if (sidebarVisible) {
        setSidebarVisible(false);
      }
      const otherId = currentConversation.members.filter(
        (member) => member !== Auth.currentUser?.uid
      )[0]
      setOtherUserId(otherId);
      if (users[otherId]) setOtherUser(users[otherId]);
    };
    handleNewConversation();
  }, [currentConversation, setOtherUserId, sidebarVisible]);

  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%",
      });

      setConversationContentStyle({
        display: "flex",
      });

      setConversationAvatarStyle({
        marginRight: "1em",
      });

      setChatContainerStyle({
        display: "none",
      });
    } else {
      setSidebarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [
    sidebarVisible,
    setSidebarVisible,
    setConversationContentStyle,
    setConversationAvatarStyle,
    setSidebarStyle,
    setChatContainerStyle,
  ]);

  return (
    <div>
      <Navbar setCurrentConversation={setCurrentConversation} />
      <div style={{ height: "80vh", position: "relative" }}>
        <MainContainer responsive>
          <Sidebar
            position="left"
            scrollable={false}
            style={width && width < 576 ? sidebarStyle : {}}
          >
            <ConversationList>
              {Object.values(conversations).map((conversation, index) => (
                <Conversation
                  key={index}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <Avatar
                    src={kaiIco}
                    name="Lilly"
                    status="available"
                    style={conversationAvatarStyle}
                  />
                  <Conversation.Content
                    name="Office"
                    lastSenderName="Lilly"
                    info={conversation.lastMessage.message}
                    style={conversationContentStyle}
                  />
                  {/* <Avatar src={kaiIco} name={'Office'} status="available" style={conversationAvatarStyle} /> */}
                </Conversation>
              ))}
            </ConversationList>
          </Sidebar>
          {/* <ChatContainer style={chatContainerStyle}> */}
          {sidebarVisible === false ? (
            <ChatContainer style={chatContainerStyle}>
              <ConversationHeader>
                <ConversationHeader.Back onClick={handleBackClick}>
                  <button onClick={handleBackClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                </ConversationHeader.Back>
                <Avatar src={kaiIco} name="Zoe" />
                <ConversationHeader.Content
                  userName={currentConversation?.id === "office" ? "Office" : otherUser?.name || "User"}
                  info="Active 10 mins ago"
                />
              </ConversationHeader>

              <MessageList
                scrollBehavior="smooth"
                typingIndicator={<TypingIndicator content="Emily is typing" />}
              >
                <MessageSeparator content="thursday, 15 July 2021" />
                {currentConversation &&
                  Object.values(messages[currentConversation.id] || {})
                    .sort(
                      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
                    )
                    .map((message, index) => (
                      <Message
                        key={index}
                        model={{
                          message: message.message,
                          direction: message.direction,
                          position: message.position,
                          type: message.type,
                          sender: message.sender,
                          sentTime: message.sentTime,
                        }}
                      />
                    ))}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
                onChange={setMsgInputValue}
                value={msgInputValue}
                ref={inputRef}
              />
            </ChatContainer>
          ) : (
            <ChatContainer
              style={width && width < 576 ? chatContainerStyle : {}}
            >
              <MessageList>
                <MessageList.Content
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "1.2em",
                    height: "100%",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {width}
                </MessageList.Content>
              </MessageList>
            </ChatContainer>
          )}
        </MainContainer>
      </div>
    </div>
  );
}
