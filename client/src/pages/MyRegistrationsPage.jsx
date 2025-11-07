import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]); // To store event details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { participant } = useAuth(); // Get the logged-in participant

  useEffect(() => {
    if (!participant) {
      // Don't fetch if user is somehow null
      setLoading(false);
      return;
    }

    const fetchMyData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch both the user's registrations AND the list of all events
        const [regRes, eventsRes] = await Promise.all([
          apiClient.get(`/registrations/participant/${participant.Participant_ID}`),
          apiClient.get('/events')
        ]);
        
        setRegistrations(regRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        setError('Failed to load your registrations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [participant]); // Re-run if the participant object changes

  // Helper function to find the full event details from an Event_ID
  const getEventDetails = (eventId) => {
    return events.find(event => event.Event_ID === eventId);
  };

  if (loading) {
    return <div className="text-center p-12">Loading your registrations...</div>;
  }

  if (error) {
    return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Registrations</h1>

      {registrations.length === 0 ? (
        <p className="text-lg text-gray-600">
          You are not registered for any events yet. <Link to="/" className="text-blue-600 hover:underline">Browse events</Link>.
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((reg) => {
                const event = getEventDetails(reg.Event_ID);
                if (!event) return null; // In case event data is missing

                return (
                  <tr key={reg.Registration_ID}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.Event_Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.Event_Type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(reg.Registration_Date).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/events/${event.Event_ID}`} className="text-blue-600 hover:text-blue-900">
                        View Event
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;