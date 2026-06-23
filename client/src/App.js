import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, LogOut, Plus, Download, Eye, Trash2, Camera } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';
import TransactionHistory from './TransactionHistory';
import CategoryTracker from './CategoryTracker';
import TransactionModal from './TransactionModal';
import IncomePage from './IncomePage'; 
import ExpensePage from './ExpensePage';
import AuthPage from './AuthPage'; 
import BudgetProgress from './BudgetProgress';
import ChatWidget from './ChatWidget';

function App() {
  const [user, setUser] = useState(null); 
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Profile Image States
  const [profileImage, setProfileImage] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = () => {
    axios.get(`http://localhost:5000/transactions/${user._id}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error("Error fetching transactions:", err));
  };

  // --- 2. AUTH LOGIC ---
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    setProfileImage(null);
    setActiveView('dashboard');
    setShowProfileMenu(false);
  };

  // --- 3. PROFILE IMAGE LOGIC ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setShowProfileMenu(false); // Close menu after upload
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('userId', user._id);
      console.log("File ready for backend:", file.name);
    }
  };

  const deleteProfileImage = () => {
    if (window.confirm("Remove profile picture?")) {
      setProfileImage(null);
      setShowProfileMenu(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setShowProfileMenu(false);
    if (showProfileMenu) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [showProfileMenu]);

  // --- 4. TRANSACTION LOGIC ---
  const addTransaction = (t) => {
    if (t.type === 'expense' && user.monthlyBudget > 0) {
      const currentTotalExpenses = transactions.filter(tr => tr.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);
      const newTotalExpenses = currentTotalExpenses + Number(t.amount);
      
      if (newTotalExpenses > user.monthlyBudget) {
        alert("Action Blocked: This expense exceeds your monthly budget limit!");
        return;
      } else if (newTotalExpenses >= 0.8 * user.monthlyBudget) {
        alert("Warning: This expense puts you at or above 80% of your monthly budget limit!");
      }
    }

    const transactionData = { ...t, userId: user._id };
    axios.post('http://localhost:5000/transactions/add', transactionData)
      .then(res => {
        fetchTransactions(); 
        setIsModalOpen(false);
      })
      .catch(err => console.error("Error adding:", err));
  };

  const handleUpdateBudget = (newBudget) => {
    axios.put(`http://localhost:5000/auth/budget/${user._id}`, { monthlyBudget: newBudget })
      .then(res => {
        setUser({ ...user, monthlyBudget: newBudget });
      })
      .catch(err => console.error("Error updating budget:", err));
  };

  const deleteTransaction = (id) => {
    const targetId = transactions.find(t => t._id === id || t.id === id)?._id || id;
    axios.delete(`http://localhost:5000/transactions/${targetId}`)
      .then(() => {
        setTransactions(transactions.filter(t => t._id !== targetId));
      })
      .catch(err => console.error("Error deleting transaction:", err));
  };

  const clearAllIncome = () => {
    if (window.confirm("Delete ALL income records from database?")) {
      const incomeIds = transactions.filter(t => t.type === 'income').map(t => t._id);
      Promise.all(incomeIds.map(id => axios.delete(`http://localhost:5000/transactions/${id}`)))
        .then(() => fetchTransactions());
    }
  };

  const clearAllExpenses = () => {
    if (window.confirm("Delete ALL expense records from database?")) {
      const expenseIds = transactions.filter(t => t.type === 'expense').map(t => t._id);
      Promise.all(expenseIds.map(id => axios.delete(`http://localhost:5000/transactions/${id}`)))
        .then(() => fetchTransactions());
    }
  };

  // --- 5. PDF EXPORT ---
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text('Expense Tracker Report', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`User: ${user?.username || 'User'}`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 34);

    const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
    const tableRows = transactions.map(t => [
      new Date(t.date || t.id).toLocaleDateString(),
      t.description,
      t.category || 'General',
      t.type.toUpperCase(),
      `Rs. ${t.amount.toLocaleString('en-IN')}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      headStyles: { fillColor: [124, 58, 237] },
      theme: 'striped'
    });

    doc.save(`Financial_Report_${Date.now()}.pdf`);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);
  const balance = totalIncome - totalExpenses;

  const indianCurrency = new Intl.NumberFormat('en-IN', { 
    style: 'currency', currency: 'INR', maximumFractionDigits: 0 
  });

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="profile-section">
          <div className="avatar-container" onClick={(e) => e.stopPropagation()}>
            <div className="avatar" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-img" />
              ) : (
                user.username.substring(0, 2).toUpperCase()
              )}
              <div className="avatar-overlay">
                <Camera size={18} />
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="profile-menu">
                <label htmlFor="file-input" className="menu-item">
                  <Plus size={16} /> Update Photo
                </label>
                {profileImage && (
                  <>
                    <div className="menu-item" onClick={() => setShowFullImage(true)}>
                      <Eye size={16} /> View Photo
                    </div>
                    <div className="menu-item delete" onClick={deleteProfileImage}>
                      <Trash2 size={16} /> Remove Photo
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <input 
            id="file-input" 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
          
          <h3>{user.username}</h3>
        </div>

        <ul className="nav-links">
          <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => setActiveView('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </li>
          <li className={activeView === 'income' ? 'active' : ''} onClick={() => setActiveView('income')}>
            <ArrowUpCircle size={20} /> Income
          </li>
          <li className={activeView === 'expense' ? 'active' : ''} onClick={() => setActiveView('expense')}>
            <ArrowDownCircle size={20} /> Expense
          </li>
          <li className="logout" onClick={handleLogout}><LogOut size={20} /> Logout</li>
        </ul>
      </nav>

      <main className="main-content">
        {activeView === 'dashboard' && (
          <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2>Dashboard</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="download-btn-main" onClick={downloadPDF}>
                  <Download size={20} /> Download PDF
                </button>
                <button className="add-new-btn" onClick={() => setIsModalOpen(true)}>
                  <Plus size={20} /> Add New
                </button>
              </div>
            </header>

            <div className="stats-grid">
              <div className="card">
                <div className="icon-box blue"><LayoutDashboard /></div>
                <div><p>Total Balance</p><h3>{indianCurrency.format(balance)}</h3></div>
              </div>
              <div className="card">
                <div className="icon-box orange"><ArrowUpCircle /></div>
                <div><p>Total Income</p><h3>{indianCurrency.format(totalIncome)}</h3></div>
              </div>
              <div className="card">
                <div className="icon-box red"><ArrowDownCircle /></div>
                <div><p>Total Expenses</p><h3>{indianCurrency.format(totalExpenses)}</h3></div>
              </div>
              <BudgetProgress 
                totalExpenses={totalExpenses} 
                budgetLimit={user?.monthlyBudget || 0} 
                onUpdateBudget={handleUpdateBudget} 
              />
            </div>

            <div className="data-section">
              <div className="recent-transactions">
                <TransactionHistory transactions={transactions} onDeleteOne={deleteTransaction} />
              </div>
              <div className="visual-overview">
                <CategoryTracker transactions={transactions} />
              </div>
            </div>
          </>
        )}

        {activeView === 'income' && (
          <IncomePage 
            transactions={transactions} 
            onOpenModal={() => setIsModalOpen(true)} 
            onClearAll={clearAllIncome}
            onDeleteOne={deleteTransaction}
          />
        )}

        {activeView === 'expense' && (
          <ExpensePage 
            transactions={transactions} 
            onOpenModal={() => setIsModalOpen(true)} 
            onClearAll={clearAllExpenses}
            onDeleteOne={deleteTransaction}
          />
        )}

        {isModalOpen && (
          <TransactionModal 
            onAdd={addTransaction} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}

        {/* Full Image Viewer (Lightbox) */}
        {showFullImage && (
          <div className="lightbox-overlay" onClick={() => setShowFullImage(false)}>
            <div className="lightbox-content">
              <img src={profileImage} alt="Full Profile" />
              <button className="close-lightbox">×</button>
            </div>
          </div>
        )}

        <ChatWidget transactions={transactions} budgetLimit={user?.monthlyBudget || 0} />
      </main>
    </div>
  );
}

export default App;