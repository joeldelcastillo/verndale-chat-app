import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore';
import { Auth } from '@/provider/config';
import { MessageModel, MessagePayload } from '@chatscope/chat-ui-kit-react';
import { MessageDirection, MessageType } from '@chatscope/chat-ui-kit-react/src/types/unions';


export class Message implements MessageModel {
  id: string | number;
  conversation: string;
  message?: string;
  sentTime?: string;
  sender?: string;
  direction: MessageDirection;
  position: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
  type?: MessageType;
  payload?: MessagePayload;
  createdAt: Date;

  constructor(data: Message) {
    this.id = data.id;
    this.conversation = data.conversation;
    this.message = data.message;
    this.sentTime = data.sentTime;
    this.sender = data.sender;
    this.direction = data.direction;
    this.position = data.position;
    this.type = data.type;
    this.payload = data.payload;
    this.createdAt = data.createdAt;
  }
}

export const messageConverter = {
  toFirestore(message: Message): DocumentData {
    return {
      ...message
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Message {
    const data = snapshot.data(options) as Message;
    return new Message({
      ...data,
      id: snapshot.id,
      direction: data.sender === Auth.currentUser?.uid ? 'outgoing' : 'incoming',
      createdAt: data.createdAt ? (data.createdAt as unknown as Timestamp).toDate() : new Date(),
    });
  },
};

export const messageInitialState: Message = {
  id: '',
  conversation: '',
  message: '',
  sentTime: '',
  sender: '',
  direction: 'incoming',
  position: 'single',
  type: 'text',
  payload: '',
  createdAt: new Date(),
};
