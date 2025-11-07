import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [day, setDay] = useState(null);
  const [venue, setVenue] = useState(null);
  const [performer, setPerformer] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { participant } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const { data: eventData } = await apiClient.get(`/events/${id}`);
        setEvent(eventData);

        const dataFetches = [];
        if (eventData.DayID) {
          dataFetches.push(apiClient.get(`/days/${eventData.DayID}`));
        } else {
          dataFetches.push(Promise.resolve(null));
        }
        if (eventData.VenueID) {
          dataFetches.push(apiClient.get(`/venues/${eventData.VenueID}`));
        } else {
          dataFetches.push(Promise.resolve(null));
        }
        if (eventData.Performer_ID) {
          dataFetches.push(apiClient.get(`/performers/${eventData.Performer_ID}`));
        } else {
          dataFetches.push(Promise.resolve(null));
        }
        const [dayRes, venueRes, performerRes] = await Promise.all(dataFetches);
        if (dayRes) setDay(dayRes.data);
        if (venueRes) setVenue(venueRes.data);
        if (performerRes) setPerformer(performerRes.data);
      } catch (err) {
        setError('Failed to load event details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleRegisterClick = async () => {
    if (!participant) {
      navigate('/participant-login');
      return;
    }
    
    try {
      // --- THIS IS THE NEW LOGIC ---
      // We will now make two API calls at the same time
      const registrationPromise = apiClient.post('/registrations', {
        Event_ID: id,
        Participant_ID: participant.Participant_ID
      });
      
      const ticketPromise = apiClient.post('/tickets', {
        Event_ID: id,
        Participant_ID: participant.Participant_ID,
        Quantity: 1 // As per our assumption
      });
      
      // Wait for both to complete
      await Promise.all([registrationPromise, ticketPromise]);
      // --- END OF NEW LOGIC ---
      
      alert('You have successfully registered and received your ticket!');
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message.toLowerCase().includes('already registered')) {
        alert('You are already registered for this event.');
      } else {
        alert('Registration failed. Please try again.');
      }
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center p-12">Loading event...</div>;
  }
  if (error) {
    return <div className="text-center p-12 text-red-500">{error}</div>;
  }
  if (!event) {
    return <div className="text-center p-12">Event not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Link to="/" className="text-blue-600 hover:underline mb-6 block">
        &larr; Back to All Events
      </Link>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{event.Event_Name}</h1>
          <span className="inline-block bg-blue-100 text-blue-800 text-lg font-semibold px-4 py-1 rounded-full mb-6">
            {event.Event_Type}
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-lg">
            {day && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong className="block text-gray-500">Day & Date</strong>
                <span className="text-gray-900">Day {day.DayNumber} ({new Date(day.EventDate).toLocaleDateString('en-IN')})</span>
              </div>
            )}
            {venue && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong className="block text-gray-500">Venue</strong>
                <span className="text-gray-900">{venue.VenueName} (Capacity: {venue.Capacity})</span>
              </div>
            )}
            {performer && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong className="block text-gray-500">Headliner</strong>
                <span className="text-gray-900">{performer.Name} ({performer.Performer_Type})</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Event Details</h2>
            <div className="space-y-3 text-gray-700">
              {event.Prize_Money > 0 && (
                <p><strong>Prize Money:</strong> ₹{parseFloat(event.Prize_Money).toLocaleString()}</p>
              )}
              {event.Max_Participants > 0 && (
                <p><strong>Max Participants:</strong> {event.Max_Participants}</p>
              )}
            </div>
            
            <div className="mt-10">
              <button 
                onClick={handleRegisterClick}
                className="px-8 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Register for this Event
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;