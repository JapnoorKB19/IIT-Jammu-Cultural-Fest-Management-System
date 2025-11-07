import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

// This is the fixed list of types from your database ENUM 
const PERFORMER_TYPES = ['Singer', 'DJ', 'Standup', 'Band'];

const PerformerManagement = () => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the CREATE form
  const [name, setName] = useState('');
  const [performerType, setPerformerType] = useState(PERFORMER_TYPES[0]); // Default to 'Singer'
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerformer, setEditingPerformer] = useState(null);
  
  const { admin: user } = useAuth();

  const fetchPerformers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/performers');
      setPerformers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch performers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformers();
  }, []);

  const handleCreatePerformer = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/performers', {
        Name: name,
        Performer_Type: performerType,
      });
      setName('');
      setPerformerType(PERFORMER_TYPES[0]);
      fetchPerformers();
    } catch (err) {
      setError('Failed to create performer.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (performer) => {
    setEditingPerformer(performer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerformer(null);
  };

  const handleUpdatePerformer = async (e) => {
    e.preventDefault();
    if (!editingPerformer) return;
    try {
      await apiClient.put(`/performers/${editingPerformer.Performer_ID}`, {
        Name: editingPerformer.Name,
        Performer_Type: editingPerformer.Performer_Type,
      });
      handleCloseModal();
      fetchPerformers();
    } catch (err) {
      setError('Failed to update performer.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingPerformer(prev => ({ ...prev, [name]: value }));
  };

  const handleDeletePerformer = async (performerId) => {
    if (window.confirm('Are you sure you want to delete this performer?')) {
      try {
        await apiClient.delete(`/performers/${performerId}`);
        fetchPerformers();
      } catch (err) {
        setError('Failed to delete performer.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Performer Management</h1>
      
      {/* --- CREATE Performer Form --- */}
      {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
        <form onSubmit={handleCreatePerformer} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Performer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Performer Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={performerType}
              onChange={(e) => setPerformerType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {PERFORMER_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Performer
          </button>
        </form>
      )}

      {/* --- READ Performers Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr>
            ) : (
              performers.map((performer) => (
                <tr key={performer.Performer_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{performer.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{performer.Performer_Type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(performer)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeletePerformer(performer.Performer_ID)}
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

      {/* --- UPDATE Performer Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Performer"
      >
        {editingPerformer && (
          <form onSubmit={handleUpdatePerformer}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Performer Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={editingPerformer.Name}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Performer Type</label>
                <select
                  name="Performer_Type"
                  value={editingPerformer.Performer_Type}
                  onChange={handleEditFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {PERFORMER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
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

export default PerformerManagement;