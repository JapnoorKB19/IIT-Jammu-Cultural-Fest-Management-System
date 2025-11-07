import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import apiClient from '../api/apiClient';

// A simple component for our stat "widgets"
const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-lg text-gray-700">
        Welcome to the central management hub for the IIT Jammu Fest.
      </p>

      {/* --- ADD THIS BUTTON --- */}
      <div className="mt-6">
        <Link
          to="/admin/venues"
          className="inline-block px-5 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add / Manage Venues
        </Link>
        {/* We can add more shortcut buttons here */}
      </div>
      {/* --- END OF BUTTON --- */}


      {/* Stats Widgets */}
      {stats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Events" value={stats.totalEvents} />
          <StatCard title="Total Participants" value={stats.totalParticipants} />
          <StatCard title="Total Sponsors" value={stats.totalSponsors} />
          <StatCard 
            title="Total Sponsorship" 
            value={`₹${parseFloat(stats.totalRevenue).toLocaleString()}`} 
          />
          <StatCard 
            title="Total Budget" 
            value={`₹${parseFloat(stats.totalBudget).toLocaleString()}`} 
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;