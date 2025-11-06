const pool = require('../config/db');

exports.createPerformer = async (req, res) => {
  const { Name, Performer_Type } = req.body;
  if (!Name || !Performer_Type) {
    return res
      .status(400)
      .json({ message: 'Name and Performer_Type are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Performers (Name, Performer_Type) VALUES (?, ?)',
      [Name, Performer_Type]
    );
    res.status(201).json({ Performer_ID: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllPerformers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Performers');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPerformerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Performers WHERE Performer_ID = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Performer not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePerformer = async (req, res) => {
  const { id } = req.params;
  const { Name, Performer_Type } = req.body;
  if (!Name || !Performer_Type) {
    return res
      .status(400)
      .json({ message: 'Name and Performer_Type are required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE Performers SET Name = ?, Performer_Type = ? WHERE Performer_ID = ?',
      [Name, Performer_Type, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Performer not found' });
    }
    res.json({ message: 'Performer updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePerformer = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Performers WHERE Performer_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Performer not found' });
    }
    res.json({ message: 'Performer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};