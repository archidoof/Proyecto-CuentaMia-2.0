import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Plus, Trash2, Edit, CalendarClock, TrendingUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const RecurringExpensesManager = ({ recurringExpenses, onAddRecurringExpense, onUpdateRecurringExpense, onDeleteRecurringExpense, recurringIncomes, onAddRecurringIncome, onUpdateRecurringIncome, onDeleteRecurringIncome }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseFrequency, setExpenseFrequency] = useState('monthly'); // monthly, yearly, weekly
  const [expenseNextDueDate, setExpenseNextDueDate] = useState(new Date().toISOString().split('T')[0]);

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeFrequency, setIncomeFrequency] = useState('monthly');
  const [incomeNextDueDate, setIncomeNextDueDate] = useState(new Date().toISOString().split('T')[0]);


  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (expenseName.trim() && expenseAmount > 0 && expenseFrequency && expenseNextDueDate) {
      const expenseData = {
        id: editingExpense ? editingExpense.id : uuidv4(),
        name: expenseName.trim(),
        amount: parseFloat(expenseAmount),
        frequency: expenseFrequency,
        nextDueDate: expenseNextDueDate,
      };

      if (editingExpense) {
        onUpdateRecurringExpense(expenseData);
      } else {
        onAddRecurringExpense(expenseData);
      }
      resetExpenseForm();
    } else {
      alert('Por favor, completa todos los campos del gasto recurrente.');
    }
  };

  const resetExpenseForm = () => {
    setExpenseName('');
    setExpenseAmount('');
    setExpenseFrequency('monthly');
    setExpenseNextDueDate(new Date().toISOString().split('T')[0]);
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const openEditExpenseForm = (expense) => {
    setEditingExpense(expense);
    setExpenseName(expense.name);
    setExpenseAmount(expense.amount);
    setExpenseFrequency(expense.frequency);
    setExpenseNextDueDate(expense.nextDueDate);
    setShowExpenseForm(true);
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (incomeName.trim() && incomeAmount > 0 && incomeFrequency && incomeNextDueDate) {
      const incomeData = {
        id: editingIncome ? editingIncome.id : uuidv4(),
        name: incomeName.trim(),
        amount: parseFloat(incomeAmount),
        frequency: incomeFrequency,
        nextDueDate: incomeNextDueDate,
      };

      if (editingIncome) {
        onUpdateRecurringIncome(incomeData);
      } else {
        onAddRecurringIncome(incomeData);
      }
      resetIncomeForm();
    } else {
      alert('Por favor, completa todos los campos del ingreso recurrente.');
    }
  };

  const resetIncomeForm = () => {
    setIncomeName('');
    setIncomeAmount('');
    setIncomeFrequency('monthly');
    setIncomeNextDueDate(new Date().toISOString().split('T')[0]);
    setEditingIncome(null);
    setShowIncomeForm(false);
  };

  const openEditIncomeForm = (income) => {
    setEditingIncome(income);
    setIncomeName(income.name);
    setIncomeAmount(income.amount);
    setIncomeFrequency(income.frequency);
    setIncomeNextDueDate(income.nextDueDate);
    setShowIncomeForm(true);
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Repeat className="w-6 h-6 text-orange-600" /> Gestión de Recurrentes
      </h2>

      {/* Recurring Expenses Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-red-600" /> Gastos Recurrentes
      </h3>
      <motion.button
        onClick={() => {
          if (!showExpenseForm) {
            setShowExpenseForm(true);
            setEditingExpense(null);
            setExpenseName('');
            setExpenseAmount('');
            setExpenseFrequency('monthly');
            setExpenseNextDueDate(new Date().toISOString().split('T')[0]);
          } else {
            setShowExpenseForm(false);
            setEditingExpense(null);
          }
        }}
        className="mb-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        {showExpenseForm ? 'Cerrar Formulario' : 'Agregar Gasto Recurrente'}
      </motion.button>

      <AnimatePresence>
        {showExpenseForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleExpenseSubmit}
            className="bg-gray-50 p-6 rounded-2xl mb-6 shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{editingExpense ? 'Editar Gasto Recurrente' : 'Nuevo Gasto Recurrente'}</h3>
            <div>
              <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Gasto</label>
              <input
                type="text"
                id="expenseName"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="Ej: Alquiler, Suscripción Netflix"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="expenseAmount" className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  id="expenseAmount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Ej: 500.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="expenseFrequency" className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                <select
                  id="expenseFrequency"
                  value={expenseFrequency}
                  onChange={(e) => setExpenseFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="monthly">Mensual</option>
                  <option value="yearly">Anual</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
              <div>
                <label htmlFor="expenseNextDueDate" className="block text-sm font-medium text-gray-700 mb-1">Próxima Fecha de Vencimiento</label>
                <input
                  type="date"
                  id="expenseNextDueDate"
                  value={expenseNextDueDate}
                  onChange={(e) => setExpenseNextDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingExpense ? 'Actualizar Gasto' : 'Guardar Gasto'}
            </motion.button>
            <motion.button
              type="button"
              onClick={resetExpenseForm}
              className="w-full px-4 py-2 rounded-lg font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4 mb-8">
        {recurringExpenses.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No hay gastos recurrentes registrados.</p>
        ) : (
          <AnimatePresence>
            {recurringExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-md flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <CalendarClock size={16} /> {expense.name}
                  </p>
                  <p className="text-sm text-gray-600 ml-6">
                    Monto: <span className="font-semibold">${expense.amount.toFixed(2)}</span> / {expense.frequency === 'monthly' ? 'Mensual' : expense.frequency === 'yearly' ? 'Anual' : 'Semanal'}
                  </p>
                  <p className="text-xs text-gray-500 ml-6">
                    Próximo vencimiento: {expense.nextDueDate}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => openEditExpenseForm(expense)}
                    className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => onDeleteRecurringExpense(expense.id)}
                    className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Recurring Incomes Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-600" /> Ingresos Recurrentes
      </h3>
      <motion.button
        onClick={() => {
          if (!showIncomeForm) {
            setShowIncomeForm(true);
            setEditingIncome(null);
            setIncomeName('');
            setIncomeAmount('');
            setIncomeFrequency('monthly');
            setIncomeNextDueDate(new Date().toISOString().split('T')[0]);
          } else {
            setShowIncomeForm(false);
            setEditingIncome(null);
          }
        }}
        className="mb-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        {showIncomeForm ? 'Cerrar Formulario' : 'Agregar Ingreso Recurrente'}
      </motion.button>

      <AnimatePresence>
        {showIncomeForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleIncomeSubmit}
            className="bg-gray-50 p-6 rounded-2xl mb-6 shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{editingIncome ? 'Editar Ingreso Recurrente' : 'Nuevo Ingreso Recurrente'}</h3>
            <div>
              <label htmlFor="incomeName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Ingreso</label>
              <input
                type="text"
                id="incomeName"
                value={incomeName}
                onChange={(e) => setIncomeName(e.target.value)}
                placeholder="Ej: Renta de Propiedad, Dividendo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="incomeAmount" className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  id="incomeAmount"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="Ej: 100.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="incomeFrequency" className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                <select
                  id="incomeFrequency"
                  value={incomeFrequency}
                  onChange={(e) => setIncomeFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="monthly">Mensual</option>
                  <option value="yearly">Anual</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
              <div>
                <label htmlFor="incomeNextDueDate" className="block text-sm font-medium text-gray-700 mb-1">Próxima Fecha de Recepción</label>
                <input
                  type="date"
                  id="incomeNextDueDate"
                  value={incomeNextDueDate}
                  onChange={(e) => setIncomeNextDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingIncome ? 'Actualizar Ingreso' : 'Guardar Ingreso'}
            </motion.button>
            <motion.button
              type="button"
              onClick={resetIncomeForm}
              className="w-full px-4 py-2 rounded-lg font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {recurringIncomes.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No hay ingresos recurrentes registrados.</p>
        ) : (
          <AnimatePresence>
            {recurringIncomes.map((income) => (
              <motion.div
                key={income.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-md flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <CalendarClock size={16} /> {income.name}
                  </p>
                  <p className="text-sm text-gray-600 ml-6">
                    Monto: <span className="font-semibold">${income.amount.toFixed(2)}</span> / {income.frequency === 'monthly' ? 'Mensual' : income.frequency === 'yearly' ? 'Anual' : 'Semanal'}
                  </p>
                  <p className="text-xs text-gray-500 ml-6">
                    Próxima recepción: {income.nextDueDate}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => openEditIncomeForm(income)}
                    className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => onDeleteRecurringIncome(income.id)}
                    className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default RecurringExpensesManager;