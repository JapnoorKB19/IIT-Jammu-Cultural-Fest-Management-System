const pool = require('../config/db');

// @desc    Create a new venue
// @route   POST /api/venues
// @access  Admin
exports.createVenue = async (req, res) => {
  const { VenueName, Capacity, Location } = req.body;

  if (!VenueName) {
    return res.status(400).json({ message: 'VenueName is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Venues (VenueName, Capacity, Location) VALUES (?, ?, ?)',
      [VenueName, Capacity || null, Location || null]
    );
    res.status(201).json({
      message: 'Venue created successfully',
      VenueID: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getAllVenues = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Venues');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single venue by ID
// @route   GET /api/venues/:id
// @access  Public
exports.getVenueById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Venues WHERE VenueID = ?', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a venue
// @route   PUT /api/venues/:id
// @access  Admin
exports.updateVenue = async (req, res) => {
  const { id } = req.params;
  const { VenueName, Capacity, Location } = req.body;

  if (!VenueName) {
    return res.status(400).json({ message: 'VenueName is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Venues SET VenueName = ?, Capacity = ?, Location = ? WHERE VenueID = ?',
      [VenueName, Capacity || null, Location || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json({ message: 'Venue updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a venue
// @route   DELETE /api/venues/:id
// @access  Admin
exports.deleteVenue = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Venues WHERE VenueID = ?', [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};