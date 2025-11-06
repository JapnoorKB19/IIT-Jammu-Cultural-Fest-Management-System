require('dotenv').config();
const express = require('express');
const cors = require('cors');

const venueRoutes = require('./routes/venueRoutes');
const dayScheduleRoutes = require('./routes/dayScheduleRoutes');
const performerRoutes = require('./routes/performerRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const participantRoutes = require('./routes/participantRoutes');
const teamRoutes = require('./routes/teamRoutes');
const budgetExpenseRoutes = require('./routes/budgetExpenseRoutes'); 
const studentMemberRoutes = require('./routes/studentMemberRoutes');
const eventRoutes = require('./routes/eventRoutes');

const eventRegistrationRoutes = require('./routes/eventRegistrationRoutes');
const eventManagementRoutes = require('./routes/eventManagementRoutes');
const eventSponsorshipRoutes = require('./routes/eventSponsorshipRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to the IIT Jammu Fest API!');
});

app.use('/api/venues', venueRoutes);
app.use('/api/days', dayScheduleRoutes);
app.use('/api/performers', performerRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/budget', budgetExpenseRoutes); 
app.use('/api/members', studentMemberRoutes);
app.use('/api/events', eventRoutes);

app.use('/api/registrations', eventRegistrationRoutes);
app.use('/api/management', eventManagementRoutes);
app.use('/api/sponsorships', eventSponsorshipRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});