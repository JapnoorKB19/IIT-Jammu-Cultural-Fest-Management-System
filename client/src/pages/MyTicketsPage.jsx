import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]); // To store event details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { participant } = useAuth();

  useEffect(() => {
    if (!participant) {
      setLoading(false);
      return;
    }

    const fetchMyData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [ticketRes, eventsRes] = await Promise.all([
          apiClient.get(`/tickets/participant/${participant.Participant_ID}`),
          apiClient.get('/events')
        ]);
        
        setTickets(ticketRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        setError('Failed to load your tickets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [participant]);

  const getEventDetails = (eventId) => {
    return events.find(event => event.Event_ID === eventId);
  };

  if (loading) {
    return <div className="text-center p-12">Loading your tickets...</div>;
  }

  if (error) {
    return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Tickets</h1>

      {tickets.length === 0 ? (
        <p className="text-lg text-gray-600">
          You do not have any tickets yet. <Link to="/" className="text-blue-600 hover:underline">Browse events</Link> to register.
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchased On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => {
                const event = getEventDetails(ticket.Event_ID);
                if (!event) return null;

                return (
                  <tr key={ticket.Ticket_ID}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.Event_Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket.Ticket_ID}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket.Quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(ticket.Purchase_Date).toLocaleDateString('en-IN')}</td>
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

export default MyTicketsPage;