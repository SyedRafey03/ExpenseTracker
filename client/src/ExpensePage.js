import React from 'react';
import { IndianRupee, TrendingDown, Trash2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

// Registering Line Chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ExpensePage({ transactions, onOpenModal, onClearAll, onDeleteOne }) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const indianCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  });

  // --- LINE CHART DATA ---
  const chartData = {
    labels: expenseTransactions.map(t => {
      const dateObj = t.date ? new Date(t.date) : new Date();
      return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }).reverse(),
    datasets: [
      {
        fill: true,
        label: 'Expense Trend',
        data: expenseTransactions.map(t => t.amount).reverse(),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4, 
      },
    ],
  };

  return (
    <div className="expense-page">
      <div className="income-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>Expense Overview</h2>
            <p style={{ color: '#6b7280' }}>Track your spending trends and gain insights.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {expenseTransactions.length > 0 && (
              <button className="clear-all-btn" onClick={onClearAll}>Clear All</button>
            )}
            {/* UPDATED BUTTON: Class and Style now match IncomePage */}
            <button className="add-income-btn" onClick={onOpenModal}>
              + Add Expense
            </button>
          </div>
        </div>

        {/* --- LINE CHART --- */}
        <div style={{ height: '300px', width: '100%' }}>
          {expenseTransactions.length > 0 ? (
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          ) : (
            <div className="empty-chart">No expense data available</div>
          )}
        </div>
      </div>

      <div className="income-sources-section">
        <h3>All Expenses</h3>
        <div className="income-grid">
          {expenseTransactions.map((exp) => (
            <div key={exp._id || exp.id} className="income-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="income-icon-circle" style={{ backgroundColor: '#fee2e2' }}>
                  <IndianRupee size={18} color="#ef4444" />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{exp.description}</h4>
                  <small style={{ color: '#9ca3af' }}>
                    {exp.category} • {exp.date 
                      ? new Date(exp.date).toLocaleDateString() 
                      : new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="income-amount-tag" style={{ backgroundColor: '#fee2e2' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-{indianCurrency.format(exp.amount)}</span>
                  <TrendingDown size={14} color="#ef4444" style={{ marginLeft: '4px' }} />
                </div>
                <Trash2 size={18} className="delete-icon" onClick={() => onDeleteOne(exp._id || exp.id)} />
              </div>
            </div>
          ))}
          {expenseTransactions.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No expenses found. Start tracking!</p>}
        </div>
      </div>
    </div>
  );
}

export default ExpensePage;