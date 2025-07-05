import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { loginSuccess } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // 👈 Add this line
import { setSocket } from '@/store/socketSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseUid = user.uid;
      const idToken = await user.getIdToken(true);

      const res = await fetch(`${api_url}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, firebaseUid }),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        const role = data.user.role;
        const loggedInUser = { ...data.user, role };
        dispatch(loginSuccess({ user: loggedInUser, token: data.token }));

        // 🔥 Connect to WebSocket
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
          withCredentials: true,
        });

        socket.on('connect', () => {

  socket.emit('connect_message', {
    userId: loggedInUser._id,
    teamId: loggedInUser.teamId,
    name: loggedInUser.name,
  });
  dispatch(setSocket(socket));
});

        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4 text-blue-600">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
