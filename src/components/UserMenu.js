import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Users, ChevronDown, Plus } from 'lucide-react';

const UserMenu = ({ currentUser, users, onLogout, onSwitchUser, onAddUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (newUsername.trim() && newPassword.trim()) {
      onAddUser(newUsername.trim(), newPassword.trim());
      setNewUsername('');
      setNewPassword('');
      setShowAddUserForm(false);
    }
  };

  return (
    <div className="relative z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <User className="w-5 h-5 text-gray-700" />
        <span className="font-medium text-gray-800 hidden sm:block">{currentUser}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg py-2"
          >
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              Sesión actual: <span className="font-semibold text-gray-800">{currentUser}</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <div className="px-4 py-2 text-sm text-gray-500">Cambiar de Usuario</div>
            {users.filter(u => u.username !== currentUser).map((user) => (
              <button
                key={user.username}
                onClick={() => { onSwitchUser(user.username); setIsOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5" />
                {user.username}
              </button>
            ))}

            <button
              onClick={() => setShowAddUserForm(!showAddUserForm)}
              className="flex items-center gap-3 w-full px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showAddUserForm ? 'Cerrar Formulario' : 'Agregar Nuevo Usuario'}
            </button>

            <AnimatePresence>
              {showAddUserForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAddUserSubmit}
                  className="px-4 py-2 space-y-2 border-t border-gray-100 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Nuevo Usuario"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Crear Usuario
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;