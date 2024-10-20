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
- **Responsive design** with Tailwind CSS.

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
