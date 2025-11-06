const pool = require('../config/db');

exports.createRegistration = async (req, res) => {
  const { Event_ID, Participant_ID } = req.body;
  if (!Event_ID || !Participant_ID) {
    return res
      .status(400)
      .json({ message: 'Event_ID and Participant_ID are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Event_Registrations (Event_ID, Participant_ID, Registration_Date) VALUES (?, ?, ?)',
      [Event_ID, Participant_ID, new Date()]
    );
    res
      .status(201)
      .json({ Registration_ID: result.insertId, ...req.body });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ message: 'Participant is already registered for this event' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ message: 'Invalid Event_ID or Participant_ID' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRegistrationsByEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Event_Registrations WHERE Event_ID = ?',
      [eventId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRegistrationsByParticipant = async (req, res) => {
  const { participantId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Event_Registrations WHERE Participant_ID = ?',
      [participantId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRegistration = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Event_Registrations WHERE Registration_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};