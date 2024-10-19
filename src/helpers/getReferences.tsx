import { addDoc, arrayUnion, collection, doc, query, setDoc, updateDoc, where } from 'firebase/firestore';

import { Auth, Firestore } from '../provider/config';
import { privateUserConverter, userConverter } from '@/types/User';
import { Message, messageConverter, messageInitialState } from '@/types/Message';
import { Conversation, conversationConverter, conversationInitialState } from '@/types/Conversation';
import { Alert } from '../provider/AlertProvider';


export const getUserRef = (uid: string) => {
  return doc(Firestore, 'users', uid).withConverter(userConverter);
};

export const getUsersCollectionRef = () => {
  return collection(Firestore, 'users').withConverter(userConverter);
};

export const getPrivateUserRef = (uid: string) => {
  return doc(Firestore, 'users', uid, 'private', 'private').withConverter(privateUserConverter);
};

export const getMessagesCollectionRef = (conversationId: string) => {
  return collection(Firestore, 'conversations', conversationId, 'messages').withConverter(messageConverter);
};

export const getConversationRef = (conversationId: string) => {
  return doc(Firestore, 'conversations', conversationId).withConverter(conversationConverter);
};

// Puede dar error de limite de conversations
export const getConversationsCollectionRef = (conversations: string[]) => {
  if (conversations.length === 0 || !conversations) return;
  return query(collection(Firestore, 'conversations'), where('id', 'in', conversations || [])).withConverter(conversationConverter);
};

export const updateConversation = (lastMessage: Message, conversationId: string) => {
  const conversationRef = getConversationRef(conversationId);
  updateDoc(conversationRef, { lastMessage });
};

export const createConversation = async (conversationId: string, otherUser: string, setCurrentConversation?: (conversation: Conversation) => void, throwError: (alert: Alert) => void) => {

  const conversationRef = getConversationRef(conversationId);
  // TO DO: This has to be done through Cloud Functions / this is a security issue
  console.log(otherUser);
  if (!otherUser || !Auth || !Auth.currentUser) {
    console.warn('The conversation could not be created');
    return;
  }
  const conversation: Conversation = { ...conversationInitialState, id: conversationId, members: [Auth.currentUser.uid, otherUser], createdBy: Auth.currentUser.uid, updatedBy: Auth.currentUser.uid };
  const otherPrivateUserRef = getPrivateUserRef(otherUser);
  const currentPrivateUserRef = getPrivateUserRef(Auth.currentUser.uid);

  console.log('Creating conversation');
  await setDoc(conversationRef, conversation, { merge: true }).catch((error) => { throwError({ type: 'Error', message: error.message }); });
  await updateDoc(currentPrivateUserRef, { conversations: arrayUnion(conversationId) }).catch((error) => { throwError({ type: 'Error', message: error.message }); });
  await updateDoc(otherPrivateUserRef, { conversations: arrayUnion(conversationId) }).catch((error) => { throwError({ type: 'Error', message: error.message }); });
  if (setCurrentConversation) setCurrentConversation(conversation);
  console.log('conversation created');
};

type sendMessageProps = {
  newMessages: Message[];
  type: 'message';
  conversationId: string;
  otherUser: string;
  currentConversation?: Conversation | undefined;
  setCurrentConversation?: (conversation: Conversation) => void;
}

export const sendMessage = (messageProps: sendMessageProps) => {
  const messagesRef = getMessagesCollectionRef(messageProps.conversationId);
  // const otherUserNotificationsRef = getUserNotificationsRef(messageProps.otherUser);


  const lastMessage: Message = {
    ...messageProps.newMessages[0],
    sender: Auth.currentUser?.uid,
    conversation: messageProps.conversationId,
    id: '',
  };
  // updateconversation(lastMessage);
  if (!messageProps.currentConversation) {
    createConversation(messageProps.conversationId, messageProps.otherUser, messageProps.setCurrentConversation, () => { });
  }
  updateConversation(lastMessage, messageProps.conversationId);
  addDoc(messagesRef, { ...messageInitialState, ...lastMessage });
};
