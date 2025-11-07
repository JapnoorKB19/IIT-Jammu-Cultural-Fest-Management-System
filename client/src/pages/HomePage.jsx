import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient'; // We can use apiClient for public routes too

const EventCard = ({ event, day, venue, performer }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      {/* We can add an event image here later */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{event.Event_Name}</h3>
        <p className="text-sm font-semibold text-blue-600 mb-4">{event.Event_Type}</p>
        
        <div className="space-y-2 text-gray-700">
          {day && <p><strong>Day:</strong> Day {day.DayNumber} ({new Date(day.EventDate).toLocaleDateString('en-IN')})</p>}
          {venue && <p><strong>Where:</strong> {venue.VenueName}</p>}
          {performer && <p><strong>Who:</strong> {performer.Name}</p>}
        </div>

        {/* We will make this link work in the next step */}
        <Link 
          to={`/events/${event.Event_ID}`} 
          className="inline-block mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const [venues, setVenues] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const findNameById = (array, id, idKey) => {
    return array.find(i => i[idKey] === id);
  };

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const [eventsRes, daysRes, venuesRes, performersRes] = await Promise.all([
          apiClient.get('/events'),
          apiClient.get('/days'),
          apiClient.get('/venues'),
          apiClient.get('/performers'),
        ]);
        
        setEvents(eventsRes.data);
        setDays(daysRes.data);
        setVenues(venuesRes.data);
        setPerformers(performersRes.data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
        Welcome to IIT Jammu Fest
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Check out our amazing lineup of events!
      </p>

      {loading && <p className="text-center">Loading events...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && events.map(event => (
          <EventCard 
            key={event.Event_ID}
            event={event}
            day={findNameById(days, event.DayID, 'DayID')}
            venue={findNameById(venues, event.VenueID, 'VenueID')}
            performer={findNameById(performers, event.Performer_ID, 'Performer_ID')}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;