import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { loginSuccess } from '../store/authSlice';
import { Link } from 'react-router-dom';
// Removed: import { fetchAllTeam } from '@/store/teamSlice';
// Removed: import { useSelector } from 'react-redux'; // No longer needed for teams, but useDispatch is still used

export default function Signup() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const api_url = import.meta.env.VITE_API_URL;

  // Local state for teams data, loading, and error
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true); // Set to true initially to show loading
  const [teamsError, setTeamsError] = useState(null);

  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Function to fetch teams directly
  const fetchTeams = async () => {
    setLoadingTeams(true);
    setTeamsError(null);
    try {
      const res = await fetch(`${api_url}/api/v1/teams`, {
        method: 'GET',
        // headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch teams');
      }

      const data = await res.json();
      setTeams(data?.data || []);
      if (data.length > 0) {
        setSelectedTeamId(data[0]._id); 
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeamsError(err.message || 'Could not load teams.');
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []); 

  const handleSignup = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseUid = user.uid;

      const res = await fetch(`${api_url}/api/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, firebaseUid, role, teamId: selectedTeamId }), // Pass selectedTeamId
      });
      console.log("res", res);

      const data = await res.json();

      if (res.ok) {
        const idTokenResult = await user.getIdTokenResult(true);
        const roleFromClaims = idTokenResult.claims.role || data.user.role;
        dispatch(loginSuccess({ user: { ...data.user, role: roleFromClaims }, token: data.token }));
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.log(error);
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

      {/* Team Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="teamSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Select Team:
        </label>
        {loadingTeams && <p>Loading teams...</p>}
        {teamsError && <p className="text-red-500">Error loading teams: {teamsError}</p>}
        {!loadingTeams && !teamsError && (
          <select
            id="teamSelect"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="block w-full p-2 border rounded"
          >
            <option value="">-- Select a Team --</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        )}
      </div>

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