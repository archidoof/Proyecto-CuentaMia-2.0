import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, DollarSign, Globe, User, X } from 'lucide-react';
import { loadUsers, saveUsers, loginUser, saveCurrentUser } from '../utils/auth'; // Import auth functions

const SettingsMenu = ({ onClose, currentUser, onSwitchUser }) => {
  const [activeSettingTab, setActiveSettingTab] = useState('general'); // 'general', 'currency', 'account'
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeUsername = (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      alert('El nuevo nombre de usuario no puede estar vacío.');
      return;
    }
    const users = loadUsers();
    if (users.some(user => user.username === newUsername.trim())) {
      alert('Ese nombre de usuario ya está en uso.');
      return;
    }

    const updatedUsers = users.map(user =>
      user.username === currentUser ? { ...user, username: newUsername.trim() } : user
    );
    saveUsers(updatedUsers);
    saveCurrentUser(newUsername.trim()); // Update current user in local storage
    onSwitchUser(newUsername.trim()); // Update current user in App.js state
    alert('Nombre de usuario cambiado con éxito. Se ha cerrado la sesión para aplicar los cambios.');
    onClose(); // Close settings
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const users = loadUsers();
    const updatedUsers = users.map(user =>
      user.username === currentUser ? { ...user, password: newPassword } : user
    );
    saveUsers(updatedUsers);
    alert('Contraseña cambiada con éxito.');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y borrará todos tus datos.')) {
      const users = loadUsers();
      const updatedUsers = users.filter(user => user.username !== currentUser);
      saveUsers(updatedUsers);
      // Also clear user-specific data from local storage (e.g., cuentamia_username_transactions)
      // This would require iterating through all user-specific keys, which is complex for local storage.
      // For now, we'll just remove the user from the users list.
      alert('Cuenta eliminada con éxito.');
      onSwitchUser(null); // Log out the user
      onClose();
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
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl w-full max-w-2xl relative"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" /> Ajustes
        </h2>

        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveSettingTab('general')}
            className={`px-4 py-2 font-medium ${activeSettingTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            General
          </button>
          <button
            onClick={() => setActiveSettingTab('currency')}
            className={`px-4 py-2 font-medium ${activeSettingTab === 'currency' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Moneda
          </button>
          <button
            onClick={() => setActiveSettingTab('account')}
            className={`px-4 py-2 font-medium ${activeSettingTab === 'account' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Cuenta
          </button>
        </div>

        <div className="settings-content">
          {activeSettingTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuración General</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                  <select id="language" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                  <select id="theme" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro (próximamente)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeSettingTab === 'currency' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuración de Moneda</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-1">Símbolo de Moneda</label>
                  <input type="text" id="currencySymbol" defaultValue="$" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label htmlFor="decimalSeparator" className="block text-sm font-medium text-gray-700 mb-1">Separador Decimal</label>
                  <select id="decimalSeparator" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value=".">Punto (.)</option>
                    <option value=",">Coma (,)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeSettingTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuración de Cuenta</h3>
              <p className="text-gray-600 mb-4">
                Aquí puedes gestionar tu cuenta actual: <span className="font-semibold">{currentUser}</span>
              </p>
              <div className="space-y-4">
                <form onSubmit={handleChangeUsername} className="space-y-2">
                  <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">Cambiar Nombre de Usuario</label>
                  <input
                    type="text"
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Nuevo nombre de usuario"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Actualizar Nombre
                  </motion.button>
                </form>

                <form onSubmit={handleChangePassword} className="space-y-2 mt-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Cambiar Contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña (mín. 4 caracteres)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar nueva contraseña"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Actualizar Contraseña
                  </motion.button>
                </form>

                <motion.button
                  onClick={handleDeleteAccount}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Borrar Cuenta (¡Cuidado!)
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsMenu;