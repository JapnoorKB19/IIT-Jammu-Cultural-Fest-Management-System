const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new student member (Admin)
// @route   POST /api/auth/member/register
// @access  Public (for now, will be Admin-only later)
// @desc    Register a new student member (Admin or SuperAdmin)
// @route   POST /api/auth/member/register
// @access  Public (for now, will be Admin-only later)
// @desc    Register a new student member (Admin or SuperAdmin)
// @route   POST /api/auth/member/register
// @access  SuperAdmin
// @desc    Register a new student member
// @route   POST /api/auth/member/register
// @access  SuperAdmin
exports.registerStudentMember = async (req, res) => {
  const { Student_ID, Name, Role, Team_ID, Password } = req.body;

  // --- Field Validation ---
  if (!Student_ID || !Name || !Role || !Password) {
    return res.status(400).json({ message: 'Student_ID, Name, Role, and Password are required' });
  }
  // Team ID is required unless the new user is a SuperAdmin
  if (Role !== 'SuperAdmin' && !Team_ID) {
    return res.status(400).json({ message: 'Team_ID is required for Head, Co-head, and Member roles' });
  }

  try {
    // --- THIS IS THE NEW LOGIC ---
    if (Role === 'Head') {
      const [existing] = await pool.query(
        'SELECT Student_ID FROM Student_Members WHERE Team_ID = ? AND Role = \'Head\'',
        [Team_ID]
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          message: 'This team already has a Head. You can only assign a Co-head or Member.' 
        });
      }
    } else if (Role === 'Co-head') {
      const [existing] = await pool.query(
        'SELECT Student_ID FROM Student_Members WHERE Team_ID = ? AND Role = \'Co-head\'',
        [Team_ID]
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          message: 'This team already has a Co-head. You can only assign a Head or Member.' 
        });
      }
    }
    // --- END OF NEW LOGIC ---

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    
    const teamIdForDb = (Role === 'SuperAdmin') ? null : Team_ID;

    await pool.query(
      'INSERT INTO Student_Members (Student_ID, Name, Role, Team_ID, Password) VALUES (?, ?, ?, ?, ?)',
      [Student_ID, Name, Role, teamIdForDb, hashedPassword]
    );

    res.status(201).json({ message: 'Student member registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Student_ID already exists' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Team_ID does not exist' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Login a student member & get token
// @route   POST /api/auth/member/login
// @access  Public
exports.loginStudentMember = async (req, res) => {
  const { Student_ID, Password } = req.body;

  if (!Student_ID || !Password) {
    return res.status(400).json({ message: 'Please provide Student_ID and Password' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Student_Members WHERE Student_ID = ?',
      [Student_ID]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const member = rows[0];
    const isMatch = await bcrypt.compare(Password, member.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      Student_ID: member.Student_ID,
      Name: member.Name,
      Role: member.Role,
      token: generateToken(member.Student_ID, member.Role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login a participant & get token
// @route   POST /api/auth/participant/login
// @access  Public
exports.loginParticipant = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: 'Please provide Email and Password' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Participants WHERE Email = ?',
      [Email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const participant = rows[0];
    const isMatch = await bcrypt.compare(Password, participant.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Sign a token for the participant
    // Note the role is hard-coded as 'Participant'
    res.json({
      Participant_ID: participant.Participant_ID,
      Name: participant.Name,
      Email: participant.Email,
      Role: 'Participant', // This will be useful on the frontend
      token: generateToken(participant.Participant_ID, 'Participant'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};