import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';

const BudgetProgress = ({ totalExpenses, budgetLimit, onUpdateBudget }) => {
    const isBudgetSet = budgetLimit > 0;
    const percentage = isBudgetSet ? Math.min((totalExpenses / budgetLimit) * 100, 100) : 0;
    
    let progressColor = '#10b981'; // Green
    if (percentage > 80) progressColor = '#f59e0b'; // Orange
    if (percentage >= 100) progressColor = '#ef4444'; // Red

    const [isEditing, setIsEditing] = useState(false);
    const [tempBudget, setTempBudget] = useState(budgetLimit || '');

    const handleSave = () => {
        onUpdateBudget(Number(tempBudget));
        setIsEditing(false);
    };

    return (
        <div className="card budget-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Monthly Budget</h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <Edit2 size={16} />
                    </button>
                )}
            </div>

            {isEditing ? (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <input 
                        type="number" 
                        value={tempBudget} 
                        onChange={(e) => setTempBudget(e.target.value)} 
                        placeholder="Set Limit"
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <button onClick={handleSave} style={{ padding: '8px 12px', background: '#0f172a', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setIsEditing(false)} style={{ padding: '8px 12px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                </div>
            ) : (
                <div style={{ marginTop: '15px' }}>
                    {!isBudgetSet ? (
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No budget set.</p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                <span>Rs. {totalExpenses.toLocaleString('en-IN')} spent</span>
                                <span>Rs. {budgetLimit.toLocaleString('en-IN')} limit</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${percentage}%`, 
                                    height: '100%', 
                                    backgroundColor: progressColor, 
                                    transition: 'width 0.3s ease, background-color 0.3s ease' 
                                }}></div>
                            </div>
                            {percentage >= 80 && percentage < 100 && (
                                <p style={{ color: '#f59e0b', fontSize: '12px', marginTop: '8px', fontWeight: 'bold' }}>Warning: You've reached {percentage.toFixed(0)}% of your budget!</p>
                            )}
                            {percentage >= 100 && (
                                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontWeight: 'bold' }}>Alert: You have exceeded your budget!</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BudgetProgress;
