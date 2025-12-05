const moment = require('moment');
const momentTimezone = require('moment-timezone');

// Configurar zona horaria por defecto
const DEFAULT_TIMEZONE = 'America/Bogota';

/**
 * Formatea una fecha al formato ISO 8601 con zona horaria
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - Formato deseado (opcional)
 * @param {string} timezone - Zona horaria (opcional)
 * @returns {string} Fecha formateada
 */
const formatDate = (date, format = 'YYYY-MM-DDTHH:mm:ss.SSSZ', timezone = DEFAULT_TIMEZONE) => {
  if (!date) return null;
  
  // Si es un string, convertir a Date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Verificar si es una fecha válida
  if (isNaN(dateObj.getTime())) {
    console.warn('Fecha inválida:', date);
    return null;
  }
  
  return moment(dateObj).tz(timezone).format(format);
};

/**
 * Formatea una fecha para mostrar en formato legible
 * @param {Date|string} date - Fecha a formatear
 * @param {string} timezone - Zona horaria (opcional)
 * @returns {string} Fecha formateada en formato legible
 */
const formatReadableDate = (date, timezone = DEFAULT_TIMEZONE) => {
  return formatDate(date, 'DD/MM/YYYY HH:mm:ss', timezone);
};

/**
 * Formatea una fecha para mostrar solo la fecha (sin hora)
 * @param {Date|string} date - Fecha a formatear
 * @param {string} timezone - Zona horaria (opcional)
 * @returns {string} Fecha formateada (solo fecha)
 */
const formatDateOnly = (date, timezone = DEFAULT_TIMEZONE) => {
  return formatDate(date, 'YYYY-MM-DD', timezone);
};

/**
 * Convierte un string de fecha a objeto Date
 * @param {string} dateString - String de fecha
 * @returns {Date} Objeto Date
 */
const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Intentar diferentes formatos comunes
  const formats = [
    'YYYY-MM-DD',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'YYYY-MM-DDTHH:mm:ssZ',
    'DD/MM/YYYY',
    'DD/MM/YYYY HH:mm:ss'
  ];
  
  const date = moment(dateString, formats, true);
  
  if (date.isValid()) {
    return date.toDate();
  }
  
  console.warn('Formato de fecha no reconocido:', dateString);
  return null;
};

/**
 * Valida si una fecha es válida
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} True si la fecha es válida
 */
const isValidDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Obtiene la fecha y hora actual en formato ISO
 * @returns {string} Fecha y hora actual formateada
 */
const getCurrentDateTime = () => {
  return moment().tz(DEFAULT_TIMEZONE).format();
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha actual formateada
 */
const getCurrentDate = () => {
  return moment().tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD');
};

module.exports = {
  formatDate,
  formatReadableDate,
  formatDateOnly,
  parseDate,
  isValidDate,
  getCurrentDateTime,
  getCurrentDate,
  DEFAULT_TIMEZONE
};
