import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { loginSuccess } from '../store/authSlice';
import { Link } from 'react-router-dom';

export default function Signup() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  const handleSignup = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseUid = user.uid;

      const res = await fetch(`${api_url}/api/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, firebaseUid, role }),
      });
      console.log("res",res)

      const data = await res.json();

      if (res.ok) {
        const idTokenResult = await user.getIdTokenResult(true);
        const roleFromClaims = idTokenResult.claims.role || data.user.role;
        dispatch(loginSuccess({ user: { ...data.user, role: roleFromClaims }, token: data.token }));
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.log(error)
      console.error('Signup error:', error);
      setError('Failed to create account. Try again.');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      />
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
        className="block w-full mb-2 p-2 border rounded"
      />
      <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="block w-full mb-4 p-2 border rounded"
>
  <option value="ADMIN">Admin</option>
  <option value="MANAGER">Manager</option>
  <option value="MEMBER">Member</option>
</select>

      <button
        onClick={handleSignup}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Sign Up
      </button>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}