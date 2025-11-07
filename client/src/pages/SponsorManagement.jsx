import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const SponsorManagement = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the CREATE form
  const [sponsorName, setSponsorName] = useState('');
  const [amount, setAmount] = useState('');
  const [sponsorType, setSponsorType] = useState('');
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  
  const { admin: user } = useAuth();

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/sponsors');
      setSponsors(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch sponsors.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleCreateSponsor = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/sponsors', {
        Sponsor_Name: sponsorName,
        Amount: amount,
        Sponsor_Type: sponsorType || null,
      });
      setSponsorName('');
      setAmount('');
      setSponsorType('');
      fetchSponsors();
    } catch (err) {
      setError('Failed to create sponsor.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (sponsor) => {
    setEditingSponsor(sponsor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSponsor(null);
  };

  const handleUpdateSponsor = async (e) => {
    e.preventDefault();
    if (!editingSponsor) return;
    try {
      await apiClient.put(`/sponsors/${editingSponsor.Sponsor_ID}`, {
        Sponsor_Name: editingSponsor.Sponsor_Name,
        Amount: editingSponsor.Amount,
        Sponsor_Type: editingSponsor.Sponsor_Type || null,
      });
      handleCloseModal();
      fetchSponsors();
    } catch (err) {
      setError('Failed to update sponsor.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingSponsor(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteSponsor = async (sponsorId) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        await apiClient.delete(`/sponsors/${sponsorId}`);
        fetchSponsors();
      } catch (err) {
        setError('Failed to delete sponsor.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Sponsor Management</h1>
      
      {/* --- CREATE Sponsor Form --- */}
      {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
        <form onSubmit={handleCreateSponsor} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Sponsor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Sponsor Name *"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Amount (e.g., 50000) *"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Sponsor Type (e.g., Title, Gold)"
              value={sponsorType}
              onChange={(e) => setSponsorType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Sponsor
          </button>
        </form>
      )}

      {/* --- READ Sponsors Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
            ) : (
              sponsors.map((sponsor) => (
                <tr key={sponsor.Sponsor_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{sponsor.Sponsor_Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{parseFloat(sponsor.Amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sponsor.Sponsor_Type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(sponsor)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteSponsor(sponsor.Sponsor_ID)}
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

      {/* --- UPDATE Sponsor Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Sponsor"
      >
        {editingSponsor && (
          <form onSubmit={handleUpdateSponsor}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sponsor Name *</label>
                <input
                  type="text"
                  name="Sponsor_Name"
                  value={editingSponsor.Sponsor_Name}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount *</label>
                <input
                  type="number"
                  name="Amount"
                  value={editingSponsor.Amount}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sponsor Type</label>
                <input
                  type="text"
                  name="Sponsor_Type"
                  value={editingSponsor.Sponsor_Type}
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

export default SponsorManagement;