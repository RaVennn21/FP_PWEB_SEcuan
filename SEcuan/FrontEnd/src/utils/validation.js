export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

export const validatePassword = (password) =>
  (password || '').length >= 6;

export const validateUsername = (username) =>
  /^[a-zA-Z0-9_]{3,}$/.test(username || '');
