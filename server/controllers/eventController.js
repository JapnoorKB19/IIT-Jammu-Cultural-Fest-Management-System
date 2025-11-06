const pool = require('../config/db');

exports.createEvent = async (req, res) => {
  const {
    Event_Name,
    Event_Type,
    Prize_Money,
    Max_Participants,
    DayID,
    VenueID,
    Performer_ID,
  } = req.body;

  if (!Event_Name || !Event_Type) {
    return res
      .status(400)
      .json({ message: 'Event_Name and Event_Type are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Events (Event_Name, Event_Type, Prize_Money, Max_Participants, DayID, VenueID, Performer_ID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        Event_Name,
        Event_Type,
        Prize_Money || null,
        Max_Participants || null,
        DayID || null,
        VenueID || null,
        Performer_ID || null,
      ]
    );
    res.status(201).json({ Event_ID: result.insertId, ...req.body });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ message: 'A provided ID (DayID, VenueID, or Performer_ID) does not exist.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Events');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Events WHERE Event_ID = ?', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    Event_Name,
    Event_Type,
    Prize_Money,
    Max_Participants,
    DayID,
    VenueID,
    Performer_ID,
  } = req.body;

  if (!Event_Name || !Event_Type) {
    return res
      .status(400)
      .json({ message: 'Event_Name and Event_Type are required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Events SET Event_Name = ?, Event_Type = ?, Prize_Money = ?, Max_Participants = ?, DayID = ?, VenueID = ?, Performer_ID = ? WHERE Event_ID = ?',
      [
        Event_Name,
        Event_Type,
        Prize_Money || null,
        Max_Participants || null,
        DayID || null,
        VenueID || null,
        Performer_ID || null,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ message: 'A provided ID (DayID, VenueID, or Performer_ID) does not exist.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Events WHERE Event_ID = ?', [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};