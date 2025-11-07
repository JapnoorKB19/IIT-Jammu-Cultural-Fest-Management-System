import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal'; // Import our new Modal

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the CREATE form
  const [venueName, setVenueName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  
  const { admin: user } = useAuth();

  // Function to fetch all venues
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/venues');
      setVenues(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch venues.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch venues when the component first loads
  useEffect(() => {
    fetchVenues();
  }, []);

  // Handle CREATE form submission
  const handleCreateVenue = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/venues', {
        VenueName: venueName,
        Capacity: capacity || null,
        Location: location || null,
      });
      setVenueName('');
      setCapacity('');
      setLocation('');
      fetchVenues();
    } catch (err) {
      setError('Failed to create venue.');
      console.error(err);
    }
  };

  // Handle opening the EDIT modal
  const handleOpenEditModal = (venue) => {
    setEditingVenue(venue);
    setIsModalOpen(true);
  };

  // Handle closing the EDIT modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVenue(null);
  };

  // Handle UPDATE form submission (inside the modal)
  const handleUpdateVenue = async (e) => {
    e.preventDefault();
    if (!editingVenue) return;

    try {
      await apiClient.put(`/venues/${editingVenue.VenueID}`, {
        VenueName: editingVenue.VenueName,
        Capacity: editingVenue.Capacity || null,
        Location: editingVenue.Location || null,
      });
      handleCloseModal();
      fetchVenues();
    } catch (err) {
      setError('Failed to update venue.');
      console.error(err);
    }
  };

  // Handle changes to the EDIT form inputs
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingVenue(prev => ({ ...prev, [name]: value }));
  };

  // Handle DELETING a venue
  const handleDeleteVenue = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await apiClient.delete(`/venues/${venueId}`);
        fetchVenues();
      } catch (err) {
        setError('Failed to delete venue.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
      
      {/* --- CREATE Venue Form --- */}
      {user?.Role === 'SuperAdmin' && (
        <form onSubmit={handleCreateVenue} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Venue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Venue Name *"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Venue
          </button>
        </form>
      )}

      {/* --- READ Venues Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
            ) : (
              venues.map((venue) => (
                <tr key={venue.VenueID}>
                  <td className="px-6 py-4 whitespace-nowrap">{venue.VenueName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{venue.Capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{venue.Location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* --- UPDATE Button --- */}
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(venue)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {/* --- DELETE Button --- */}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteVenue(venue.VenueID)}
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

      {/* --- UPDATE Venue Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Venue"
      >
        {editingVenue && (
          <form onSubmit={handleUpdateVenue}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue Name *</label>
                <input
                  type="text"
                  name="VenueName"
                  value={editingVenue.VenueName}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  name="Capacity"
                  value={editingVenue.Capacity}
                  onChange={handleEditFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="Location"
                  value={editingVenue.Location}
                  onChange={handleEditFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
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

export default VenueManagement;