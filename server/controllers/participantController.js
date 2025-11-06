const pool = require('../config/db');

exports.createParticipant = async (req, res) => {
  const { Name, Email, Phone, College } = req.body;
  if (!Name || !Email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Participants (Name, Email, Phone, College) VALUES (?, ?, ?, ?)',
      [Name, Email, Phone || null, College || null]
    );
    res.status(201).json({ Participant_ID: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllParticipants = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Participants');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getParticipantById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Participants WHERE Participant_ID = ?',
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