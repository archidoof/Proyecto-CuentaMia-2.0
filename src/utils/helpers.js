import { v4 as uuidv4 } from 'uuid';

export const calculateFinancialSummary = (transactions, cards, salaries, recurringExpenses, recurringIncomes) => {
  let totalIncome = salaries.reduce((sum, s) => sum + s.amount, 0); // Salaries are back!
  totalIncome += recurringIncomes.reduce((sum, ri) => {
    // For simplicity, assuming all recurring incomes are monthly for this sum
    if (ri.frequency === 'monthly') return sum + ri.amount;
    if (ri.frequency === 'yearly') return sum + (ri.amount / 12);
    if (ri.frequency === 'weekly') return sum + (ri.amount * 4); // Approx 4 weeks in a month
    return sum;
  }, 0);
  totalIncome += transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);


  let totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate total card debt (remaining value of purchases)
  let totalCardDebt = 0;
  cards.forEach(card => {
    card.purchases.forEach(purchase => {
      const remainingInstallments = purchase.installments - purchase.paidInstallments;
      if (remainingInstallments > 0) {
        totalCardDebt += purchase.installmentValue * remainingInstallments;
      }
    });
  });

  // Calculate total recurring expenses (e.g., for a monthly overview)
  let totalRecurringExpensesAmount = recurringExpenses.reduce((sum, re) => {
    if (re.frequency === 'monthly') return sum + re.amount;
    if (re.frequency === 'yearly') return sum + (re.amount / 12);
    if (re.frequency === 'weekly') return sum + (re.amount * 4); // Approx 4 weeks in a month
    return sum;
  }, 0);


  const totalBalance = totalIncome - totalExpenses - totalCardDebt - totalRecurringExpensesAmount; // Simplified balance

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    totalCardDebt,
    totalRecurringExpenses: totalRecurringExpensesAmount,
  };
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return defaultValue;
  }
};

// Helper to get current date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Mock data for initial load if local storage is empty
export const mockTransactions = [
  { id: uuidv4(), type: 'expense', description: 'Café', amount: 3.50, category: 'Alimentos', date: getTodayDate(), notes: '' },
  { id: uuidv4(), type: 'income', description: 'Venta de libro', amount: 25.00, category: 'Ventas', date: getTodayDate(), notes: '' },
  { id: uuidv4(), type: 'expense', description: 'Transporte', amount: 10.00, category: 'Transporte', date: getTodayDate(), notes: 'Bus al trabajo' },
];

export const mockCards = [
  {
    id: uuidv4(),
    name: 'Visa Principal',
    limit: 5000.00,
    closingDay: 25, // Added closing day
    purchases: [
      { id: uuidv4(), description: 'Monitor', amount: 300.00, installments: 6, paidInstallments: 0, date: getTodayDate(), autoCalculateInstallment: true, installmentValue: 50.00 },
      { id: uuidv4(), description: 'Cena Aniversario', amount: 80.00, installments: 3, paidInstallments: 0, date: getTodayDate(), autoCalculateInstallment: false, installmentValue: 30.00 },
    ]
  },
  {
    id: uuidv4(),
    name: 'Mastercard Viajes',
    limit: 2000.00,
    closingDay: 10, // Added closing day
    purchases: []
  }
];

export const mockSalaries = [ // Salaries are back!
  { id: uuidv4(), amount: 2500.00, date: getTodayDate(), notes: 'Sueldo de este mes' },
];

export const mockRecurringExpenses = [
  { id: uuidv4(), name: 'Alquiler', amount: 800.00, frequency: 'monthly', nextDueDate: getTodayDate() },
  { id: uuidv4(), name: 'Netflix', amount: 15.99, frequency: 'monthly', nextDueDate: getTodayDate() },
  { id: uuidv4(), name: 'Seguro Coche', amount: 360.00, frequency: 'yearly', nextDueDate: getTodayDate() },
];

export const mockRecurringIncomes = [
  { id: uuidv4(), name: 'Renta Apartamento', amount: 500.00, frequency: 'monthly', nextDueDate: getTodayDate() },
];

export const mockPeriods = [
  { id: uuidv4(), name: 'Período Actual', startDate: getTodayDate(), endDate: getTodayDate() },
];