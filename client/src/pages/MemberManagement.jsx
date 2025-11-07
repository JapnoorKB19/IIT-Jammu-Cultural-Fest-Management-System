import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

// This is the fixed list of roles from your database ENUM
const ROLE_TYPES = ['Head', 'Co-head', 'SuperAdmin', 'Member'];

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const { admin: user } = useAuth();

  const findTeamName = (teamId) => {
    if (!teamId) return 'N/A';
    const team = teams.find(t => t.Team_ID === teamId);
    return team ? team.Team_Name : 'Invalid Team';
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [membersRes, teamsRes] = await Promise.all([
        apiClient.get('/members'),
        apiClient.get('/teams'),
      ]);
      setMembers(membersRes.data);
      setTeams(teamsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenEditModal = (member) => {
    setEditingMember({
      ...member,
      Team_ID: member.Team_ID || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    
    if ((editingMember.Role === 'Head' || editingMember.Role === 'Co-head') && !editingMember.Team_ID) {
      alert('Team ID is required for Head and Co-head roles.');
      return;
    }
    
    const teamIdForDb = (editingMember.Role === 'SuperAdmin') ? null : editingMember.Team_ID;

    try {
      await apiClient.put(`/members/${editingMember.Student_ID}`, {
        Name: editingMember.Name,
        Role: editingMember.Role,
        Team_ID: teamIdForDb,
      });
      handleCloseModal();
      fetchAllData();
    } catch (err) {
      setError('Failed to update member.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingMember(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteMember = async (studentId) => {
    if (studentId === user.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this member? This is permanent.')) {
      try {
        await apiClient.delete(`/members/${studentId}`);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete member.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
      <p className="mt-2 text-gray-600">
        Note: SuperAdmin accounts cannot be edited or deleted from this panel.
      </p>

      {/* --- READ Members Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
            ) : (
              members.map((member) => (
                <tr key={member.Student_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{member.Student_ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.Role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{findTeamName(member.Team_ID)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    
                    {/* --- THIS IS THE FIX (EDIT BUTTON) --- 
                      Show 'Edit' if:
                      1. The viewer is an admin
                      2. AND the member in this row IS NOT a SuperAdmin
                    */}
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && member.Role !== 'SuperAdmin' && (
                      <button
                        onClick={() => handleOpenEditModal(member)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    
                    {/* --- THIS IS THE FIX (DELETE BUTTON) ---
                      Show 'Delete' if:
                      1. The viewer IS a SuperAdmin
                      2. AND the member in this row IS NOT a SuperAdmin
                    */}
                    {user?.Role === 'SuperAdmin' && member.Role !== 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteMember(member.Student_ID)}
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

      {/* --- UPDATE Member Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Member"
      >
        {editingMember && (
          <form onSubmit={handleUpdateMember}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  value={editingMember.Student_ID}
                  disabled
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={editingMember.Name}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <select
                  name="Role"
                  value={editingMember.Role}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {/* This is correct, we filter out SuperAdmin */}
                  {ROLE_TYPES.filter(r => r !== 'SuperAdmin').map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Team</label>
                <select
                  name="Team_ID"
                  value={editingMember.Team_ID}
                  onChange={handleEditFormChange}
                  disabled={editingMember.Role === 'SuperAdmin'}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Team (None)</option>
                  {teams.map(team => (
                    <option key={team.Team_ID} value={team.Team_ID}>
                      {team.Team_Name}
                    </option>
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

export default MemberManagement;