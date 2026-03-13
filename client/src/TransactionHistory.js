import React from 'react';

function TransactionHistory({ transactions }) {
  // Helper function to format currency
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="history-container" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h3>Transaction History</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {transactions.map((t) => (
          <li key={t.id} style={{
            borderBottom: '1px solid #eee',
            padding: '12px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold' }}>{t.description}</span>
              <small style={{ color: '#666' }}>{t.category || 'Income'}</small>
            </div>
            {/* Using our new format function here */}
            <strong style={{ color: t.type === 'income' ? '#2ecc71' : '#e74c3c' }}>
              {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
            </strong>
          </li>
        ))}
      </ul>
      {transactions.length === 0 && <p style={{ color: '#888' }}>No transactions recorded yet.</p>}
    </div>
  );
}

export default TransactionHistory;