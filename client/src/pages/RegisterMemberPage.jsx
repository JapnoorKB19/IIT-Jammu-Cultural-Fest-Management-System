import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

// We will only allow SuperAdmin to create Head or Co-head roles
const ROLE_TYPES = ['Head', 'Co-head', 'Member'];

const RegisterMemberPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    Student_ID: '',
    Name: '',
    Password: '',
    ConfirmPassword: '',
    Role: ROLE_TYPES[0],
    Team_ID: '',
  });
  
  const navigate = useNavigate();

  // Fetch teams for the dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get('/teams');
        setTeams(data);
        if (data.length > 0) {
          // Set default team ID
          setFormData(prev => ({...prev, Team_ID: data[0].Team_ID}));
        }
      } catch (err) {
        setError('Failed to load teams.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.Team_ID) {
      setError('A team must be selected.');
      return;
    }

    try {
      await apiClient.post('/auth/member/register', {
        Student_ID: formData.Student_ID,
        Name: formData.Name,
        Role: formData.Role,
        Team_ID: formData.Team_ID,
        Password: formData.Password,
      });
      
      setSuccess(`Successfully registered new member: ${formData.Name}`);
      // Clear the form
      setFormData({
        Student_ID: '', Name: '', Password: '', ConfirmPassword: '',
        Role: ROLE_TYPES[0], Team_ID: teams.length > 0 ? teams[0].Team_ID : '',
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Register New Member</h1>
      <p className="mt-2 text-gray-600">
        Use this form to create new 'Head' or 'Co-head' accounts.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 p-6 max-w-lg bg-white shadow rounded-lg">
        <div className="space-y-4">
          <input
            type="text" name="Student_ID" placeholder="Student ID (e.g., 20BCE1001)"
            value={formData.Student_ID} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text" name="Name" placeholder="Full Name"
            value={formData.Name} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password" name="Password" placeholder="New Password"
            value={formData.Password} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password" name="ConfirmPassword" placeholder="Confirm New Password"
            value={formData.ConfirmPassword} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            name="Role" value={formData.Role} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {ROLE_TYPES.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <select
            name="Team_ID" value={formData.Team_ID} onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select a Team --</option>
            {loading ? (
              <option disabled>Loading teams...</option>
            ) : (
              teams.map(team => (
                <option key={team.Team_ID} value={team.Team_ID}>
                  {team.Team_Name}
                </option>
              ))
            )}
          </select>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-sm text-green-600">
            {success}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create New Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterMemberPage;