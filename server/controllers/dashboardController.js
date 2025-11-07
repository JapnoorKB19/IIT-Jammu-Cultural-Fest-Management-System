const pool = require('../config/db');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // We can run multiple queries at once
    const [eventRows] = await pool.query('SELECT COUNT(*) as totalEvents FROM Events');
    const [participantRows] = await pool.query('SELECT COUNT(*) as totalParticipants FROM Participants');
    const [sponsorRows] = await pool.query('SELECT COUNT(*) as totalSponsors FROM Sponsors');
    const [budgetRows] = await pool.query('SELECT SUM(Allocated_Amount) as totalBudget FROM Budget_Expenses');
    const [revenueRows] = await pool.query('SELECT SUM(Amount) as totalRevenue FROM Sponsors');

    const stats = {
      totalEvents: eventRows[0].totalEvents || 0,
      totalParticipants: participantRows[0].totalParticipants || 0,
      totalSponsors: sponsorRows[0].totalSponsors || 0,
      totalBudget: budgetRows[0].totalBudget || 0,
      totalRevenue: revenueRows[0].totalRevenue || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};