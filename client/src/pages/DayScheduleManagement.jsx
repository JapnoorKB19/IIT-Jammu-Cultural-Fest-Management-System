import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const DayScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the CREATE form
  const [dayNumber, setDayNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  const { admin: user } = useAuth();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/days');
      setSchedules(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch day schedules.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/days', {
        DayNumber: dayNumber,
        EventDate: eventDate || null,
        Description: description || null,
      });
      setDayNumber('');
      setEventDate('');
      setDescription('');
      fetchSchedules();
    } catch (err) {
      setError('Failed to create schedule.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (schedule) => {
    // Format the date correctly for the HTML date input (YYYY-MM-DD)
    const formattedSchedule = {
      ...schedule,
      EventDate: schedule.EventDate ? new Date(schedule.EventDate).toISOString().split('T')[0] : '',
    };
    setEditingSchedule(formattedSchedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!editingSchedule) return;
    try {
      await apiClient.put(`/days/${editingSchedule.DayID}`, {
        DayNumber: editingSchedule.DayNumber,
        EventDate: editingSchedule.EventDate || null,
        Description: editingSchedule.Description || null,
      });
      handleCloseModal();
      fetchSchedules();
    } catch (err) {
      setError('Failed to update schedule.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteSchedule = async (dayId) => {
    if (window.confirm('Are you sure you want to delete this schedule day?')) {
      try {
        await apiClient.delete(`/days/${dayId}`);
        fetchSchedules();
      } catch (err) {
        setError('Failed to delete schedule.');
        console.error(err);
      }
    }
  };
  
  // Helper to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Day Schedule Management</h1>
      
      {/* --- CREATE Schedule Form --- */}
      {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
        <form onSubmit={handleCreateSchedule} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Day</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Day Number (e.g., 1) *"
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Description (e.g., Cultural Night)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Day
          </button>
        </form>
      )}

      {/* --- READ Schedules Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
            ) : (
              schedules.map((day) => (
                <tr key={day.DayID}>
                  <td className="px-6 py-4 whitespace-nowrap">Day {day.DayNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDateForDisplay(day.EventDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{day.Description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(day)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteSchedule(day.DayID)}
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

      {/* --- UPDATE Schedule Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Schedule Day"
      >
        {editingSchedule && (
          <form onSubmit={handleUpdateSchedule}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Day Number *</label>
                <input
                  type="number"
                  name="DayNumber"
                  value={editingSchedule.DayNumber}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="EventDate"
                  value={editingSchedule.EventDate}
                  onChange={handleEditFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="Description"
                  value={editingSchedule.Description}
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

export default DayScheduleManagement;