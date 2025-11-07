import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const EVENT_TYPES = ['Cultural', 'Performance'];

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [days, setDays] = useState([]);
  const [venues, setVenues] = useState([]);
  const [performers, setPerformers] = useState([]);
  
  const [createForm, setCreateForm] = useState({
    Event_Name: '',
    Event_Type: EVENT_TYPES[0],
    Prize_Money: '',
    Max_Participants: '',
    DayID: '',
    VenueID: '',
    Performer_ID: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const { admin: user } = useAuth();

  const findNameById = (array, id, idKey, nameKey) => {
    const item = array.find(i => i[idKey] === id);
    return item ? item[nameKey] : 'N/A';
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [eventsRes, daysRes, venuesRes, performersRes] = await Promise.all([
        apiClient.get('/events'),
        apiClient.get('/days'),
        apiClient.get('/venues'),
        apiClient.get('/performers'),
      ]);
      
      setEvents(eventsRes.data);
      setDays(daysRes.data);
      setVenues(venuesRes.data);
      setPerformers(performersRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data. Please refresh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...createForm,
      Prize_Money: createForm.Prize_Money || null,
      Max_Participants: createForm.Max_Participants || null,
      DayID: createForm.DayID || null,
      VenueID: createForm.VenueID || null,
      Performer_ID: createForm.Performer_ID || null,
    };
    
    try {
      await apiClient.post('/events', dataToSend);
      setCreateForm({
        Event_Name: '', Event_Type: EVENT_TYPES[0], Prize_Money: '', Max_Participants: '', DayID: '', VenueID: '', Performer_ID: '',
      });
      fetchAllData();
    } catch (err) {
      setError('Failed to create event.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent({
      ...event,
      Prize_Money: event.Prize_Money || '',
      Max_Participants: event.Max_Participants || '',
      DayID: event.DayID || '',
      VenueID: event.VenueID || '',
      Performer_ID: event.Performer_ID || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    const dataToSend = {
      ...editingEvent,
      Prize_Money: editingEvent.Prize_Money || null,
      Max_Participants: editingEvent.Max_Participants || null,
      DayID: editingEvent.DayID || null,
      VenueID: editingEvent.VenueID || null,
      Performer_ID: editingEvent.Performer_ID || null,
    };
    try {
      await apiClient.put(`/events/${editingEvent.Event_ID}`, dataToSend);
      handleCloseModal();
      fetchAllData();
    } catch (err) {
      setError('Failed to update event.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/events/${eventId}`);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete event. It might be referenced by other records (e.g., Registrations).');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
      
      {/* --- CREATE Event Form --- */}
      {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
        <form onSubmit={handleCreateEvent} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text" name="Event_Name" placeholder="Event Name *"
              value={createForm.Event_Name} onChange={handleCreateFormChange}
              required className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              name="Event_Type" value={createForm.Event_Type} onChange={handleCreateFormChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <input
              type="number" name="Prize_Money" placeholder="Prize Money"
              value={createForm.Prize_Money} onChange={handleCreateFormChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number" name="Max_Participants" placeholder="Max Participants"
              value={createForm.Max_Participants} onChange={handleCreateFormChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              name="DayID" value={createForm.DayID} onChange={handleCreateFormChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Day (Optional)</option>
              {days.map(day => <option key={day.DayID} value={day.DayID}>Day {day.DayNumber} ({day.Description})</option>)}
            </select>
            <select
              name="VenueID" value={createForm.VenueID} onChange={handleCreateFormChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Venue (Optional)</option>
              {venues.map(venue => <option key={venue.VenueID} value={venue.VenueID}>{venue.VenueName}</option>)}
            </select>
            <select
              name="Performer_ID" value={createForm.Performer_ID} onChange={handleCreateFormChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Performer (Optional)</option>
              {performers.map(p => <option key={p.Performer_ID} value={p.Performer_ID}>{p.Name} ({p.Performer_Type})</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      )}

      {/* --- READ Events Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performer</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
            ) : (
              events.map((event) => (
                <tr key={event.Event_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.Event_Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.Event_Type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{`Day ${findNameById(days, event.DayID, 'DayID', 'DayNumber')}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{findNameById(venues, event.VenueID, 'VenueID', 'VenueName')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{findNameById(performers, event.Performer_ID, 'Performer_ID', 'Name')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/events/${event.Event_ID}/registrations`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Registrations
                    </Link>
                    <Link
                      to={`/admin/events/${event.Event_ID}/sponsorships`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Sponsors
                    </Link>
                    <Link
                      to={`/admin/events/${event.Event_ID}/teams`}
                      className="text-purple-600 hover:text-purple-900 mr-4"
                    >
                      Teams
                    </Link>
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(event)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteEvent(event.Event_ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* --- UPDATE Event Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Event"
      >
        {editingEvent && (
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <input
              type="text" name="Event_Name" placeholder="Event Name *"
              value={editingEvent.Event_Name} onChange={handleEditFormChange}
              required className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              name="Event_Type" value={editingEvent.Event_Type} onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <input
              type="number" name="Prize_Money" placeholder="Prize Money"
              value={editingEvent.Prize_Money} onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {/* --- THIS IS THE FIX --- */}
            <input
              type="number" name="Max_Participants" placeholder="Max Participants"
              value={editingEvent.Max_Participants} onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {/* --- THE <input> TAG IS NOW SELF-CLOSED --- */}
            
            <select
              name="DayID" value={editingEvent.DayID} onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Day (Optional)</option>
              {days.map(day => <option key={day.DayID} value={day.DayID}>Day {day.DayNumber} ({day.Description})</option>)}
            </select>
            <select
              name="VenueID" value={editingEvent.VenueID} onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Venue (Optional)</option>
              {venues.map(venue => <option key={venue.VenueID} value={venue.VenueID}>{venue.VenueName}</option>)}
            </select>
            <select
              name="Performer_ID" value={editingEvent.Performer_ID} onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Performer (Optional)</option>
              {performers.map(p => <option key={p.Performer_ID} value={p.Performer_ID}>{p.Name} ({p.Performer_Type})</option>)}
            </select>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;