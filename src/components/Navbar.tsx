// components/Navbar.js

import { generateChatId } from "@/helpers/chatIdGenerator";
import { useAuth } from "@/providers/AuthProvider";
import { Auth } from "@/providers/config";
import { Conversation, conversationInitialState } from "@/types/Conversation";
import Link from "next/link";
import { use, useRef, useState } from "react";
import { Storage } from "@/providers/config";
import FileUpload from "./FileUpload";
import { getUserRef } from "@/helpers/getReferences";
import { updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAlert } from "@/hooks/useAlert";

type NavbarProps = {
  setCurrentConversation: (conversation: Conversation) => void;
  // setMessages: (messages: Record<string, Record<string, any>>) => void;
};

const Navbar = ({ setCurrentConversation }: NavbarProps) => {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangingProfile, setIsChangingProfile] = useState(false);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const alert = useAlert();

  const { users } = useAuth();

  const signOut = async () => {
    await Auth.signOut();
  };

  const imgRef = useRef<HTMLButtonElement | null>(null);

  // Create a new Conversation with the other user
  const handleClickProfile = (otherUserId: string) => {
    // console.log(otherUserId);
    if (!Auth.currentUser) return;
    const newConversation: Conversation = {
      ...conversationInitialState,
      id: generateChatId(Auth.currentUser.uid, otherUserId),
      members: [Auth.currentUser.uid, otherUserId],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: Auth.currentUser.uid,
    };
    setIsChatMenuOpen(false);
    setCurrentConversation(newConversation);
  }

  const openUpdateProfilePopUp = () => {
    setIsChangingProfile(!isChangingProfile);
  }

  const updateProfileUrl = async (url: string) => {
    if (!Auth.currentUser) return;
    const userRef = getUserRef(Auth.currentUser.uid);

    try {
      await updateDoc(userRef, { avatar: url });
      await updateProfile(Auth.currentUser, { photoURL: url });
    } catch (error: Error | any) {
      console.error(error);
      alert.showAlert('Error', error.message);
      return;
    }
  }


  const randomAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <nav className="bg-white border-gray-200 h-[10vh]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/verndale.png" className="h-5" alt="Logo" />
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-5">
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>

          <button
            ref={imgRef}
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={Auth.currentUser?.photoURL || randomAvatar}
              alt="user photo"
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-5 top-12 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow ">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900">
                  {Auth.currentUser?.displayName}
                </span>
                <span className="block text-sm text-gray-500 truncate">
                  {Auth.currentUser?.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    onClick={openUpdateProfilePopUp}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  w-100 cursor-pointer"                >
                    Update Profile
                  </a>
                </li>
                <li>
                  <a
                    onClick={signOut}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  w-100 cursor-pointer"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {
          isChangingProfile && (
            <div
              onClick={() => setIsChangingProfile(false)}
              className="fixed inset-0 flex items-center justify-center z-10"
            >
              <div
                onClick={(e) => e.stopPropagation()} // Prevents the click from closing the popup
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              >
                <FileUpload setDownloadURL={setAvatarURL} onFileUploaded={updateProfileUrl} />
              </div>
            </div>
          )
        }

        {isChatMenuOpen && (
          <div className="absolute right-10 top-12 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow ">
            <ul className="py-2" aria-labelledby="user-menu-button">
              {
                // Select all usrers except the current user to display in the chat menu
                Object.values(users).filter((user) => user.id !== Auth.currentUser?.uid).map((user) => (
                  <li key={user.id}>
                    <button onClick={() => handleClickProfile(user.id)}
                      className="flex gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-100 cursor-pointer items-center justify-start">
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={user.avatar || randomAvatar}
                        alt="user photo"
                      />
                      {user.email}
                    </button>
                  </li>
                ))
              }

            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
