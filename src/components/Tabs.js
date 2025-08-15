import React from 'react';
import { motion } from 'framer-motion';

const Tabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', name: 'Resumen General' },
    { id: 'transactions', name: 'Transacciones' },
    { id: 'cards', name: 'Tarjetas' },
    { id: 'recurring', name: 'Recurrentes' },
    { id: 'salary', name: 'Sueldo' },
    { id: 'periods', name: 'Períodos' }, // New tab for period management
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full p-1 shadow-lg flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;