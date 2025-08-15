import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Plus, Trash2, Edit, CalendarCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SalaryManager = ({ salaries, onAddSalary, onUpdateSalary, onDeleteSalary }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0 && date) {
      const salaryData = {
        id: editingSalary ? editingSalary.id : uuidv4(),
        amount: parseFloat(amount),
        date,
        notes: notes.trim(),
      };

      if (editingSalary) {
        onUpdateSalary(salaryData);
      } else {
        onAddSalary(salaryData);
      }
      resetForm();
    } else {
      alert('Por favor, ingresa un monto y una fecha válidos para el sueldo.');
    }
  };

  const resetForm = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setEditingSalary(null);
    setShowForm(false);
  };

  const openEditForm = (salary) => {
    setEditingSalary(salary);
    setAmount(salary.amount);
    setDate(salary.date);
    setNotes(salary.notes);
    setShowForm(true);
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-600" /> Gestión de Sueldo
      </h2>

      <motion.button
        onClick={() => {
          if (!showForm) {
            setShowForm(true);
            setEditingSalary(null);
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setNotes('');
          } else {
            setShowForm(false);
            setEditingSalary(null);
          }
        }}
        className="mb-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        {showForm ? 'Cerrar Formulario' : 'Registrar Sueldo'}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-gray-50 p-6 rounded-2xl mb-6 shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{editingSalary ? 'Editar Registro de Sueldo' : 'Nuevo Registro de Sueldo'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryAmount" className="block text-sm font-medium text-gray-700 mb-1">Monto del Sueldo</label>
                <input
                  type="number"
                  step="0.01"
                  id="salaryAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 2500.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="salaryDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Recepción</label>
                <input
                  type="date"
                  id="salaryDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="salaryNotes" className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
              <textarea
                id="salaryNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Sueldo de Enero"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingSalary ? 'Actualizar Sueldo' : 'Guardar Sueldo'}
            </motion.button>
            <motion.button
              type="button"
              onClick={resetForm}
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
        {salaries.length === 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <DollarSign className="w-12 h-12 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Sin registros de sueldo!</h3>
            <p className="text-gray-500 font-medium">Registra tu sueldo para llevar un control completo de tus ingresos.</p>
          </motion.div>
        )}

        <AnimatePresence>
          {salaries.map((salary) => (
            <motion.div
              key={salary.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-md flex items-center justify-between group"
            >
              <div>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <CalendarCheck size={16} /> Sueldo del {salary.date}
                </p>
                <p className="text-sm text-gray-600 ml-6">
                  Monto: <span className="font-semibold">${salary.amount.toFixed(2)}</span>
                </p>
                {salary.notes && (
                  <p className="text-xs text-gray-500 ml-6">Notas: {salary.notes}</p>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  onClick={() => openEditForm(salary)}
                  className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  onClick={() => onDeleteSalary(salary.id)}
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
      </div>
    </motion.div>
  );
};

export default SalaryManager;