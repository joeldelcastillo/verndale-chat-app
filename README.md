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
