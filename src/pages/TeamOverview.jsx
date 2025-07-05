import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTeam,
  fetchActivityLogs,
  clearError,
  createTeam,
  fetchAllTeam
} from '../store/teamSlice';
import Loading from '../components/Loading';

export default function TeamOverview() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { teams:team, activityLogs, loading, error } = useSelector((state) => state.team);
  console.log("team",team)

  const [openTeamForm, setOpenTeamForm] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });

 const [showChatBox, setShowChatBox] = useState(false);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState(null);
const socketRef = useRef(null);


  useEffect(() => {
  if (!token || !user) return;

  if (user.role === 'ADMIN') {
    dispatch(fetchAllTeam({ token }));
  } else if (user.teamId) {
    dispatch(fetchTeam({ token, teamId: user.teamId }));
    dispatch(fetchActivityLogs({ token, teamId: user.teamId }));
  }
}, [dispatch, user, token]);


  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleCreateTeam = () => {
    if (!teamForm.name) return;
    const newTeam = {
      ...teamForm,
      adminId: user?.id,
    };
    dispatch(createTeam({ token, team: newTeam }));
    setTeamForm({ name: '', description: '' });
    setOpenTeamForm(false);
  };

  if (loading) return <Loading size="md" color="blue" />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Team Overview</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user?.role === 'ADMIN' && (
        <>
          <button
            onClick={() => setOpenTeamForm(true)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create New Team
          </button>

          {openTeamForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create Team</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Team Name"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={teamForm.description}
                    onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setOpenTeamForm(false)}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTeam}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {Array.isArray(team) ? (
  <>
    <h2 className="text-2xl font-semibold mb-4">All Teams</h2>
    <div className="overflow-x-auto mb-8">
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">Team Name</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Members Count</th>
          </tr>
        </thead>
        <tbody>
          {team.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{t.name}</td>
              <td className="px-4 py-2 border-b">{t.description || 'No description'}</td>
              <td className="px-4 py-2 border-b">{t.members?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
) : team ? (
  <>
    <h2 className="text-2xl font-semibold mb-4">{team.name}</h2>
    <p className="text-gray-600 mb-6">{team.description || 'No description'}</p>

    <h3 className="text-xl font-semibold mb-4">Team Members</h3>
    <div className="overflow-x-auto mb-8">
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          {team?.members?.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{member.name}</td>
              <td className="px-4 py-2 border-b">{member.email}</td>
              <td className="px-4 py-2 border-b">{member.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
) : null}


      <h3 className="text-xl font-semibold mb-4">Activity Logs</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">User</th>
              <th className="px-4 py-2 border-b">Action</th>
              <th className="px-4 py-2 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs?.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{log.userName}</td>
                <td className="px-4 py-2 border-b">{log.action}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}