import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Repeat } from 'lucide-react';

const Header = ({ totalBalance = 0, totalIncome = 0, totalExpenses = 0, totalCardDebt = 0, totalRecurringExpenses = 0, onHeaderClick }) => {
  const balanceColor = totalBalance >= 0 ? 'text-green-600' : 'text-red-600';

  const StatCard = ({ icon: Icon, label, value, colorClass, delay, onClick, type }) => (
    <motion.div
      className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      onClick={() => onClick(type)}
    >
      <Icon className={`w-5 h-5 ${colorClass} mb-1`} />
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-xl font-bold ${colorClass}`}>
        ${value.toFixed(2)}
      </span>
    </motion.div>
  );

  return (
    <motion.header
      className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mb-8 shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              CuentaMía 2.0
            </h1>
            <p className="text-gray-500 font-medium">Tu imperio financiero, bajo mi control</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full md:w-auto">
          <StatCard
            icon={Wallet}
            label="Balance Total"
            value={totalBalance}
            colorClass={balanceColor}
            delay={0.3}
            onClick={onHeaderClick}
            type="overview"
          />
          <StatCard
            icon={TrendingUp}
            label="Ingresos"
            value={totalIncome}
            colorClass="text-green-700"
            delay={0.4}
            onClick={onHeaderClick}
            type="income_transactions"
          />
          <StatCard
            icon={TrendingDown}
            label="Gastos"
            value={totalExpenses}
            colorClass="text-red-700"
            delay={0.5}
            onClick={onHeaderClick}
            type="expense_transactions"
          />
          <StatCard
            icon={CreditCard}
            label="Deuda Tarjetas"
            value={totalCardDebt}
            colorClass="text-purple-700"
            delay={0.6}
            onClick={onHeaderClick}
            type="cards"
          />
          <StatCard
            icon={Repeat}
            label="Gastos Recurrentes"
            value={totalRecurringExpenses}
            colorClass="text-orange-700"
            delay={0.7}
            onClick={onHeaderClick}
            type="recurring"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;