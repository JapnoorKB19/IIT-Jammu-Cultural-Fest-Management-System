const pool = require('../config/db');

exports.createSponsor = async (req, res) => {
  const { Sponsor_Name, Amount, Sponsor_Type } = req.body;
  if (!Sponsor_Name || !Amount) {
    return res
      .status(400)
      .json({ message: 'Sponsor_Name and Amount are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Sponsors (Sponsor_Name, Amount, Sponsor_Type) VALUES (?, ?, ?)',
      [Sponsor_Name, Amount, Sponsor_Type || null]
    );
    res.status(201).json({ Sponsor_ID: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllSponsors = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sponsors');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSponsorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Sponsors WHERE Sponsor_ID = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSponsor = async (req, res) => {
  const { id } = req.params;
  const { Sponsor_Name, Amount, Sponsor_Type } = req.body;
  if (!Sponsor_Name || !Amount) {
    return res
      .status(400)
      .json({ message: 'Sponsor_Name and Amount are required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE Sponsors SET Sponsor_Name = ?, Amount = ?, Sponsor_Type = ? WHERE Sponsor_ID = ?',
      [Sponsor_Name, Amount, Sponsor_Type || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    res.json({ message: 'Sponsor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSponsor = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Sponsors WHERE Sponsor_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};