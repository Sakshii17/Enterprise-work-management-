import { jwtDecode } from 'jwt-decode';

export function getCurrentUser() {
  const token = localStorage.getItem('ewmp_token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      employeeId: decoded.sub,
      role: decoded.role,
    };
  } catch (e) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('ewmp_token');
}