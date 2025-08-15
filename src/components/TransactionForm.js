import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Tag, CalendarDays, MessageSquare, Edit } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TransactionForm = ({ onAddTransaction, onUpdateTransaction, editingTransaction, setEditingTransaction }) => {
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes);
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const categories = {
    expense: ['Alimentos', 'Transporte', 'Vivienda', 'Entretenimiento', 'Servicios', 'Compras', 'Salud', 'Educación', 'Otros'],
    income: ['Salario', 'Freelance', 'Inversiones', 'Regalo', 'Ventas', 'Otros'] // Added 'Salario' category
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const transactionData = {
      id: editingTransaction ? editingTransaction.id : uuidv4(),
      type,
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim(),
      createdAt: editingTransaction ? editingTransaction.createdAt : new Date().toISOString(),
    };

    if (editingTransaction) {
      onUpdateTransaction(transactionData);
    } else {
      onAddTransaction(transactionData);
    }
    resetForm();
  };

  const resetForm = () => {
    setType('expense');
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setEditingTransaction(null);
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        {editingTransaction ? <Edit className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
        {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            type="button"
            onClick={() => setType('income')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              type === 'income'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ingreso
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setType('expense')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              type === 'expense'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Gasto
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Monto"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium"
              required
            />
          </div>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium"
              required
            />
          </div>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium appearance-none"
              required
            >
              <option value="" disabled>Selecciona una categoría</option>
              {categories[type].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium"
              required
            />
          </div>
          <div className="relative md:col-span-2">
            <MessageSquare className="absolute left-4 top-4 text-gray-400" size={20} />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas (opcional)"
              rows="3"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium"
            ></textarea>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingTransaction ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingTransaction ? 'Actualizar Transacción' : 'Agregar Transacción'}
          </motion.button>
          {editingTransaction && (
            <motion.button
              type="button"
              onClick={resetForm}
              className="px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gray-300 text-gray-800 shadow-lg hover:shadow-xl hover:scale-105"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default TransactionForm;