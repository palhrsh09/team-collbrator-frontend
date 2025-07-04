import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  fetchTasks,
  fetchUsers,
  createTask,
  updateTask,
  clearError,
} from '../store/taskSlice';
import Loading from '../components/Loading';

export default function KanbanBoard() {
  const { projectId } = useParams();
  const  dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { tasks, users, loading, error } = useSelector((state) => state.tasks);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    assignedTo: '',
  });

  useEffect(() => {
    console.log("token",token,"user:",user,"projectId:",projectId)
    if (projectId && token) {
      dispatch(fetchTasks({ token, projectId }));
    }
    if (user?.teamId && token) {
      dispatch(fetchUsers({ token, teamId: user.teamId }));
    }
  }, [dispatch, projectId, user, token]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    dispatch(updateTask({ token, id: taskId, task: { status: newStatus } }));
  };

  const handleSubmit = () => {
    const task = { ...formData, projectId };
    dispatch(createTask({ token, task }));
    setShowModal(false);
    setFormData({ title: '', description: '', status: 'todo', assignedTo: '' });
  };

  if (loading) return <Loading size="md" color="blue" />;

  const safeTasks = Array.isArray(tasks) ? tasks : [];

const columns = {
  todo: safeTasks.filter((task) => task.status === 'todo'),
  'in-progress': safeTasks.filter((task) => task.status === 'in-progress'),
  done: safeTasks.filter((task) => task.status === 'done'),
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user?.role === 'ADMIN' && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Create Task
          </button>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create Task</h2>

                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded mb-3"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded mb-3"
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border px-3 py-2 rounded mb-3"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full border px-3 py-2 rounded mb-4"
                >
                  <option value="">Assign To</option>
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {['todo', 'in-progress', 'done'].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="p-4 bg-gray-100 rounded-lg min-h-[300px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="text-xl font-semibold mb-4 capitalize">{status}</h2>
                  {columns[status].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className="p-4 mb-2 bg-white rounded shadow"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description || '-'}</p>
                          <p className="text-sm">
                            Assigned:{' '}
                            {users?.find((u) => u.id === task.assignedTo)?.name || 'Unassigned'}
                          </p>
                          {(user?.role === 'ADMIN' || task.assignedTo === user?.id) && (
                            <button
                              onClick={() =>
                                dispatch(
                                  updateTask({
                                    token,
                                    id: task.id,
                                    task: { status: task.status },
                                  })
                                )
                              }
                              className="mt-2 text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                              disabled={loading}
                            >
                              Update
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
