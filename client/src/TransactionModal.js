import React, { useState } from 'react';
import { X } from 'lucide-react';

function TransactionModal({ onAdd, onClose }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return alert("Please fill all fields");
    onAdd({ description, amount: Number(amount), type, category });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Transaction</h3>
          <X className="close-icon" onClick={onClose} />
        </div>

        {/* Toggle buttons for Income/Expense */}
        <div className="type-toggle">
          <button 
            type="button"
            className={type === 'income' ? 'active income' : ''} 
            onClick={() => setType('income')}
          >Income</button>
          <button 
            type="button"
            className={type === 'expense' ? 'active expense' : ''} 
            onClick={() => setType('expense')}
          >Expense</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            type="text" 
            placeholder="Description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required 
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {type === 'expense' ? (
              <>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Transport">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Others">Others</option>
              </>
            ) : (
              <>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Others">Others</option>
              </>
            )}
          </select>
          <button type="submit" className="submit-btn">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;