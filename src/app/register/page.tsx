'use client';

import { createUserProfile } from '@/helpers/getReferences';
import { useAlert } from '@/hooks/useAlert';
import { useAuth } from '@/providers/AuthProvider';
import { Auth } from '@/providers/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setCurrentUser } = useAuth();
  const alert = useAlert();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const currentAuth = await createUserWithEmailAndPassword(Auth, email, password);
      const createdUser = await createUserProfile(currentAuth.user.uid, email, email, "", alert.showAlert);
      if (!createdUser) return;
      alert.showAlert('Success', 'User created successfully!');
      setCurrentUser(createdUser);
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        try {
          await signInWithEmailAndPassword(Auth, email, password)
          alert.showAlert('Success', 'User logged in successfully!');
          router.push("/");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setError(err.message);
        }
      }
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;