import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const EventRegistrationManagement = () => {
  const { eventId } = useParams(); // Get the eventId from the URL
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Add Participant" form
  const [participantIdToAdd, setParticipantIdToAdd] = useState('');

  const fetchPageData = async () => {
    try {
      setLoading(true);
      
      // Fetch all 3 data sources in parallel
      const [eventRes, regRes, participantsRes] = await Promise.all([
        apiClient.get(`/events/${eventId}`),
        apiClient.get(`/registrations/event/${eventId}`),
        apiClient.get('/participants'), // Get all participants for the dropdown
      ]);
      
      setEvent(eventRes.data);
      setRegistrations(regRes.data);
      setAllParticipants(participantsRes.data);
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
  }, [eventId]); // Re-fetch if the eventId in the URL changes

  // Helper to map participant ID to name
  const getParticipantName = (participantId) => {
    const p = allParticipants.find(p => p.Participant_ID === participantId);
    return p ? p.Name : 'Unknown Participant';
  };

  const handleAddRegistration = async (e) => {
    e.preventDefault();
    if (!participantIdToAdd) {
      alert('Please select a participant.');
      return;
    }
    
    try {
      await apiClient.post('/registrations', {
        Event_ID: eventId,
        Participant_ID: participantIdToAdd,
      });
      setParticipantIdToAdd(''); // Reset form
      fetchPageData(); // Refresh the list
    } catch (err) {
      if (err.response && err.response.data.message.includes('ER_DUP_ENTRY')) {
        setError('This participant is already registered for this event.');
      } else {
        setError('Failed to add registration.');
      }
      console.error(err);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to remove this participant from the event?')) {
      try {
        await apiClient.delete(`/registrations/${registrationId}`);
        fetchPageData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete registration.');
        console.error(err);
      }
    }
  };

  // Filter out participants who are already registered
  const availableParticipants = allParticipants.filter(p => 
    !registrations.some(r => r.Participant_ID === p.Participant_ID)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <Link to="/admin/events" className="text-blue-600 hover:underline mb-4 block">
        &larr; Back to All Events
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Manage Registrations</h1>
      <h2 className="text-2xl text-gray-700">{event?.Event_Name}</h2>
      
      {/* --- Add Participant Form --- */}
      <form onSubmit={handleAddRegistration} className="mt-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add Participant to Event</h3>
        <div className="flex space-x-4">
          <select
            value={participantIdToAdd}
            onChange={(e) => setParticipantIdToAdd(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select a Participant --</option>
            {availableParticipants.length > 0 ? (
              availableParticipants.map(p => (
                <option key={p.Participant_ID} value={p.Participant_ID}>
                  {p.Name} ({p.Email})
                </option>
              ))
            ) : (
              <option disabled>All participants are registered</option>
            )}
          </select>
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* --- READ Registrations Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-4">No participants registered yet.</td></tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.Registration_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{getParticipantName(reg.Participant_ID)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(reg.Registration_Date).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteRegistration(reg.Registration_ID)}
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

export default EventRegistrationManagement;