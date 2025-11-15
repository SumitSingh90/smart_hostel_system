export function isAuthenticated() {
  return !!localStorage.getItem('token') && !!localStorage.getItem('user');
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

export function requireRole(allowedRoles = []) {
  const user = getUser();
  if (!user) return false;
  if (!allowedRoles.length) return true;
  return allowedRoles.includes(user.role);
}
