// src/apiConfig.js
const host = window.location.hostname;
// Apunta directamente al endpoint que armó el otro equipo
export const API_BASE = `http://${host}:3001/api/dashboard`;