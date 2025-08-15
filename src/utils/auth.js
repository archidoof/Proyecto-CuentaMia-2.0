import { saveToLocalStorage, loadFromLocalStorage } from './helpers';

const USERS_KEY = 'cuentamia_users';
const CURRENT_USER_KEY = 'cuentamia_current_user';

export const loadUsers = () => {
  return loadFromLocalStorage(USERS_KEY, []);
};

export const saveUsers = (users) => {
  saveToLocalStorage(USERS_KEY, users);
};

export const loadCurrentUser = () => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

export const saveCurrentUser = (username) => {
  localStorage.setItem(CURRENT_USER_KEY, username);
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const registerUser = (username, password) => {
  const users = loadUsers();
  if (users.find(user => user.username === username)) {
    alert('El nombre de usuario ya existe.');
    return false;
  }
  users.push({ username, password }); // In a real app, hash the password!
  saveUsers(users);
  return true;
};

export const loginUser = (username, password) => {
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password); // No hashing for now
  if (user) {
    saveCurrentUser(username);
    return true;
  }
  alert('Nombre de usuario o contraseña incorrectos.');
  return false;
};

export const logoutUser = () => {
  clearCurrentUser();
};

// Helper to get user-specific storage key
export const getUserDataKey = (username, dataName) => {
  return `cuentamia_${username}_${dataName}`;
};