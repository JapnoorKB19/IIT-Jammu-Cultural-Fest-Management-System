const pool = require('../config/db');

exports.createDay = async (req, res) => {
  const { DayNumber, EventDate, Description } = req.body;
  if (!DayNumber) {
    return res.status(400).json({ message: 'DayNumber is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO DaySchedule (DayNumber, EventDate, Description) VALUES (?, ?, ?)',
      [DayNumber, EventDate || null, Description || null]
    );
    res.status(201).json({ DayID: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllDays = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM DaySchedule');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDayById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM DaySchedule WHERE DayID = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Day not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDay = async (req, res) => {
  const { id } = req.params;
  const { DayNumber, EventDate, Description } = req.body;
  if (!DayNumber) {
    return res.status(400).json({ message: 'DayNumber is required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE DaySchedule SET DayNumber = ?, EventDate = ?, Description = ? WHERE DayID = ?',
      [DayNumber, EventDate || null, Description || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Day not found' });
    }
    res.json({ message: 'Day updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteDay = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM DaySchedule WHERE DayID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Day not found' });
    }
    res.json({ message: 'Day deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};