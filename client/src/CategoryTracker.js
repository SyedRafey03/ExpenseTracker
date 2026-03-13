import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryTracker({ transactions }) {
  // 1. Calculate Totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpenses;

  // 2. Indian Currency Formatter (Used for center text AND chart tooltips)
  const indianCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  // 3. Chart Data Configuration
  const data = {
    labels: ['Total Balance', 'Total Expenses', 'Total Income'],
    datasets: [{
      data: [balance, totalExpenses, totalIncome],
      backgroundColor: ['#7c3aed', '#ef4444', '#f97316'],
      hoverOffset: 10,
      cutout: '75%',
      borderWidth: 0,
    }]
  };

  // 4. Chart Options (This is where we fix the comma formatting)
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          // This specific function fixes the comma placement in the hover popup
          label: function(context) {
            let label = context.label || '';
            if (label) { label += ': '; }
            if (context.parsed !== null) {
              label += indianCurrency.format(context.parsed);
            }
            return label;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  // 5. Safety Check for Empty Data
  if (transactions.length === 0) {
    return (
      <div className="visual-overview" style={{ textAlign: 'center', padding: '40px 0' }}>
        <h3>Financial Overview</h3>
        <div style={{ marginTop: '20px', color: '#888' }}>
          <p>No data to visualize yet.</p>
          <small>Add an income or expense to see the chart.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="visual-overview">
      <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>Financial Overview</h3>
      <div style={{ position: 'relative', height: '320px' }}>
        <Doughnut data={data} options={options} />
        
        {/* Centered Text inside the Doughnut */}
        <div style={{
          position: 'absolute',
          top: '41%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Balance</p>
          <strong style={{ fontSize: '18px', color: '#111827' }}>
            {indianCurrency.format(balance)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default CategoryTracker;