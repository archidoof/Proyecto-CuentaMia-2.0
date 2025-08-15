import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CardManager from './components/CardManager';
import RecurringExpensesManager from './components/RecurringExpensesManager';
import SalaryManager from './components/SalaryManager'; // Re-import SalaryManager
import PeriodManager from './components/PeriodManager';
import Tabs from './components/Tabs';
import AuthScreen from './components/AuthScreen';
import UserMenu from './components/UserMenu';
import SettingsMenu from './components/SettingsMenu';
import CalendarView from './components/CalendarView';
import { Settings, Calendar } from 'lucide-react';
import {
  calculateFinancialSummary,
  saveToLocalStorage,
  loadFromLocalStorage,
  mockTransactions,
  mockCards,
  mockSalaries, // Re-import mockSalaries
  mockRecurringExpenses,
  mockRecurringIncomes,
  mockPeriods
} from './utils/helpers';
import {
  loadUsers,
  saveUsers,
  loadCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  getUserDataKey
} from './utils/auth';

const App = () => {
  const [users, setUsers] = useState(() => loadUsers());
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());

  // State for financial data, now user-specific
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [salaries, setSalaries] = useState([]); // Salaries state is back!
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [recurringIncomes, setRecurringIncomes] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState({});
  const [periodsHistory, setPeriodsHistory] = useState([]);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Load user data on login/switch user
  useEffect(() => {
    if (currentUser) {
      setTransactions(loadFromLocalStorage(getUserDataKey(currentUser, 'transactions'), mockTransactions));
      setCards(loadFromLocalStorage(getUserDataKey(currentUser, 'cards'), mockCards));
      setSalaries(loadFromLocalStorage(getUserDataKey(currentUser, 'salaries'), mockSalaries)); // Salaries load is back!
      setRecurringExpenses(loadFromLocalStorage(getUserDataKey(currentUser, 'recurring_expenses'), mockRecurringExpenses));
      setRecurringIncomes(loadFromLocalStorage(getUserDataKey(currentUser, 'recurring_incomes'), mockRecurringIncomes));
      setCurrentPeriod(loadFromLocalStorage(getUserDataKey(currentUser, 'current_period'), mockPeriods[0]));
      setPeriodsHistory(loadFromLocalStorage(getUserDataKey(currentUser, 'periods_history'), []));
    } else {
      // Clear data if no user is logged in
      setTransactions([]);
      setCards([]);
      setSalaries([]); // Salaries clear is back!
      setRecurringExpenses([]);
      setRecurringIncomes([]);
      setCurrentPeriod({});
      setPeriodsHistory([]);
    }
  }, [currentUser]);

  // Save user-specific data whenever it changes
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'transactions'), transactions); }, [transactions, currentUser]);
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'cards'), cards); }, [cards, currentUser]);
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'salaries'), salaries); }, [salaries, currentUser]); // Salaries save is back!
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'recurring_expenses'), recurringExpenses); }, [recurringExpenses, currentUser]);
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'recurring_incomes'), recurringIncomes); }, [recurringIncomes, currentUser]);
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'current_period'), currentPeriod); }, [currentPeriod, currentUser]);
  useEffect(() => { if (currentUser) saveToLocalStorage(getUserDataKey(currentUser, 'periods_history'), periodsHistory); }, [periodsHistory, currentUser]);


  // Auth Handlers
  const handleLogin = (username, password) => {
    if (loginUser(username, password)) {
      setCurrentUser(username);
      setActiveTab('overview'); // Go to overview after login
    }
  };

  const handleRegister = (username, password) => {
    if (registerUser(username, password)) {
      setUsers(loadUsers()); // Update users list
      alert('Usuario registrado con éxito. Por favor, inicia sesión.');
      // Optionally, log in the new user directly: handleLogin(username, password);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleSwitchUser = (username) => {
    saveCurrentUser(username);
    setCurrentUser(username);
    setActiveTab('overview');
  };

  const handleAddUser = (username, password) => {
    if (registerUser(username, password)) {
      setUsers(loadUsers());
      alert(`Usuario ${username} creado con éxito.`);
    }
  };


  // Transaction Management
  const handleAddTransaction = (newTransaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
    }
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null); // Clear editing state after update
  };

  // Card Management
  const handleAddCard = (newCard) => {
    setCards(prevCards => [...prevCards, newCard]);
  };

  const handleUpdateCard = (updatedCard) => {
    setCards(prevCards =>
      prevCards.map(card => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta y todas sus compras asociadas?')) {
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    }
  };

  const handleAddCardPurchase = (cardId, newPurchase) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? { ...card, purchases: [...card.purchases, newPurchase] }
          : card
      )
    );
  };

  const handleUpdateCardPurchase = (cardId, updatedPurchase) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? {
              ...card,
              purchases: card.purchases.map(p =>
                p.id === updatedPurchase.id ? updatedPurchase : p
              ),
            }
          : card
      )
    );
  };

  const handleDeleteCardPurchase = (cardId, purchaseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra a cuotas?')) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId
            ? { ...card, purchases: card.purchases.filter(p => p.id !== purchaseId) }
            : card
        )
      );
    }
  };

  // Salary Management
  const handleAddSalary = (newSalary) => {
    setSalaries(prevSalaries => [...prevSalaries, newSalary]);
  };

  const handleUpdateSalary = (updatedSalary) => {
    setSalaries(prevSalaries =>
      prevSalaries.map(s => (s.id === updatedSalary.id ? updatedSalary : s))
    );
  };

  const handleDeleteSalary = (salaryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de sueldo?')) {
      setSalaries(prevSalaries => prevSalaries.filter(s => s.id !== salaryId));
    }
  };

  // Recurring Expenses Management
  const handleAddRecurringExpense = (newExpense) => {
    setRecurringExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  const handleUpdateRecurringExpense = (updatedExpense) => {
    setRecurringExpenses(prevExpenses =>
      prevExpenses.map(e => (e.id === updatedExpense.id ? updatedExpense : e))
    );
  };

  const handleDeleteRecurringExpense = (expenseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto recurrente?')) {
      setRecurringExpenses(prevExpenses => prevExpenses.filter(e => e.id !== expenseId));
    }
  };

  // Recurring Incomes Management
  const handleAddRecurringIncome = (newIncome) => {
    setRecurringIncomes(prevIncomes => [...prevIncomes, newIncome]);
  };

  const handleUpdateRecurringIncome = (updatedIncome) => {
    setRecurringIncomes(prevIncomes =>
      prevIncomes.map(i => (i.id === updatedIncome.id ? updatedIncome : i))
    );
  };

  const handleDeleteRecurringIncome = (incomeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingreso recurrente?')) {
      setRecurringIncomes(prevIncomes => prevIncomes.filter(i => i.id !== incomeId));
    }
  };

  // Period Management
  const handleUpdateCurrentPeriod = (updatedPeriod) => {
    setCurrentPeriod(updatedPeriod);
  };

  const handleAddPeriodToHistory = (period) => {
    setPeriodsHistory(prevHistory => [...prevHistory, period]);
  };

  // Handle header clicks to change active tab
  const handleHeaderClick = (type) => {
    setActiveTab(type);
  };


  const financialSummary = calculateFinancialSummary(transactions, cards, salaries, recurringExpenses, recurringIncomes);

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-end mb-4 gap-2">
          <motion.button
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-800 hidden sm:block">Calendario</span>
          </motion.button>
          <motion.button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-800 hidden sm:block">Ajustes</span>
          </motion.button>
          <UserMenu
            currentUser={currentUser}
            users={users}
            onLogout={handleLogout}
            onSwitchUser={handleSwitchUser}
            onAddUser={handleAddUser}
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header
            totalBalance={financialSummary.totalBalance}
            totalIncome={financialSummary.totalIncome}
            totalExpenses={financialSummary.totalExpenses}
            totalCardDebt={financialSummary.totalCardDebt}
            totalRecurringExpenses={financialSummary.totalRecurringExpenses}
            onHeaderClick={handleHeaderClick}
          />

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 text-center">Resumen General del Período</h2>
              <p className="text-center text-gray-600">Aquí verás un resumen consolidado de tus finanzas.</p>
              {/* Placeholder for detailed overview content */}
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                editingTransaction={editingTransaction}
                setEditingTransaction={setEditingTransaction}
              />
              <TransactionList
                transactions={transactions.filter(t => !editingTransaction || t.id !== editingTransaction.id)} // Filter out the one being edited
                onDeleteTransaction={handleDeleteTransaction}
                setEditingTransaction={setEditingTransaction}
              />
            </motion.div>
          )}

          {activeTab === 'cards' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardManager
                cards={cards}
                onAddCard={handleAddCard}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onAddCardPurchase={handleAddCardPurchase}
                onUpdateCardPurchase={handleUpdateCardPurchase}
                onDeleteCardPurchase={handleDeleteCardPurchase}
              />
            </motion.div>
          )}

          {activeTab === 'recurring' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RecurringExpensesManager
                recurringExpenses={recurringExpenses}
                onAddRecurringExpense={handleAddRecurringExpense}
                onUpdateRecurringExpense={handleUpdateRecurringExpense}
                onDeleteRecurringExpense={handleDeleteRecurringExpense}
                recurringIncomes={recurringIncomes}
                onAddRecurringIncome={handleAddRecurringIncome}
                onUpdateRecurringIncome={handleUpdateRecurringIncome}
                onDeleteRecurringIncome={handleDeleteRecurringIncome}
              />
            </motion.div>
          )}

          {activeTab === 'salary' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SalaryManager // SalaryManager is back!
                salaries={salaries}
                onAddSalary={handleAddSalary}
                onUpdateSalary={handleUpdateSalary}
                onDeleteSalary={handleDeleteSalary}
              />
            </motion.div>
          )}

          {activeTab === 'periods' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PeriodManager
                currentPeriod={currentPeriod}
                onUpdateCurrentPeriod={handleUpdateCurrentPeriod}
                onAddPeriod={handleAddPeriodToHistory}
                periodsHistory={periodsHistory}
              />
            </motion.div>
          )}

        </motion.div>
      </div>

      <AnimatePresence>
        {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} currentUser={currentUser} onSwitchUser={handleSwitchUser} />}
        {showCalendar && (
          <CalendarView
            cards={cards}
            recurringExpenses={recurringExpenses}
            recurringIncomes={recurringIncomes}
            salaries={salaries} // Pass salaries again
            onClose={() => setShowCalendar(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;