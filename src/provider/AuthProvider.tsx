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
import { User, userInitialState } from '@/types/User';
import { useRouter } from 'next/navigation';


// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: userInitialState,
  signUp: async () => { throw new Error("signUp function not implemented"); },
  logIn: async () => { throw new Error("logIn function not implemented"); },
  logOut: async () => { throw new Error("logOut function not implemented"); }
});

// Make auth context available across the app by exporting it
interface AuthContextType {
  user: User;
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
  const [user, setUser] = useState<User>(userInitialState);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Update the state depending on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      if (user) {
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
    setUser(userInitialState);
    return await signOut(Auth);
  };

  // Wrap the children with the context provider
  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};