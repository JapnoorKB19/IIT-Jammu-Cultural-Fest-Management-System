import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the CREATE form
  const [teamName, setTeamName] = useState('');
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  
  const { admin: user } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/teams');
      setTeams(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch teams.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teams', { Team_Name: teamName });
      setTeamName('');
      fetchTeams();
    } catch (err) {
      setError('Failed to create team.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    try {
      await apiClient.put(`/teams/${editingTeam.Team_ID}`, {
        Team_Name: editingTeam.Team_Name,
      });
      handleCloseModal();
      fetchTeams();
    } catch (err) {
      setError('Failed to update team.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await apiClient.delete(`/teams/${teamId}`);
        fetchTeams();
      } catch (err) {
        setError('Failed to delete team. Make sure no members are assigned to it.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
      
      {/* --- CREATE Team Form --- */}
      {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
        <form onSubmit={handleCreateTeam} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Team Name (e.g., Marketing, Tech)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Team
          </button>
        </form>
      )}

      {/* --- READ Teams Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr>
            ) : (
              teams.map((team) => (
                <tr key={team.Team_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{team.Team_ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{team.Team_Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(team)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteTeam(team.Team_ID)}
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

      {/* --- UPDATE Team Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Team"
      >
        {editingTeam && (
          <form onSubmit={handleUpdateTeam}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name *</label>
                <input
                  type="text"
                  name="Team_Name" // This must match the state property
                  value={editingTeam.Team_Name}
                  onChange={handleEditFormChange}
                  required
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

export default TeamManagement;