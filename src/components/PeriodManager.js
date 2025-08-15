import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Settings, History } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const PeriodManager = ({ currentPeriod, onUpdateCurrentPeriod, onAddPeriod, periodsHistory }) => {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState(currentPeriod.name);
  const [newPeriodStartDate, setNewPeriodStartDate] = useState(currentPeriod.startDate);
  const [newPeriodEndDate, setNewPeriodEndDate] = useState(currentPeriod.endDate);

  const handleUpdatePeriod = (e) => {
    e.preventDefault();
    if (newPeriodName.trim() && newPeriodStartDate && newPeriodEndDate) {
      onUpdateCurrentPeriod({
        name: newPeriodName.trim(),
        startDate: newPeriodStartDate,
        endDate: newPeriodEndDate,
      });
      setShowConfigForm(false);
    } else {
      alert('Por favor, completa todos los campos del período.');
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-teal-600" /> Gestión de Períodos
      </h2>

      <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-teal-800 mb-2">Período Actual: {currentPeriod.name}</h3>
        <p className="text-gray-700">
          Del <span className="font-medium">{currentPeriod.startDate}</span> al <span className="font-medium">{currentPeriod.endDate}</span>
        </p>
        <motion.button
          onClick={() => setShowConfigForm(!showConfigForm)}
          className="mt-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 bg-teal-500 text-white shadow-md hover:shadow-lg hover:scale-105 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-4 h-4" />
          {showConfigForm ? 'Cerrar Configuración' : 'Configurar Período Actual'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showConfigForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleUpdatePeriod}
            className="bg-gray-50 p-6 rounded-2xl mb-6 shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Configurar Período</h3>
            <div>
              <label htmlFor="periodName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Período</label>
              <input
                type="text"
                id="periodName"
                value={newPeriodName}
                onChange={(e) => setNewPeriodName(e.target.value)}
                placeholder="Ej: Julio 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="periodStartDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  id="periodStartDate"
                  value={newPeriodStartDate}
                  onChange={(e) => setNewPeriodStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="periodEndDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                <input
                  type="date"
                  id="periodEndDate"
                  value={newPeriodEndDate}
                  onChange={(e) => setNewPeriodEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold bg-teal-500 text-white hover:bg-teal-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Actualizar Período
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-gray-600" /> Historial de Períodos
      </h3>
      {periodsHistory.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No hay períodos finalizados aún.</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {periodsHistory.map((period) => (
              <motion.div
                key={period.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <p className="font-medium text-gray-900">{period.name}</p>
                <p className="text-sm text-gray-600">
                  Del {period.startDate} al {period.endDate}
                </p>
                {/* Aquí se podría añadir un botón para ver el informe de este período */}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default PeriodManager;