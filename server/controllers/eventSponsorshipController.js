const pool = require('../config/db');

exports.addSponsorToEvent = async (req, res) => {
  const { Event_ID, Sponsor_ID, Contribution_Amount } = req.body;
  if (!Event_ID || !Sponsor_ID) {
    return res
      .status(400)
      .json({ message: 'Event_ID and Sponsor_ID are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Event_Sponsorships (Event_ID, Sponsor_ID, Contribution_Amount) VALUES (?, ?, ?)',
      [Event_ID, Sponsor_ID, Contribution_Amount || null]
    );
    res.status(201).json({ Sponsorship_ID: result.insertId, ...req.body });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ message: 'Sponsor is already linked to this event' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ message: 'Invalid Event_ID or Sponsor_ID' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSponsorshipsByEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Event_Sponsorships WHERE Event_ID = ?',
      [eventId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSponsorshipsBySponsor = async (req, res) => {
  const { sponsorId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Event_Sponsorships WHERE Sponsor_ID = ?',
      [sponsorId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSponsorship = async (req, res) => {
  const { id } = req.params;
  const { Contribution_Amount } = req.body;

  if (Contribution_Amount === undefined) {
    return res
      .status(400)
      .json({ message: 'Contribution_Amount is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Event_Sponsorships SET Contribution_Amount = ? WHERE Sponsorship_ID = ?',
      [Contribution_Amount, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }
    res.json({ message: 'Sponsorship updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSponsorship = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Event_Sponsorships WHERE Sponsorship_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }
    res.json({ message: 'Sponsorship deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};