import type { Metadata } from "next";
import localFont from "next/font/local";
// import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "./globals.css";
import { AuthContextProvider } from "@/provider/AuthProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Verndale Chat App",
  description: "Takehome project for Verndale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
