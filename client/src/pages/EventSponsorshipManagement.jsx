import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const EventSponsorshipManagement = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [sponsorships, setSponsorships] = useState([]);
  const [allSponsors, setAllSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Add Sponsor" form
  const [sponsorIdToAdd, setSponsorIdToAdd] = useState('');
  const [contribution, setContribution] = useState('');

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const [eventRes, sponsorLinkRes, allSponsorsRes] = await Promise.all([
        apiClient.get(`/events/${eventId}`),
        apiClient.get(`/sponsorships/event/${eventId}`),
        apiClient.get('/sponsors'),
      ]);
      
      setEvent(eventRes.data);
      setSponsorships(sponsorLinkRes.data);
      setAllSponsors(allSponsorsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [eventId]);

  const getSponsorName = (sponsorId) => {
    const s = allSponsors.find(s => s.Sponsor_ID === sponsorId);
    return s ? s.Sponsor_Name : 'Unknown Sponsor';
  };

  const handleAddSponsorship = async (e) => {
    e.preventDefault();
    if (!sponsorIdToAdd) {
      alert('Please select a sponsor.');
      return;
    }
    
    try {
      await apiClient.post('/sponsorships', {
        Event_ID: eventId,
        Sponsor_ID: sponsorIdToAdd,
        Contribution_Amount: contribution || null,
      });
      setSponsorIdToAdd('');
      setContribution('');
      fetchPageData(); // Refresh the list
    } catch (err) {
      if (err.response && err.response.data.message.includes('ER_DUP_ENTRY')) {
        setError('This sponsor is already linked to this event.');
      } else {
        setError('Failed to add sponsor.');
      }
      console.error(err);
    }
  };

  const handleDeleteSponsorship = async (sponsorshipId) => {
    if (window.confirm('Are you sure you want to remove this sponsor from the event?')) {
      try {
        await apiClient.delete(`/sponsorships/${sponsorshipId}`);
        fetchPageData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete sponsorship.');
        console.error(err);
      }
    }
  };

  // Filter out sponsors who are already linked to this event
  const availableSponsors = allSponsors.filter(s => 
    !sponsorships.some(sp => sp.Sponsor_ID === s.Sponsor_ID)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <Link to="/admin/events" className="text-blue-600 hover:underline mb-4 block">
        &larr; Back to All Events
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Manage Sponsors</h1>
      <h2 className="text-2xl text-gray-700">{event?.Event_Name}</h2>
      
      {/* --- Add Sponsor Form --- */}
      <form onSubmit={handleAddSponsorship} className="mt-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Link Sponsor to Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={sponsorIdToAdd}
            onChange={(e) => setSponsorIdToAdd(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select a Sponsor --</option>
            {availableSponsors.length > 0 ? (
              availableSponsors.map(s => (
                <option key={s.Sponsor_ID} value={s.Sponsor_ID}>
                  {s.Sponsor_Name}
                </option>
              ))
            ) : (
              <option disabled>All sponsors are linked</option>
            )}
          </select>
          <input
            type="number"
            placeholder="Contribution Amount (Optional)"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Link Sponsor
        </button>
      </form>

      {/* --- READ Linked Sponsors Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contribution Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sponsorships.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-4">No sponsors linked to this event.</td></tr>
            ) : (
              sponsorships.map((sp) => (
                <tr key={sp.Sponsorship_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{getSponsorName(sp.Sponsor_ID)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sp.Contribution_Amount ? `₹${parseFloat(sp.Contribution_Amount).toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteSponsorship(sp.Sponsorship_ID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventSponsorshipManagement;