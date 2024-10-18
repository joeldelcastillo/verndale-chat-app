import { Timestamp } from '@firebase/firestore';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, serverTimestamp } from 'firebase/firestore';
import { Auth } from '@/provider/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// The cloud functions have to constantly update the requests


// Private User is a separate document that contains all the private information of the user
// This is a cybersecurity measure to avoid leaking sensitive information
// This document is only accessible by the user itself and the cloud functions

export class PrivateUser {
  notifications: string[];
  chats: string[];

  constructor(data: PrivateUser) {
    this.notifications = data.notifications;
    this.chats = data.chats;
  }
}

// This is the converter that helps to convert the PrivateUser object to Firestore data and vice versaa
// It helps to maintain the type safety and avoid any runtime errors
export const privateUserConverter = {
  toFirestore(user: PrivateUser): DocumentData {
    return {
      notifications: user.notifications,
      chats: user.chats,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PrivateUser {
    const data = snapshot.data(options) as PrivateUser;
    return new PrivateUser(data);
  },
};


// This is the User document that contains all the public information of the user
// This document is accessible by all the users and can be cached in both the client and the server


export class User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.isOnline = data.isOnline;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

// This is the converter that helps to convert the User object to Firestore data and vice versa
// It helps to maintain the type safety and avoid any runtime errors
export const userConverter = {
  toFirestore(user: User): DocumentData {
    return {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options) as User; // Explicitly type data as UserType
    return new User({
      ...data,
      id: snapshot.id,
      updatedAt: data.updatedAt ? new Date((data.updatedAt as unknown as Timestamp).toDate().valueOf()) : new Date('2024-01-01'),
      createdAt: data.createdAt ? new Date((data.createdAt as unknown as Timestamp).toDate().valueOf()) : new Date('2024-01-01'),
    });
  },
};

export const privateUserInitialState: PrivateUser = {
  notifications: [],
  chats: [],
};

export const userInitialState: User = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  isOnline: false,
  createdAt: serverTimestamp() as unknown as Date,
  updatedAt: serverTimestamp() as unknown as Date,
};

// This is the function that is called when the user signs out
// It helps to do all the necessary cleanup and sign out the user across all the services
export const signOut = async () => {
  Auth.signOut();
  return;
}
