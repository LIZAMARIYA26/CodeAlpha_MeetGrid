const USERS_KEY = 'connectmeet_users';
const AUTH_KEY = 'connectmeet_isAuthenticated';
const CURRENT_USER_KEY = 'connectmeet_currentUser';

export function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

export function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('Failed to read users from localStorage:', error);
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    return user || null;
  } catch (error) {
    console.error('Failed to read current user from localStorage:', error);
    return null;
  }
}

export function registerUser(newUser) {
  const users = getUsers();
  const email = normalizeEmail(newUser.email);

  const existingUser = users.find((user) => normalizeEmail(user.email) === email);
  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  const userToSave = {
    id: Date.now().toString(),
    name: String(newUser.name).trim(),
    email,
    password: String(newUser.password),
  };

  saveUsers([...users, userToSave]);

  return { success: true, user: userToSave };
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (entry) => normalizeEmail(entry.email) === normalizeEmail(email) && entry.password === String(password)
  );

  if (!user) {
    return null;
  }

  const currentUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  return currentUser;
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}
