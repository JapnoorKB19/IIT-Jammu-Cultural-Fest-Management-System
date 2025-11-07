const pool = require('../config/db');

exports.getAllStudentMembers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Student_Members');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Student_Members WHERE Student_ID = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student member not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a student member
// @route   PUT /api/members/:id
// @access  Admin

// @desc    Update a student member
// @route   PUT /api/members/:id
// @access  Admin
exports.updateStudentMember = async (req, res) => {
  const { id } = req.params; // The Student_ID of the member we are editing
  const { Name, Role, Team_ID } = req.body;

  // --- Field Validation ---
  if (!Name || !Role) {
    return res.status(400).json({ message: 'Name and Role are required' });
  }
  if (Role !== 'SuperAdmin' && !Team_ID) {
    return res.status(400).json({ message: 'Team_ID is required for Head, Co-head, and Member roles' });
  }

  try {
    // --- THIS IS THE NEW LOGIC ---
    if (Role === 'Head') {
      const [existing] = await pool.query(
        'SELECT Student_ID FROM Student_Members WHERE Team_ID = ? AND Role = \'Head\' AND Student_ID != ?',
        [Team_ID, id] // Exclude the user we are currently editing
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          message: 'This team already has a Head. You can only assign a Co-head or Member.' 
        });
      }
    } else if (Role === 'Co-head') {
      const [existing] = await pool.query(
        'SELECT Student_ID FROM Student_Members WHERE Team_ID = ? AND Role = \'Co-head\' AND Student_ID != ?',
        [Team_ID, id] // Exclude the user we are currently editing
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          message: 'This team already has a Co-head. You can only assign a Head or Member.' 
        });
      }
    }
    // --- END OF NEW LOGIC ---

    const teamIdForDb = (Role === 'SuperAdmin') ? null : Team_ID;

    const [result] = await pool.query(
      'UPDATE Student_Members SET Name = ?, Role = ?, Team_ID = ? WHERE Student_ID = ?',
      [Name, Role, teamIdForDb, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student member not found' });
    }
    res.json({ message: 'Student member updated successfully' });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Team_ID does not exist' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudentMember = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Student_Members WHERE Student_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student member not found' });
    }
    res.json({ message: 'Student member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};