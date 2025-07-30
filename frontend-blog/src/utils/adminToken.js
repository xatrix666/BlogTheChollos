// src/utils/adminToken.js
let adminToken = null;

// Llama a esto cada vez que necesites el token en tu petición
export function getAdminToken() {
  if (!adminToken) {
    adminToken = window.localStorage.getItem('adminToken') || window.prompt('Introduce tu token admin:');
    if (adminToken) window.localStorage.setItem('adminToken', adminToken);
  }
  return adminToken;
}

export function clearAdminToken() {
  adminToken = null;
  window.localStorage.removeItem('adminToken');
}
