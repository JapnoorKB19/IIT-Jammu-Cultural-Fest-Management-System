const pool = require('../config/db');

exports.assignTeamToEvent = async (req, res) => {
  const { Event_ID, Team_ID } = req.body;
  if (!Event_ID || !Team_ID) {
    return res
      .status(400)
      .json({ message: 'Event_ID and Team_ID are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Event_Management (Event_ID, Team_ID) VALUES (?, ?)',
      [Event_ID, Team_ID]
    );
    res.status(201).json({ Management_ID: result.insertId, ...req.body });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ message: 'Team is already assigned to this event' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ message: 'Invalid Event_ID or Team_ID' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getManagementByEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Event_Management WHERE Event_ID = ?',
      [eventId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getManagementByTeam = async (req, res) => {
  const { teamId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Event_Management WHERE Team_ID = ?',
      [teamId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteManagementAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Event_Management WHERE Management_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};