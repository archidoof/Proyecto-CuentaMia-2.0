import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Tag, CalendarDays, MessageSquare, Trash2, Edit } from 'lucide-react';
import { FaMoneyBillWave, FaMoneyBillTransfer } from 'react-icons/fa6'; // Using react-icons for specific icons

const TransactionItem = ({ transaction, onDelete, onEdit }) => {
  const isExpense = transaction.type === 'expense';
  const amountColor = isExpense ? 'text-red-600' : 'text-green-600';
  const iconBg = isExpense ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
  const Icon = isExpense ? FaMoneyBillTransfer : FaMoneyBillWave;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, layout: { duration: 0.3 } }}
      className="group bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-semibold text-gray-900 truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
          <Tag size={16} />
          <span>{transaction.category}</span>
          <CalendarDays size={16} className="ml-3" />
          <span>{transaction.date}</span>
        </div>
        {transaction.notes && (
          <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
            <MessageSquare size={16} />
            {transaction.notes}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-xl font-bold ${amountColor}`}>
          {isExpense ? '-' : '+'}${transaction.amount.toFixed(2)}
        </span>
        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={() => onEdit(transaction)}
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit size={18} />
          </motion.button>
          <motion.button
            onClick={() => onDelete(transaction.id)}
            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TransactionList = ({ transactions, onDeleteTransaction, setEditingTransaction, title = "Historial de Transacciones" }) => {
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-gray-600" /> {title}
      </h2>
      {transactions.length === 0 ? (
        <motion.div
          className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <FaMoneyBillWave className="w-12 h-12 text-blue-500" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Nada por aquí!</h3>
          <p className="text-gray-500 font-medium">Agrega tu primera transacción para empezar a ver tus movimientos.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDeleteTransaction}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionList;