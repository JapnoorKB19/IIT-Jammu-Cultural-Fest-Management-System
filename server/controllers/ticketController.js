const pool = require('../config/db');

exports.createTicket = async (req, res) => {
  const { Event_ID, Participant_ID, Quantity } = req.body;
  if (!Event_ID || !Participant_ID || !Quantity) {
    return res
      .status(400)
      .json({ message: 'Event_ID, Participant_ID, and Quantity are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Tickets (Event_ID, Participant_ID, Quantity, Purchase_Date) VALUES (?, ?, ?, ?)',
      [Event_ID, Participant_ID, Quantity, new Date()]
    );
    res.status(201).json({ Ticket_ID: result.insertId, ...req.body });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ message: 'Invalid Event_ID or Participant_ID' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTicketsByEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Tickets WHERE Event_ID = ?',
      [eventId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTicketsByParticipant = async (req, res) => {
  const { participantId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Tickets WHERE Participant_ID = ?',
      [participantId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { Quantity } = req.body;

  if (!Quantity) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Tickets SET Quantity = ? WHERE Ticket_ID = ?',
      [Quantity, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Tickets WHERE Ticket_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};