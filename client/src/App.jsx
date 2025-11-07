import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Layouts
import PublicLayout from './layout/PublicLayout';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ParticipantProtectedRoute from './components/ParticipantProtectedRoute';

// Import Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EventDetailPage from './pages/EventDetailPage';
import RegisterPage from './pages/RegisterPage';
import ParticipantLoginPage from './pages/ParticipantLoginPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import MyTicketsPage from './pages/MyTicketsPage';

// Import Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import VenueManagement from './pages/VenueManagement';
import PerformerManagement from './pages/PerformerManagement';
import SponsorManagement from './pages/SponsorManagement';
import DayScheduleManagement from './pages/DayScheduleManagement';
import EventManagement from './pages/EventManagement';
import TeamManagement from './pages/TeamManagement';
import MemberManagement from './pages/MemberManagement';
import BudgetManagement from './pages/BudgetManagement';
import ParticipantManagement from './pages/ParticipantManagement';
import EventRegistrationManagement from './pages/EventRegistrationManagement';
import EventSponsorshipManagement from './pages/EventSponsorshipManagement';
import EventTeamManagement from './pages/EventTeamManagement';
import RegisterMemberPage from './pages/RegisterMemberPage'; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: Public Pages (with public navbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} /> 
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/participant-login" element={<ParticipantLoginPage />} />

          {/* Participant Protected Routes */}
          <Route element={<ParticipantProtectedRoute />}>
            <Route path="/my-registrations" element={<MyRegistrationsPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} /> 
          </Route>
        </Route>

        {/* Route 2: Admin Login (no navbar) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route 3: Protected Admin Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="events/:eventId/registrations" element={<EventRegistrationManagement />} />
            <Route path="events/:eventId/sponsorships" element={<EventSponsorshipManagement />} />
            <Route path="events/:eventId/teams" element={<EventTeamManagement />} />
            <Route path="schedule" element={<DayScheduleManagement />} />
            <Route path="venues" element={<VenueManagement />} />
            <Route path="participants" element={<ParticipantManagement />} />
            <Route path="performers" element={<PerformerManagement />} />
            <Route path="sponsors" element={<SponsorManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="members" element={<MemberManagement />} />
            <Route path="members/register" element={<RegisterMemberPage />} />
            <Route path="budget" element={<BudgetManagement />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;