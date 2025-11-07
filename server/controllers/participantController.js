const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken'); // Import generateToken

// @desc    Create a new participant and return a token
// @route   POST /api/participants
// @access  Public
exports.createParticipant = async (req, res) => {
  const { Name, Email, Password, Phone, College } = req.body;

  if (!Name || !Email || !Password) {
    return res
      .status(400)
      .json({ message: 'Name, Email, and Password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const [result] = await pool.query(
      'INSERT INTO Participants (Name, Email, Password, Phone, College) VALUES (?, ?, ?, ?, ?)',
      [Name, Email, hashedPassword, Phone || null, College || null]
    );
    
    // --- THIS IS THE FIX ---
    // We now create a token immediately upon registration
    const newParticipantId = result.insertId;
    const token = generateToken(newParticipantId, 'Participant');
    
    res.status(201).json({ 
      Participant_ID: newParticipantId, 
      Name: Name,
      Email: Email,
      Role: 'Participant',
      token: token
    });
    // --- END OF FIX ---

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ... (all other functions: getAllParticipants, getParticipantById, etc. remain exactly the same) ...

// @desc    Get all participants
// @route   GET /api/participants
// @access  Admin
exports.getAllParticipants = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Participant_ID, Name, Email, Phone, College FROM Participants');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single participant by ID
// @route   GET /api/participants/:id
// @access  Admin
exports.getParticipantById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT Participant_ID, Name, Email, Phone, College FROM Participants WHERE Participant_ID = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a participant
// @route   PUT /api/participants/:id
// @access  Admin
exports.updateParticipant = async (req, res) => {
  const { id } = req.params;
  const { Name, Email, Phone, College } = req.body;
  if (!Name || !Email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE Participants SET Name = ?, Email = ?, Phone = ?, College = ? WHERE Participant_ID = ?',
      [Name, Email, Phone || null, College || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    res.json({ message: 'Participant updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a participant
// @route   DELETE /api/participants/:id
// @access  SuperAdmin
exports.deleteParticipant = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Participants WHERE Participant_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    res.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};