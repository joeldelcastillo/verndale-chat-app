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
import type { Message as MessageType } from "@/types/Message";
import { getMessagesCollectionRef, sendMessage } from "@/helpers/getReferences";
import { onSnapshot } from "firebase/firestore";
import { Auth } from "@/providers/config";
// import { User } from "@/types/User";

const kaiIco = "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { conversations, messages, setMessages } = useAuth() as {
    conversations: Record<string, ConversationType>;
    messages: Record<string, Record<string, MessageType>>;
    setMessages: React.Dispatch<React.SetStateAction<Record<string, Record<string, MessageType>>>>;
  };
  const [currentConversation, setCurrentConversation] = useState<ConversationType | null>(null);
  const [otherUserId, setOtherUserId] = useState<string>();
  const [msgInputValue, setMsgInputValue] = useState("");
  const { width, } = useWindowSize();

  useEffect(() => {
    if (!currentConversation || !currentConversation.id) return;

    const messagesRef = getMessagesCollectionRef(currentConversation.id);
    // I need to add cache here
    // const messagesQuery = queryMessages(chatId, {});
    const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
      setMessages((prevMessages: Record<string, Record<string, MessageType>>) => {
        const updatedMessages: Record<string, Record<string, MessageType>> = { ...prevMessages };
        querySnapshot.docs.forEach((doc) => {
          updatedMessages[currentConversation.id] = { ...updatedMessages[currentConversation.id], [doc.id]: doc.data() as MessageType };
        });
        // AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => unsubscribe();
  }, [currentConversation]);


  // console.log(conversations);

  const handleSend = (message: unknown) => {


    if (!currentConversation || !Auth || !Auth.currentUser || !otherUserId) return;
    console.log(currentConversation);
    const newMessage: MessageType = {
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
      type: 'message',
      setCurrentConversation,
    });
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

  const handleConversationClick = useCallback((conversation: ConversationType) => {

    if (sidebarVisible) {
      setSidebarVisible(false);
    }
    setCurrentConversation(conversation);
    setOtherUserId(conversation.members.filter((member) => member !== Auth.currentUser?.uid)[0]);

    // console.log(conversation, conversation.members.filter((member) => member !== Auth.currentUser?.uid)[0]);

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
      <div style={{ height: "80vh", position: "relative" }}>
        <MainContainer responsive>
          {/* <Sidebar position="left" scrollable={false} style={sidebarStyle}> */}
          <Sidebar position="left" scrollable={false} style={width && width < 576 ? sidebarStyle : {}}>
            <ConversationList>
              {
                Object.values(conversations).map((conversation, index) => (
                  <Conversation
                    key={index}
                    onClick={() => handleConversationClick(conversation)}
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
                  {Object.values(messages[currentConversation?.id || ""] || {}).map((message, index) => (
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
