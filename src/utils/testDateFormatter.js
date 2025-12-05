const { 
  formatDate, 
  formatReadableDate, 
  formatDateOnly, 
  parseDate, 
  isValidDate, 
  getCurrentDateTime,
  getCurrentDate 
} = require('./dateFormatter');

console.log('=== Pruebas de Manejo de Fechas ===\n');

// 1. Probar formateo de fechas
console.log('1. Pruebas de formateo:');
const testDate = new Date();
console.log('Fecha actual:', testDate.toString());
console.log('Formato ISO:', formatDate(testDate));
console.log('Formato legible:', formatReadableDate(testDate));
console.log('Formato solo fecha:', formatDateOnly(testDate));
console.log('');

// 2. Probar parseo de diferentes formatos
console.log('2. Pruebas de parseo:');
const testDates = [
  '2024-01-15',
  '15/01/2024',
  '2024-01-15T10:30:00Z',
  '15/01/2024 10:30:00',
  '2024-01-15T10:30:00.000Z'
];

testDates.forEach(dateStr => {
  const parsed = parseDate(dateStr);
  console.log(`${dateStr} -> ${parsed ? parsed.toString() : 'INVÁLIDO'}`);
});
console.log('');

// 3. Probar validación de fechas
console.log('3. Pruebas de validación:');
const validationTests = [
  new Date(),
  '2024-01-15',
  'fecha inválida',
  null,
  undefined
];

validationTests.forEach(test => {
  const valid = isValidDate(test);
  console.log(`${test} -> ${valid ? 'VÁLIDO' : 'INVÁLIDO'}`);
});
console.log('');

// 4. Probar funciones de fecha actual
console.log('4. Pruebas de fecha actual:');
console.log('Fecha y hora actual:', getCurrentDateTime());
console.log('Fecha actual:', getCurrentDate());
console.log('');

// 5. Probar manejo de fechas inválidas
console.log('5. Pruebas con fechas inválidas:');
console.log('Fecha nula:', formatDate(null));
console.log('Fecha undefined:', formatDate(undefined));
console.log('Fecha inválida string:', formatDate('fecha inválida'));
console.log('');

console.log('=== Pruebas completadas ===');
