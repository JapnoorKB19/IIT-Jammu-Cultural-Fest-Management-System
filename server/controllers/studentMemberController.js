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

exports.updateStudentMember = async (req, res) => {
  const { id } = req.params;
  const { Name, Role, Team_ID } = req.body;

  if (!Name || !Role || !Team_ID) {
    return res
      .status(400)
      .json({ message: 'Name, Role, and Team_ID are required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Student_Members SET Name = ?, Role = ?, Team_ID = ? WHERE Student_ID = ?',
      [Name, Role, Team_ID, id]
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