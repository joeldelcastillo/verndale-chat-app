import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp, serverTimestamp } from 'firebase/firestore';
// import { IMessage } from 'react-native-gifted-chat';
import { Auth } from '@/providers/config';

import { Message } from './Message';
// import { Message } from './MessageTypes';

// The cloud functions have to constantly update the requests

// unreadCnt?: number;
// unreadDot?: boolean;

export class Conversation {
  id: string;
  members: string[]; // user ids
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  lastMessage: Message;
  writing: string;

  constructor(data: Conversation) {
    this.id = data.id;
    this.members = data.members;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
    this.updatedAt = data.updatedAt;
    this.updatedBy = data.updatedBy;
    this.lastMessage = data.lastMessage;
    this.writing = data.writing;
  }
}

export const conversationConverter = {
  toFirestore(conversation: Conversation): DocumentData {
    return {
      id: conversation.id,
      members: conversation.members,
      createdAt: conversation.createdAt,
      createdBy: conversation.createdBy,
      updatedAt: conversation.updatedAt,
      updatedBy: conversation.updatedBy,
      lastMessage: conversation.lastMessage,
      writing: conversation.writing,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Conversation {
    const data = snapshot.data(options) as Conversation;
    return new Conversation({
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt ? (data.createdAt as unknown as Timestamp).toDate() : new Date(),
      updatedAt: data.updatedAt ? (data.updatedAt as unknown as Timestamp).toDate() : new Date(),
      createdBy: data.createdBy || '',
      writing: data.writing || '',
      lastMessage: data.lastMessage
        ? { ...data.lastMessage, createdAt: data.lastMessage.createdAt ? (data.lastMessage.createdAt as unknown as Timestamp).toDate() : new Date() }
        : conversationInitialState.lastMessage,
    });
  },
};

export const conversationInitialState: Conversation = {
  id: '',
  members: [],
  createdAt: serverTimestamp() as unknown as Date,
  createdBy: Auth.currentUser?.uid || '',
  updatedAt: serverTimestamp() as unknown as Date,
  updatedBy: Auth.currentUser?.uid || '',
  writing: '',
  lastMessage: {
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
  },
};
