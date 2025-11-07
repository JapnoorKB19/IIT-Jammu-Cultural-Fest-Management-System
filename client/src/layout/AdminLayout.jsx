import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { admin, logoutAdmin } = useAuth(); // We use 'admin' now
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            
            <li className="mt-4 mb-1 text-xs uppercase text-gray-400">Festival</li>
            <li className="mb-2">
              <Link to="/admin/events" className="block px-4 py-2 rounded hover:bg-gray-700">
                Events
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/schedule" className="block px-4 py-2 rounded hover:bg-gray-700">
                Schedule
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/venues" className="block px-4 py-2 rounded hover:bg-gray-700">
                Venues
              </Link>
            </li>
            
            <li className="mt-4 mb-1 text-xs uppercase text-gray-400">People</li>
            <li className="mb-2">
              <Link to="/admin/participants" className="block px-4 py-2 rounded hover:bg-gray-700">
                Participants
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/performers" className="block px-4 py-2 rounded hover:bg-gray-700">
                Performers
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/sponsors" className="block px-4 py-2 rounded hover:bg-gray-700">
                Sponsors
              </Link>
            </li>

            <li className="mt-4 mb-1 text-xs uppercase text-gray-400">Management</li>
            <li className="mb-2">
              <Link to="/admin/teams" className="block px-4 py-2 rounded hover:bg-gray-700">
                Teams
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/members" className="block px-4 py-2 rounded hover:bg-gray-700">
                Members
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/budget" className="block px-4 py-2 rounded hover:bg-gray-700">
                Budget
              </Link>
            </li>
            
            {/* --- THIS IS THE NEW LINK (SuperAdmin only) --- */}
            {admin?.Role === 'SuperAdmin' && (
              <li className="mb-2 border-t border-gray-700 mt-2 pt-2">
                <Link to="/admin/members/register" className="block px-4 py-2 rounded text-yellow-400 hover:bg-gray-700">
                  Register New Member
                </Link>
              </li>
            )}
            {/* --- END OF NEW LINK --- */}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="font-bold text-xl text-blue-600">IIT Jammu Fest</span>
              </div>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {admin?.Name || 'Admin'} ({admin?.Role})</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;