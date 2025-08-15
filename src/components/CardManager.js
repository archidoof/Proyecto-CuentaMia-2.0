import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, Edit, Banknote, CalendarDays, ShoppingBag, Percent } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CardManager = ({ cards, onAddCard, onUpdateCard, onDeleteCard, onAddCardPurchase, onUpdateCardPurchase, onDeleteCardPurchase }) => {
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardLimit, setNewCardLimit] = useState('');
  const [newCardClosingDay, setNewCardClosingDay] = useState(''); // New state for closing day
  const [editingCard, setEditingCard] = useState(null);

  const [showAddPurchaseForm, setShowAddPurchaseForm] = useState(false);
  const [currentCardIdForPurchase, setCurrentCardIdForPurchase] = useState(null);
  const [newPurchaseDescription, setNewPurchaseDescription] = useState('');
  const [newPurchaseAmount, setNewPurchaseAmount] = useState('');
  const [newPurchaseInstallments, setNewPurchaseInstallments] = useState('');
  const [newPurchaseDate, setNewPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPurchaseAutoCalculateInstallment, setNewPurchaseAutoCalculateInstallment] = useState(true); // New state
  const [newPurchaseInstallmentValue, setNewPurchaseInstallmentValue] = useState(''); // New state
  const [editingPurchase, setEditingPurchase] = useState(null);

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCardName.trim() && parseFloat(newCardLimit) > 0 && parseInt(newCardClosingDay) > 0 && parseInt(newCardClosingDay) <= 31) {
      onAddCard({
        id: uuidv4(),
        name: newCardName.trim(),
        limit: parseFloat(newCardLimit),
        closingDay: parseInt(newCardClosingDay), // Save closing day
        purchases: []
      });
      setNewCardName('');
      setNewCardLimit('');
      setNewCardClosingDay('');
      setShowAddCardForm(false);
    } else {
      alert('Por favor, completa todos los campos de la tarjeta correctamente. El día de cierre debe ser entre 1 y 31.');
    }
  };

  const handleUpdateCard = (e) => {
    e.preventDefault();
    if (editingCard && editingCard.name.trim() && parseFloat(editingCard.limit) > 0 && parseInt(editingCard.closingDay) > 0 && parseInt(editingCard.closingDay) <= 31) {
      onUpdateCard(editingCard);
      setEditingCard(null);
      setShowAddCardForm(false); // Close form after editing
    } else {
      alert('Por favor, completa todos los campos de la tarjeta correctamente. El día de cierre debe ser entre 1 y 31.');
    }
  };

  const handleAddPurchase = (e) => {
    e.preventDefault();
    if (newPurchaseDescription.trim() && parseFloat(newPurchaseAmount) > 0 && parseInt(newPurchaseInstallments) > 0 && currentCardIdForPurchase) {
      let calculatedInstallmentValue;
      if (newPurchaseAutoCalculateInstallment) {
        calculatedInstallmentValue = (parseFloat(newPurchaseAmount) / parseInt(newPurchaseInstallments));
      } else {
        calculatedInstallmentValue = parseFloat(newPurchaseInstallmentValue);
        if (isNaN(calculatedInstallmentValue) || calculatedInstallmentValue <= 0) {
          alert('Por favor, ingresa un valor de cuota válido.');
          return;
        }
      }

      onAddCardPurchase(currentCardIdForPurchase, {
        id: uuidv4(),
        description: newPurchaseDescription.trim(),
        amount: parseFloat(newPurchaseAmount),
        installments: parseInt(newPurchaseInstallments),
        paidInstallments: 0,
        date: newPurchaseDate,
        autoCalculateInstallment: newPurchaseAutoCalculateInstallment,
        installmentValue: calculatedInstallmentValue,
      });
      resetPurchaseForm();
    } else {
      alert('Por favor, completa todos los campos de la compra correctamente.');
    }
  };

  const handleUpdatePurchase = (e) => {
    e.preventDefault();
    if (editingPurchase && editingPurchase.description.trim() && parseFloat(newPurchaseAmount) > 0 && parseInt(newPurchaseInstallments) > 0 && currentCardIdForPurchase) {
      let calculatedInstallmentValue;
      if (newPurchaseAutoCalculateInstallment) {
        calculatedInstallmentValue = (parseFloat(newPurchaseAmount) / parseInt(newPurchaseInstallments));
      } else {
        calculatedInstallmentValue = parseFloat(newPurchaseInstallmentValue);
        if (isNaN(calculatedInstallmentValue) || calculatedInstallmentValue <= 0) {
          alert('Por favor, ingresa un valor de cuota válido.');
          return;
        }
      }

      onUpdateCardPurchase(currentCardIdForPurchase, {
        ...editingPurchase,
        description: newPurchaseDescription.trim(),
        amount: parseFloat(newPurchaseAmount),
        installments: parseInt(newPurchaseInstallments),
        date: newPurchaseDate,
        autoCalculateInstallment: newPurchaseAutoCalculateInstallment,
        installmentValue: calculatedInstallmentValue,
      });
      resetPurchaseForm();
    } else {
      alert('Por favor, completa todos los campos de la compra correctamente.');
    }
  };

  const resetPurchaseForm = () => {
    setNewPurchaseDescription('');
    setNewPurchaseAmount('');
    setNewPurchaseInstallments('');
    setNewPurchaseDate(new Date().toISOString().split('T')[0]);
    setNewPurchaseAutoCalculateInstallment(true);
    setNewPurchaseInstallmentValue('');
    setEditingPurchase(null);
    setShowAddPurchaseForm(false);
    setCurrentCardIdForPurchase(null);
  };

  const openEditCardForm = (card) => {
    setEditingCard(card);
    setNewCardName(card.name);
    setNewCardLimit(card.limit);
    setNewCardClosingDay(card.closingDay);
    setShowAddCardForm(true);
  };

  const openAddPurchaseForm = (cardId) => {
    setCurrentCardIdForPurchase(cardId);
    setEditingPurchase(null);
    setNewPurchaseDescription('');
    setNewPurchaseAmount('');
    setNewPurchaseInstallments('');
    setNewPurchaseDate(new Date().toISOString().split('T')[0]);
    setNewPurchaseAutoCalculateInstallment(true);
    setNewPurchaseInstallmentValue('');
    setShowAddPurchaseForm(true);
  };

  const openEditPurchaseForm = (cardId, purchase) => {
    setCurrentCardIdForPurchase(cardId);
    setEditingPurchase(purchase);
    setNewPurchaseDescription(purchase.description);
    setNewPurchaseAmount(purchase.amount);
    setNewPurchaseInstallments(purchase.installments);
    setNewPurchaseDate(purchase.date);
    setNewPurchaseAutoCalculateInstallment(purchase.autoCalculateInstallment || true);
    setNewPurchaseInstallmentValue(purchase.installmentValue || '');
    setShowAddPurchaseForm(true);
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-blue-600" /> Gestión de Tarjetas
      </h2>

      <motion.button
        onClick={() => { setShowAddCardForm(!showAddCardForm); setEditingCard(null); setNewCardName(''); setNewCardLimit(''); setNewCardClosingDay(''); }}
        className="mb-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        {showAddCardForm ? 'Cerrar Formulario' : 'Agregar Nueva Tarjeta'}
      </motion.button>

      <AnimatePresence>
        {showAddCardForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={editingCard ? handleUpdateCard : handleAddCard}
            className="bg-gray-50 p-6 rounded-2xl mb-6 shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{editingCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}</h3>
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tarjeta</label>
              <input
                type="text"
                id="cardName"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                placeholder="Ej: Visa Banco X"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardLimit" className="block text-sm font-medium text-gray-700 mb-1">Límite de Crédito</label>
                <input
                  type="number"
                  step="0.01"
                  id="cardLimit"
                  value={newCardLimit}
                  onChange={(e) => setNewCardLimit(e.target.value)}
                  placeholder="Ej: 5000.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="cardClosingDay" className="block text-sm font-medium text-gray-700 mb-1">Día de Cierre (1-31)</label>
                <input
                  type="number"
                  id="cardClosingDay"
                  value={newCardClosingDay}
                  onChange={(e) => setNewCardClosingDay(e.target.value)}
                  placeholder="Ej: 25"
                  min="1"
                  max="31"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
              {editingCard ? 'Actualizar Tarjeta' : 'Guardar Tarjeta'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPurchaseForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={editingPurchase ? handleUpdatePurchase : handleAddPurchase}
            className="bg-blue-50 p-6 rounded-2xl mb-6 shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-4">{editingPurchase ? 'Editar Compra' : 'Nueva Compra a Cuotas'}</h3>
            <div>
              <label htmlFor="purchaseDescription" className="block text-sm font-medium text-blue-700 mb-1">Descripción</label>
              <input
                type="text"
                id="purchaseDescription"
                value={newPurchaseDescription}
                onChange={(e) => setNewPurchaseDescription(e.target.value)}
                placeholder="Ej: Laptop nueva"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="purchaseAmount" className="block text-sm font-medium text-blue-700 mb-1">Monto Total</label>
                <input
                  type="number"
                  step="0.01"
                  id="purchaseAmount"
                  value={newPurchaseAmount}
                  onChange={(e) => setNewPurchaseAmount(e.target.value)}
                  placeholder="Ej: 1200.00"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="purchaseInstallments" className="block text-sm font-medium text-blue-700 mb-1">Cuotas</label>
                <input
                  type="number"
                  id="purchaseInstallments"
                  value={newPurchaseInstallments}
                  onChange={(e) => setNewPurchaseInstallments(e.target.value)}
                  placeholder="Ej: 12"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-blue-700 mb-1">Fecha de Compra</label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={newPurchaseDate}
                  onChange={(e) => setNewPurchaseDate(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoCalculateInstallment"
                checked={newPurchaseAutoCalculateInstallment}
                onChange={(e) => setNewPurchaseAutoCalculateInstallment(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoCalculateInstallment" className="text-sm font-medium text-blue-700">
                Calcular cuota automáticamente (sin interés)
              </label>
            </div>

            {!newPurchaseAutoCalculateInstallment && (
              <div>
                <label htmlFor="installmentValue" className="block text-sm font-medium text-blue-700 mb-1">Valor de Cuota (con interés)</label>
                <input
                  type="number"
                  step="0.01"
                  id="installmentValue"
                  value={newPurchaseInstallmentValue}
                  onChange={(e) => setNewPurchaseInstallmentValue(e.target.value)}
                  placeholder="Ej: 110.00"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required={!newPurchaseAutoCalculateInstallment}
                />
              </div>
            )}

            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingPurchase ? 'Actualizar Compra' : 'Guardar Compra'}
            </motion.button>
            <motion.button
              type="button"
              onClick={resetPurchaseForm}
              className="w-full px-4 py-2 rounded-lg font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {cards.length === 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <CreditCard className="w-12 h-12 text-purple-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Sin tarjetas aún!</h3>
            <p className="text-gray-500 font-medium">Agrega tu primera tarjeta para empezar a gestionar tus compras a cuotas.</p>
          </motion.div>
        )}

        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" /> {card.name}
                </h3>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => openEditCardForm(card)}
                    className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => onDeleteCard(card.id)}
                    className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">Límite: <span className="font-semibold">${(card.limit || 0).toFixed(2)}</span></p>
              <p className="text-gray-600 mb-4">Día de Cierre: <span className="font-semibold">{card.closingDay || 'N/A'}</span></p>


              <motion.button
                onClick={() => openAddPurchaseForm(card.id)}
                className="mb-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 bg-purple-500 text-white shadow-md hover:shadow-lg hover:scale-105 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                Agregar Compra a Cuotas
              </motion.button>

              {card.purchases.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No hay compras a cuotas registradas para esta tarjeta.</p>
              ) : (
                <div className="space-y-3">
                  {card.purchases.map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          <ShoppingBag size={16} /> {purchase.description}
                        </p>
                        <p className="text-sm text-gray-600 ml-6">
                          Total: ${(purchase.amount || 0).toFixed(2)} en {purchase.installments} cuotas
                        </p>
                        <p className="text-sm text-gray-600 ml-6">
                          Valor Cuota: ${(purchase.installmentValue || 0).toFixed(2)}
                          {purchase.autoCalculateInstallment ? ' (sin interés)' : ' (con interés)'}
                        </p>
                        <p className="text-xs text-gray-500 ml-6">
                          Pagadas: {purchase.paidInstallments} / Faltan: {purchase.installments - purchase.paidInstallments}
                        </p>
                        <p className="text-xs text-gray-500 ml-6">
                          Fecha: {purchase.date}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          onClick={() => onUpdateCardPurchase(card.id, { ...purchase, paidInstallments: purchase.paidInstallments + 1 })}
                          disabled={purchase.paidInstallments >= purchase.installments}
                          className="p-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Banknote size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => openEditPurchaseForm(card.id, purchase)}
                          className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => onDeleteCardPurchase(card.id, purchase.id)}
                          className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CardManager;