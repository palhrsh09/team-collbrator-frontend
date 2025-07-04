import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link for navigation
import {
  fetchProjects,
  fetchAllProjects,
  createProject,
  updateProject,
  deleteProject,
  clearError,
} from '../store/projectSlice';
import Loading from '../components/Loading';

export default function Projects() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  console.log("user",token)
  const { projects, loading, error } = useSelector((state) => state.projects);
  console.log("projects",projects)
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', teamId: '' });
  
  const api_url = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      fetch(`${api_url}/api/v1/team`, {
        credentials: 'include', 
      })
      .then((res) => res.json())
      .then((data) => setTeams(data.data || []));
    }
  }, [user, token]);

  useEffect(() => {
    if (user?.teamId && token && user.role !== 'ADMIN') {
      dispatch(fetchProjects({ token, teamId: user.teamId }));
    }else if(user.role === "ADMIN"){
      dispatch(fetchAllProjects({ token }));
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleSubmit = () => {
    const project = {
      name: formData.name,
      description: formData.description,
      teamId: user.role === 'ADMIN' ? formData.teamId : user.teamId,
    };

    if (editId) {
      dispatch(updateProject({ token, id: editId, project }));
    } else {
      dispatch(createProject({ token, project }));
    }

    setOpen(false);
    setEditId(null);
    setFormData({ name: '', description: '', teamId: '' });
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      teamId: project.teamId || '',
    });
    setOpen(true);
  };
  console.log("formdata",formData)
  const handleDelete = (id) => {
    dispatch(deleteProject({ token, id }));
  };

  if (loading) return <Loading size="md" color="blue" />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user?.role === 'ADMIN' && (
        <>
          <button
            onClick={() => {
              setEditId(null);
              setFormData({ name: '', description: '', teamId: '' });
              setOpen(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Project
          </button>

          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                  {editId ? 'Edit Project' : 'Create Project'}
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />

                  {user?.role === 'ADMIN' && (
                    <select
                      value={formData.teamId}
                      onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={loading}
                    >
                      {editId ? 'Update' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Actions</th> {/* Updated to always show Actions column */}
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr key={project?._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{project.name}</td>
                <td className="px-4 py-2 border-b">{project.description || '-'}</td>
                <td className="px-4 py-2 border-b">
                  {/* View Button for all users */}
                  <Link
                    to={`/kanban/${project?._id}`}
                    className="mr-2 px-3 py-1 border text-sm rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    View
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <>
                      <button
                        onClick={() => handleEdit(project)}
                        className="mr-2 px-3 py-1 border text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 border text-sm rounded bg-red-500 text-white hover:bg-red-600"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}