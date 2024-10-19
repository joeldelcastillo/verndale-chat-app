'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';
import { Auth } from './config';
import { PrivateUser, privateUserInitialState, User, userInitialState } from '@/types/User';
import { useRouter } from 'next/navigation';
import { Conversation } from '@/types/Conversation';
import { Message } from '@/types/Message';


// Create auth context
const AuthContext = createContext<AuthContextType>({
  currentUser: userInitialState,
  privateUser: privateUserInitialState,
  users: {},
  conversations: {},
  messages: {},
  signUp: async () => { throw new Error("signUp function not implemented"); },
  logIn: async () => { throw new Error("logIn function not implemented"); },
  logOut: async () => { throw new Error("logOut function not implemented"); }
});

// Make auth context available across the app by exporting it
interface AuthContextType {
  currentUser: User;
  privateUser: PrivateUser;
  users: Record<string, User>;
  conversations: Record<string, Conversation>;
  messages: Record<string, Record<string, Message>>;

  signUp: (email: string, password: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

export const useAuth = () => useContext<AuthContextType>(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  // Define the constants for the user and loading state
  const [currentUser, setCurrentUser] = useState<User>(userInitialState);
  const [privateUser, setPrivateUser] = useState<PrivateUser>(privateUserInitialState);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [messages, setMessages] = useState<Record<string, Record<string, Message>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Update the state depending on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      // Only download the user data if the user is logged in
      if (user) {
        // Download the user data from the database

        // setUser({
        //   email: user.email,
        //   uid: user.uid
        // });
        router.push("/");

      } else {
        // setUser({ email: null, uid: null });
        router.push("/register");
      }
    });

    setLoading(false);

    return () => unsubscribe();
  }, []);

  // Sign up the user
  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(Auth, email, password);
  };

  // Login the user
  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(Auth, email, password);
  };

  // Logout the user
  const logOut = async () => {
    setCurrentUser(userInitialState);
    return await signOut(Auth);
  };

  // Wrap the children with the context provider
  return (
    <AuthContext.Provider value={{ currentUser, privateUser, users, conversations, messages, signUp, logIn, logOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};