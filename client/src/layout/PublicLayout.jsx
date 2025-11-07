import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar we just made

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {/* All public pages will render here */}
        <Outlet />
      </main>
      {/* We can add a global Footer component here later */}
    </div>
  );
};

export default PublicLayout;