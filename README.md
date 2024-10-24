# Verndale Chat App

This is a chat application built with [Next.js](https://nextjs.org) and [Firebase](https://firebase.google.com).

![alt text](/public/screenshot.jpg)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/joeldelcastillo/verndale-chat-app.git
   cd verndale-chat-app

   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- **src/components/**: Contains React components used throughout the application.
  - **FileUpload.tsx**: Component for uploading files to Firebase Storage.
  - **Navbar.tsx**: Component for the navigation bar.
- **src/providers/**: Contains configuration and provider files.
  - **config.ts**: Firebase configuration and initialization.
- **public/**: Contains static assets such as images and icons.
- **pages/**: Contains Next.js pages.
- **layout.tsx**: The main entry point of the application.
- **styles/**: Contains global styles and Tailwind CSS configuration.

## Features

- **Real-time chat** functionality using Firebase Firestore.
  - Direct Messages
  - Group Messages
- **User authentication** with Firebase Auth.
- **File upload** support with Firebase Storage.
- **Responsive design** with Tailwind CSS and [@chatscope/chat-ui-kit-react](https://chatscope.io/storybook/react/)

## State Management

State management in this chat application is handled using React's Context API and Hooks. This approach allows for a centralized state management solution that is easy to understand and maintain.

#### User Context

The `AuthContextProvider` is responsible for managing the authentication state of the user. It provides the current user object and authentication methods to the components that need them.

- **Provider**: The `UserProvider` component wraps the entire application and provides the user state and authentication methods.
- **Consumer**: Any component that needs access to the user state can use the `useAuth` hook to consume the `AuthContext`.

It contains the following data:

```jsx
// Available at any time
  users: Record<string, User>;
  setUsers: (users: Record<string, User>) => void;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;

// Available only once user is logged in
  currentUser: User;
  setCurrentUser: (user: User) => void;
  privateUser: PrivateUser;
  setCurrentPrivateUser: (user: PrivateUser) => void;
  conversations: Record<string, Conversation>;
  setConversations: (conversations: Record<string, Conversation>) => void;
  messages: Record<string, Record<string, Message>>;
  setMessages: (messages: Record<string, Record<string, Message>>) => void;

```

Usage:

```jsx
import { useAuth } from "@/providers/AuthProvider";

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  return <div>{currentUser.name}</div>;
};
```

#### Alert Context

The `AlertContextProvider` is responsible for managing the alerts across the system
It contains the following data:

```jsx
type AlertType = "Success" | "Error" | "Warning";

export type Alert = {
  type: AlertType,
  message: string,
};
```

Usage:

```jsx
import { useAlert } from "@/providers/AlertProvider";

export const UserProvider = ({ children }) => {
  const alert = useAlert();

  function alertToUser() {
    alert.showAlert("Warning", "Login you in...");
  }
};
```

## Database Structure

This is a Firestore document based Non SQL Database Structure:

![alt text](/public/database.png)

- Why do I separate the User from the PrivateUser?
  Firebase Rules for security measures can only declare which documents can or cannot access a user.
  Therefore, we have to separate those records to have security logic in the future.

## Messaging System Logic

![alt text](/public/chat.png)

The system is designed to handle direct messaging (DM) between users, creating conversations dynamically, and retrieving messages in real-time.

### Users

Each user has a unique profile stored in Firestore under /users/<userId>.
A user can have multiple conversations listed in their ChatList[] array.

### Conversations

A new conversation is initiated by generating a new conversation ID.
Messages for a conversation are stored under /conversations/<conversationId>/messages.

### Logic Flow

1. Generating a Conversation:
   When two users start a DM, the function generateConversation(userId1, userId2) is called.

This generates a unique conversation ID (newId).

### Firestore Collections:

1. A new chat document is created under /conversations/<newId>.
   This new conversation is then added to:
   user1's ChatList[] (Firestore path: /users/<userId1>)
   user2's ChatList[] (Firestore path: /users/<userId2>) 2. Creating the Chat Document:
   Once a new conversation is generated:
2. A Chat document is created in the Firestore collection /chats/<newId>.
   The conversation ID (newId) is added to both users' ConversationList[].
   Firestore Paths:
   /users/<userId1> for User 1
   /users/<userId2> for User 2
3. Retrieving Chat and Messages:
   The system listens for real-time updates using Firestore's onSnapshot feature.
   It retrieves the chatDoc from the /chats/<newId> document and listens to the associated messages stored in the /conversations/<newId>/messages subcollection.
   This ensures that both users receive updates to the conversation in real time.
4. Writing and Updating Messages:
   When a user sends a message, the function generateMessageDoc(sender, receiver, timestamp, message) is invoked to create a message document with all necessary metadata.

This message is then:

5. Appended to the messages subcollection /conversations/<conversationId>/messages.
6. The corresponding chat document is updated with the latest message under /conversations/<conversationId>.
7. Real-time Message Delivery:
   Once a message is appended, the onSnapshot listener retrieves the latest messages for the users involved.
   Both users will see the conversation updated in real time without needing to refresh or query for updates manually.

## Cloud Functions for Firebase Image Handler

This project also contains Firebase Cloud Functions written in TypeScript.
Custom Event Handling with Firebase Extensions - Image Handler

### Prerequisites

Before setting up the project, make sure you have the following installed:

1. [Node.js](https://nodejs.org/) (version 14 or higher)
2. [Firebase CLI](https://firebase.google.com/docs/cli) (version 11.0.0 or higher)

### Install Dependencies

```bash
cd functions
npm install
```

### Deploy Functions

```bash
firebase deploy --only functions
```
