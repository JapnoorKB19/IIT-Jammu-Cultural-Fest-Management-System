const pool = require('../config/db');

exports.createTeam = async (req, res) => {
  const { Team_Name } = req.body;
  if (!Team_Name) {
    return res.status(400).json({ message: 'Team_Name is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Teams (Team_Name) VALUES (?)',
      [Team_Name]
    );
    res.status(201).json({ Team_ID: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Teams');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Teams WHERE Team_ID = ?', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { Team_Name } = req.body;
  if (!Team_Name) {
    return res.status(400).json({ message: 'Team_Name is required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE Teams SET Team_Name = ? WHERE Team_ID = ?',
      [Team_Name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Teams WHERE Team_ID = ?', [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};