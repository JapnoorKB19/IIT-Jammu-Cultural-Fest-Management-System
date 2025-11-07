import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const BudgetManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the CREATE form
  const [itemDescription, setItemDescription] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  
  // State for the UPDATE (EDIT) modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const { admin:user } = useAuth();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/budget');
      setExpenses(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch budget expenses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/budget', {
        Item_Description: itemDescription,
        Allocated_Amount: allocatedAmount,
      });
      setItemDescription('');
      setAllocatedAmount('');
      fetchExpenses();
    } catch (err) {
      setError('Failed to create expense.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    if (!editingExpense) return;
    try {
      await apiClient.put(`/budget/${editingExpense.Expense_ID}`, {
        Item_Description: editingExpense.Item_Description,
        Allocated_Amount: editingExpense.Allocated_Amount,
      });
      handleCloseModal();
      fetchExpenses();
    } catch (err) {
      setError('Failed to update expense.');
      console.error(err);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense item?')) {
      try {
        await apiClient.delete(`/budget/${expenseId}`);
        fetchExpenses();
      } catch (err) {
        setError('Failed to delete expense.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Budget & Expenses</h1>
      
      {/* --- CREATE Expense Form --- */}
      {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
        <form onSubmit={handleCreateExpense} className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Description (e.g., Stage Lighting)"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Allocated Amount (e.g., 20000)"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              required
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Expense
          </button>
        </form>
      )}

      {/* --- READ Expenses Table --- */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.Expense_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.Item_Description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{parseFloat(expense.Allocated_Amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.Role === 'SuperAdmin' || user?.Role === 'Head') && (
                      <button
                        onClick={() => handleOpenEditModal(expense)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    )}
                    {user?.Role === 'SuperAdmin' && (
                      <button
                        onClick={() => handleDeleteExpense(expense.Expense_ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* --- UPDATE Expense Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Edit Expense"
      >
        {editingExpense && (
          <form onSubmit={handleUpdateExpense}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Description *</label>
                <input
                  type="text"
                  name="Item_Description"
                  value={editingExpense.Item_Description}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Allocated Amount *</label>
                <input
                  type="number"
                  name="Allocated_Amount"
                  value={editingExpense.Allocated_Amount}
                  onChange={handleEditFormChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BudgetManagement;