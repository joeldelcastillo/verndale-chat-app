'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';
import { Auth, Firestore } from './config';
import { PrivateUser, privateUserInitialState, User, userConverter, userInitialState } from '@/types/User';
import { useRouter } from 'next/navigation';
import { Conversation } from '@/types/Conversation';
import { Message } from '@/types/Message';
import { doc, onSnapshot } from 'firebase/firestore';
import { getConversationsCollectionRef, getPrivateUserRef, getUsersCollectionRef } from '@/helpers/getReferences';

// Make auth context available across the app by exporting it
interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  privateUser: PrivateUser;
  setCurrentPrivateUser: (user: PrivateUser) => void;
  users: Record<string, User>;
  setUsers: (users: Record<string, User>) => void;
  conversations: Record<string, Conversation>;
  setConversations: (conversations: Record<string, Conversation>) => void;
  messages: Record<string, Record<string, Message>>;
  setMessages: (messages: Record<string, Record<string, Message>>) => void;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

// Create auth context with the initial state
const AuthContext = createContext<AuthContextType>({
  currentUser: userInitialState,
  setCurrentUser: () => { },
  privateUser: privateUserInitialState,
  setCurrentPrivateUser: () => { },
  users: {},
  setUsers: () => { },
  conversations: {},
  setConversations: () => { },
  messages: {},
  setMessages: () => { },
  signUp: async () => ({} as UserCredential),
  logIn: async () => ({} as UserCredential),
  logOut: async () => { },
});

export const useAuth = () => useContext<AuthContextType>(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Define the constants for the user and loading state across the app
  const [currentUser, setCurrentUser] = useState<User>(userInitialState);
  const [privateUser, setPrivateUser] = useState<PrivateUser>(privateUserInitialState);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [messages, setMessages] = useState<Record<string, Record<string, Message>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNavigated, setHasNavigated] = useState<boolean>(false);
  const router = useRouter();


  // Fetch the user data asynchronously when the user is logged in and manage
  // the navigation based on the user state
  useEffect(() => {
    const unsubscribeAuth = Auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = doc(Firestore, 'users', userAuth.uid).withConverter(userConverter);
        const unsubscribeFirestore = onSnapshot(userRef, async (doc) => { if (doc.exists()) { setCurrentUser(doc.data()) } });
        setHasNavigated(true);
        router.push('/');
        return unsubscribeFirestore;
      } else {
        setCurrentUser(userInitialState);
        router.replace('/register');
      }
    });
    setLoading(false);
    return unsubscribeAuth;
  }, [hasNavigated, router]);

  // Fetch the private user data asynchronously when the user is logged in
  useEffect(() => {
    const fetchPrivateData = async () => {
      if (!Auth.currentUser?.uid) return;
      const privateUserRef = getPrivateUserRef(Auth.currentUser.uid);
      const unsubscribeFirestore = onSnapshot(privateUserRef, (doc) => {
        if (doc.exists()) {
          setPrivateUser(doc.data());
        }
      });
      return unsubscribeFirestore;
    };
    fetchPrivateData();
  }, [currentUser]);

  // Fetch the conversations asynchronously when the user is logged in
  useEffect(() => {
    const fetchConversations = async () => {
      if (!Auth.currentUser) return;
      const conversationsRef = getConversationsCollectionRef(Auth.currentUser.uid);
      const unsubscribe = onSnapshot(conversationsRef, (querySnapshot) => {
        setConversations((prevChats) => {
          const updatedConversations = { ...prevChats };
          querySnapshot.docs.forEach((doc) => {
            updatedConversations[doc.id] = { ...doc.data(), id: doc.id };
          });
          return updatedConversations;
        });
      });
      return () => unsubscribe();
    }
    fetchConversations();
  }, [privateUser?.chats]);

  // Fetch the users asynchronously as soon as the client is loaded
  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = getUsersCollectionRef();
      const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
        setUsers((prevUsers) => {
          const updatedUsers = { ...prevUsers };
          querySnapshot.docs.forEach((doc) => {
            updatedUsers[doc.id] = doc.data();
          });
          return updatedUsers;
        });
      });
      return () => unsubscribe();
    };
    fetchUsers();
  }, []);



  // Sign up the user
  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(Auth, email, password);
  };

  // Login the user
  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(Auth, email, password);
  };

  // Logout the user and delete the user data
  const logOut = async () => {
    setCurrentUser(userInitialState);
    setMessages({});
    setConversations({});
    return await signOut(Auth);
  };

  // Wrap the children with the context provider
  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      privateUser,
      setCurrentPrivateUser: setPrivateUser,
      users,
      setUsers,
      conversations,
      setConversations,
      messages,
      setMessages,
      signUp,
      logIn,
      logOut
    }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};