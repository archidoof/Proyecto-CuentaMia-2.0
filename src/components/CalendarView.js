import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, CreditCard, DollarSign, Repeat, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CalendarView = ({ cards, recurringExpenses, recurringIncomes, salaries, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: '',
    title: '',
    date: '',
    type: 'custom', // 'custom', 'salary', 'card_closing', 'recurring_expense', 'recurring_income'
    amount: null,
    notes: '',
  });

  useEffect(() => {
    const generateEvents = () => {
      const newEvents = [];
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth(); // 0-indexed

      // Card Closing Dates
      cards.forEach(card => {
        const closingDay = card.closingDay;
        if (closingDay) {
          // Check for current month
          let date = new Date(year, month, closingDay);
          if (date.getMonth() === month) { // Ensure day exists in month
            newEvents.push({
              id: uuidv4(),
              title: `Cierre Tarjeta: ${card.name}`,
              date: date.toISOString().split('T')[0],
              type: 'card_closing',
              notes: `Día de cierre para ${card.name}.`,
              icon: CreditCard,
              color: 'text-purple-600'
            });
          }
          // Also check for next month if closing day is in the past for current month
          // This ensures we always show the *next* relevant closing date
          const today = new Date();
          const currentDay = today.getDate();
          if (closingDay <= currentDay && month === today.getMonth() && year === today.getFullYear()) {
            let nextMonthDate = new Date(year, month + 1, closingDay);
            if (nextMonthDate.getMonth() === month + 1) { // Ensure day exists in next month
               newEvents.push({
                id: uuidv4(),
                title: `Cierre Tarjeta: ${card.name}`,
                date: nextMonthDate.toISOString().split('T')[0],
                type: 'card_closing',
                notes: `Próximo día de cierre para ${card.name}.`,
                icon: CreditCard,
                color: 'text-purple-600'
              });
            }
          }
        }
      });

      // Recurring Expenses
      recurringExpenses.forEach(expense => {
        // Simplified: just add the next due date if it's in the current month
        const expenseDate = new Date(expense.nextDueDate);
        if (expenseDate.getFullYear() === year && expenseDate.getMonth() === month) {
          newEvents.push({
            id: uuidv4(),
            title: `${expense.name} (Gasto Recurrente)`,
            date: expense.nextDueDate,
            type: 'recurring_expense',
            amount: expense.amount,
            notes: `Monto: $${expense.amount.toFixed(2)}`,
            icon: Repeat,
            color: 'text-red-600'
          });
        }
      });

      // Recurring Incomes
      recurringIncomes.forEach(income => {
        const incomeDate = new Date(income.nextDueDate);
        if (incomeDate.getFullYear() === year && incomeDate.getMonth() === month) {
          newEvents.push({
            id: uuidv4(),
            title: `${income.name} (Ingreso Recurrente)`,
            date: income.nextDueDate,
            type: 'recurring_income',
            amount: income.amount,
            notes: `Monto: $${income.amount.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-green-600'
          });
        }
      });

      // Salaries (simplified: just add the last recorded salary date if it's in the current month)
      salaries.forEach(salary => {
        const salaryDate = new Date(salary.date);
        if (salaryDate.getFullYear() === year && salaryDate.getMonth() === month) {
          newEvents.push({
            id: uuidv4(),
            title: `Cobro de Sueldo`,
            date: salary.date,
            type: 'salary',
            amount: salary.amount,
            notes: `Monto: $${salary.amount.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-blue-600'
          });
        }
      });

      setEvents(newEvents);
    };

    generateEvents();
  }, [currentMonth, cards, recurringExpenses, recurringIncomes, salaries]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const startDay = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const days = [];

    // Fill leading empty days
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Fill days with events
    for (let i = 1; i <= totalDays; i++) {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateString);

      days.push(
        <div key={i} className="p-2 border border-gray-200 rounded-lg flex flex-col items-center justify-start min-h-[80px] relative overflow-hidden">
          <span className="font-bold text-lg">{i}</span>
          <div className="mt-1 space-y-0.5 w-full">
            {dayEvents.map(event => {
              const EventIcon = event.icon || Calendar;
              return (
                <div key={event.id} className={`flex items-center gap-1 text-xs ${event.color || 'text-gray-700'} bg-gray-100 rounded-md p-0.5 truncate`}>
                  <EventIcon size={12} />
                  <span className="truncate">{event.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title.trim() && newEvent.date) {
      setEvents(prev => [...prev, { ...newEvent, id: uuidv4() }]);
      setNewEvent({ id: '', title: '', date: '', type: 'custom', amount: null, notes: '' });
      setShowAddEventForm(false);
    } else {
      alert('Por favor, completa el título y la fecha del evento.');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl w-full max-w-5xl relative max-h-[90vh] overflow-y-auto" // Added max-h and overflow
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-teal-600" /> Calendario Financiero
        </h2>

        <div className="flex justify-between items-center mb-6">
          <motion.button
            onClick={handlePrevMonth}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mes Anterior
          </motion.button>
          <h3 className="text-2xl font-bold text-gray-800">
            {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <motion.button
            onClick={handleNextMonth}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mes Siguiente
          </motion.button>
        </div>

        <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-4">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>

        <motion.button
          onClick={() => setShowAddEventForm(!showAddEventForm)}
          className="mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          {showAddEventForm ? 'Cerrar Formulario' : 'Agregar Evento Manual'}
        </motion.button>

        <AnimatePresence>
          {showAddEventForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAddEvent}
              className="bg-gray-50 p-6 rounded-2xl mt-6 shadow-inner space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuevo Evento</h3>
              <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  id="eventTitle"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ej: Pago de luz"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  id="eventDate"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="w-full px-4 py-2 rounded-lg font-semibold bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Guardar Evento
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CalendarView;