import React from 'react';
import { IndianRupee, TrendingUp, Trash2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function IncomePage({ transactions, onOpenModal, onClearAll, onDeleteOne }) {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  const indianCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  });

  const chartData = {
    labels: incomeTransactions.map(t => t.description),
    datasets: [{
      label: 'Income Amount',
      data: incomeTransactions.map(t => t.amount),
      backgroundColor: '#7c3aed',
      borderRadius: 8,
    }],
  };

  return (
    <div className="income-page">
      <div className="income-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>Income Overview</h2>
            <p style={{ color: '#6b7280' }}>Track and manage your earnings.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {incomeTransactions.length > 0 && (
              <button className="clear-all-btn" onClick={onClearAll}>
                Clear All
              </button>
            )}
            <button className="add-income-btn" onClick={onOpenModal}>
              + Add Income
            </button>
          </div>
        </div>

        <div style={{ height: '250px', width: '100%' }}>
          {incomeTransactions.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <div className="empty-chart">No income data available</div>
          )}
        </div>
      </div>

      <div className="income-sources-section">
        <h3>Income Sources</h3>
        <div className="income-grid">
          {incomeTransactions.map((income) => (
            <div key={income._id || income.id} className="income-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Icon Circle matches the style of Expense Page */}
                <div className="income-icon-circle" style={{ backgroundColor: '#ecfdf5' }}>
                  <IndianRupee size={18} color="#10b981" />
                </div>
                
                {/* Info layout updated to match Expense style */}
                <div>
                  <h4 style={{ margin: 0 }}>{income.description}</h4>
                  <small style={{ color: '#9ca3af' }}>
                    {income.category} • {income.date 
                      ? new Date(income.date).toLocaleDateString() 
                      : new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="income-amount-tag">
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                    +{indianCurrency.format(income.amount)}
                  </span>
                  <TrendingUp size={14} color="#10b981" style={{ marginLeft: '4px' }} />
                </div>
                <Trash2 
                  size={18} 
                  className="delete-icon" 
                  onClick={() => onDeleteOne(income._id || income.id)} 
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))}
          {incomeTransactions.length === 0 && <p>No income found. Start earning!</p>}
        </div>
      </div>
    </div>
  );
}

export default IncomePage;