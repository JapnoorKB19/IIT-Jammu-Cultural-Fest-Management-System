const pool = require('../config/db');

exports.createExpense = async (req, res) => {
  const { Item_Description, Allocated_Amount } = req.body;
  if (!Item_Description || !Allocated_Amount) {
    return res
      .status(400)
      .json({ message: 'Item_Description and Allocated_Amount are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Budget_Expenses (Item_Description, Allocated_Amount) VALUES (?, ?)',
      [Item_Description, Allocated_Amount]
    );
    res.status(201).json({ Expense_ID: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Budget_Expenses');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Budget_Expenses WHERE Expense_ID = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { Item_Description, Allocated_Amount } = req.body;
  if (!Item_Description || !Allocated_Amount) {
    return res
      .status(400)
      .json({ message: 'Item_Description and Allocated_Amount are required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE Budget_Expenses SET Item_Description = ?, Allocated_Amount = ? WHERE Expense_ID = ?',
      [Item_Description, Allocated_Amount, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM Budget_Expenses WHERE Expense_ID = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};