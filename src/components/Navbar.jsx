import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div className="font-bold text-lg">Team App</div>
      {isAuthenticated && (
        <ul className="flex space-x-4">
          <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
          <li><Link to="/projects" className="hover:underline">Projects</Link></li>
          <li><Link to="/team" className="hover:underline">Team</Link></li>
          <li><Link to="/kanban/demo-project-id" className="hover:underline">Kanban</Link></li>
        </ul>
      )}
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link to="/" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
