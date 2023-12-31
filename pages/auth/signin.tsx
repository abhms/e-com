import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

async function signIn(email: string, password: string) {
  const response = await fetch('/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  console.log(data, 'data');
  toast(data.message, { hideProgressBar: true, autoClose: 2000, type: 'success' });
  if (response.ok) {
    const { token } = data;
    localStorage.setItem('token', token);
    return true; 
  } else {
    console.error(data.error);
    toast(data.error, { hideProgressBar: true, autoClose: 2000, type: 'error' });
    return false; 
  }
}

const signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      router.push('/'); 
    }
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) {
      router.push('/'); 
    }
  }
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-2 text-xs text-center text-gray-700">
          New to SHOPNOW ?{' '}
          <a
            href="/auth/signup"
            className="font-medium text-gray-600 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </>
  );
};

export default signin