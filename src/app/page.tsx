
'use client'

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, AttachmentButton, Avatar, ConversationHeader, InfoButton, InputToolbox, MessageSeparator, SendButton, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';

export default function Home() {
  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer
          style={{
            height: '500px'
          }}
        >
          <ConversationHeader>
            <Avatar
              name="Emily"
              src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
            />
            <ConversationHeader.Content
              info="Active 10 mins ago"
              userName="Emily"
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList typingIndicator={<TypingIndicator content="Emily is typing" />}>
            <MessageSeparator content="Saturday, 30 November 2019" />
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'single',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'single',
                sender: 'Oliver',
                sentTime: '15 mins ago'
              }}

            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'first',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
            </Message>
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'last',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'first',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'normal',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'normal',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'last',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'first',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'last',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
            <MessageSeparator content="Saturday, 31 November 2019" />
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'single',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'single',
                sender: 'Oliver',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'first',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'normal',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'last',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'first',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'normal',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'normal',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'outgoing',
                message: 'Hello my friend',
                position: 'last',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'first',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            />
            <Message
              model={{
                direction: 'incoming',
                message: 'Hello my friend',
                position: 'last',
                sender: 'Emily',
                sentTime: '15 mins ago'
              }}
            >
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
            </Message>
          </MessageList>
          <MessageInput
            placeholder="Type message here"
          />
          <InputToolbox>
            <AttachmentButton />
            <SendButton />
          </InputToolbox>
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
