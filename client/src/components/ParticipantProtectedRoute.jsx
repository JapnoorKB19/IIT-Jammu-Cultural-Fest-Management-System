import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ParticipantProtectedRoute = () => {
  const { participant } = useAuth(); // Check for the PARTICIPANT

  if (!participant) {
    // If no participant, send them to the participant login page
    return <Navigate to="/participant-login" replace />;
  }
  
  // If they are a participant, show the child page (e.g., My Registrations)
  return <Outlet />;
};

export default ParticipantProtectedRoute;