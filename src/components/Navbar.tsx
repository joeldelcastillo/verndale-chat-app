// components/Navbar.js

import { useAuth } from "@/providers/AuthProvider";
import { Auth } from "@/providers/config";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { users } = useAuth();

  const signOut = async () => {
    await Auth.signOut();
  };

  const imgRef = useRef<HTMLButtonElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (imgRef.current && !imgRef.current.contains(event.target as Node)) {
      setIsChatMenuOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              src="https://imgv3.fotor.com/images/ai-headshot-generator/indoor-headshot-of-a-man-in-dark-blue-business-shirt-created-by-Fotor-AI-professional-LinkedIn-photo-maker.jpg"
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

        {isChatMenuOpen && (
          <div className="absolute right-10 top-12 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow ">
            <ul className="py-2" aria-labelledby="user-menu-button">
              {
                Object.values(users).map((user) => (
                  <li key={user.id}>
                    <a className="flex gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-100 cursor-pointer items-center justify-start">
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src="https://imgv3.fotor.com/images/ai-headshot-generator/indoor-headshot-of-a-man-in-dark-blue-business-shirt-created-by-Fotor-AI-professional-LinkedIn-photo-maker.jpg"
                        alt="user photo"
                      />
                      {user.email}
                    </a>
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
