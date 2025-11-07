import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const EventTeamManagement = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Add Team" form
  const [teamIdToAdd, setTeamIdToAdd] = useState('');

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const [eventRes, assignRes, allTeamsRes] = await Promise.all([
        apiClient.get(`/events/${eventId}`),
        apiClient.get(`/management/event/${eventId}`),
        apiClient.get('/teams'),
      ]);
      
      setEvent(eventRes.data);
      setAssignments(assignRes.data);
      setAllTeams(allTeamsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [eventId]);

  const getTeamName = (teamId) => {
    const t = allTeams.find(t => t.Team_ID === teamId);
    return t ? t.Team_Name : 'Unknown Team';
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!teamIdToAdd) {
      alert('Please select a team.');
      return;
    }
    
    try {
      await apiClient.post('/management', {
        Event_ID: eventId,
        Team_ID: teamIdToAdd,
      });
      setTeamIdToAdd('');
      fetchPageData(); // Refresh the list
    } catch (err) {
      if (err.response && err.response.data.message.includes('ER_DUP_ENTRY')) {
        setError('This team is already assigned to this event.');
      } else {
        setError('Failed to assign team.');
      }
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (managementId) => {
    if (window.confirm('Are you sure you want to remove this team from the event?')) {
      try {
        await apiClient.delete(`/management/${managementId}`);
        fetchPageData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete assignment.');
        console.error(err);
      }
    }
  };

  // Filter out teams that are already assigned
  const availableTeams = allTeams.filter(t => 
    !assignments.some(a => a.Team_ID === t.Team_ID)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <Link to="/admin/events" className="text-blue-600 hover:underline mb-4 block">
        &larr; Back to All Events
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Manage Event Teams</h1>
      <h2 className="text-2xl text-gray-700">{event?.Event_Name}</h2>
      
      {/* --- Add Team Form --- */}
      <form onSubmit={handleAddAssignment} className="mt-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Assign Team to Event</h3>
        <div className="flex space-x-4">
          <select
            value={teamIdToAdd}
            onChange={(e) => setTeamIdToAdd(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select a Team --</option>
            {availableTeams.length > 0 ? (
              availableTeams.map(t => (
                <option key={t.Team_ID} value={t.Team_ID}>
                  {t.Team_Name}
                </option>
              ))
            ) : (
              <option disabled>All teams are assigned</option>
            )}
          </select>
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Assign Team
          </button>
        </div>
      </form>

      {/* --- READ Linked Teams Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Team</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.length === 0 ? (
              <tr><td colSpan="2" className="text-center py-4">No teams assigned to this event.</td></tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.Management_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{getTeamName(a.Team_ID)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteAssignment(a.Management_ID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTeamManagement;