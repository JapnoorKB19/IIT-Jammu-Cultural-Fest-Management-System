import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Admin State
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  // 2. Participant State
  const [participant, setParticipant] = useState(() => {
    const storedParticipant = localStorage.getItem('participantInfo');
    return storedParticipant ? JSON.parse(storedParticipant) : null;
  });

  // --- Admin Functions ---
  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminInfo');
  };

  // --- Participant Functions ---
  const loginParticipant = (participantData) => {
    setParticipant(participantData);
    localStorage.setItem('participantInfo', JSON.stringify(participantData));
  };

  const logoutParticipant = () => {
    setParticipant(null);
    localStorage.removeItem('participantInfo');
  };

  // 3. Provide all values
  const value = {
    admin,
    loginAdmin,
    logoutAdmin,
    participant,
    loginParticipant,
    logoutParticipant
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// The useAuth hook now returns all 6 items
export const useAuth = () => {
  return useContext(AuthContext);
};