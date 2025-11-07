import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const ParticipantManagement = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  
  const { admin: user } = useAuth();

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/participants');
      setParticipants(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch participants.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleOpenEditModal = (participant) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingParticipant(null);
  };

  const handleUpdateParticipant = async (e) => {
    e.preventDefault();
    if (!editingParticipant) return;
    try {
      await apiClient.put(`/participants/${editingParticipant.Participant_ID}`, {
        Name: editingParticipant.Name,
        Email: editingParticipant.Email,
        Phone: editingParticipant.Phone || null,
        College: editingParticipant.College || null,
      });
      handleCloseModal();
      fetchParticipants();
    } catch (err) {
      setError('Failed to update participant.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingParticipant(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteParticipant = async (participantId) => {
    if (window.confirm('Are you sure you want to delete this participant? This will also remove all their event registrations.')) {
      try {
        await apiClient.delete(`/participants/${participantId}`);
        fetchParticipants();
      } catch (err) {
        setError('Failed to delete participant. They may still be linked to tickets.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Participant Management</h1>
      <p className="mt-2 text-gray-600">
        Participants are created via the public registration page.
      </p>

      {/* --- READ Participants Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
            ) : (
              participants.map((participant) => (
                <tr key={participant.Participant_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.Phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.College}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(participant)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteParticipant(participant.Participant_ID)}
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

      {/* --- UPDATE Participant Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Participant"
      >
        {editingParticipant && (
          <form onSubmit={handleUpdateParticipant}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={editingParticipant.Name}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="Email"
                  value={editingParticipant.Email}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="Phone"
                  value={editingParticipant.Phone || ''}
                  onChange={handleEditFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">College</label>
                <input
                  type="text"
                  name="College"
                  value={editingParticipant.College || ''}
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

export default ParticipantManagement;