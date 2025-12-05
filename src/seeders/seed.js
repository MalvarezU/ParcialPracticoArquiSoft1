require('dotenv').config();
const { testConnection, sequelize } = require('../config/database');
const { Paciente, Doctor, HistoriaClinica, syncDatabase } = require('../models');

const seedData = async () => {
  try {
    console.log('\n🌱 Iniciando proceso de seed...\n');

    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    console.log('Sincronizando base de datos (force: true - eliminará datos existentes)...');
    await syncDatabase(true);

    console.log('\nCreando pacientes...');
    const pacientes = await Paciente.bulkCreate([
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '1234567890',
        edad: 45,
        genero: 'Masculino'
      },
      {
        nombre: 'María',
        apellido: 'González',
        cedula: '0987654321',
        edad: 32,
        genero: 'Femenino'
      },
      {
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        cedula: '1122334455',
        edad: 58,
        genero: 'Masculino'
      },
      {
        nombre: 'Ana',
        apellido: 'Martínez',
        cedula: '5544332211',
        edad: 28,
        genero: 'Femenino'
      }
    ]);
    console.log(`✓ ${pacientes.length} pacientes creados`);

    console.log('\nCreando doctores...');
    const doctores = await Doctor.bulkCreate([
      {
        nombre: 'Dr. Roberto Silva',
        cedulaProfesional: 'DOC001',
        especialidad: 'Cardiología'
      },
      {
        nombre: 'Dra. Laura Fernández',
        cedulaProfesional: 'DOC002',
        especialidad: 'Medicina General'
      },
      {
        nombre: 'Dr. Miguel Ángel Torres',
        cedulaProfesional: 'DOC003',
        especialidad: 'Neurología'
      },
      {
        nombre: 'Dra. Patricia Ramírez',
        cedulaProfesional: 'DOC004',
        especialidad: 'Pediatría'
      },
      {
        nombre: 'Dr. Fernando Castro',
        cedulaProfesional: 'DOC005',
        especialidad: 'Ortopedia'
      }
    ]);
    console.log(`✓ ${doctores.length} doctores creados`);

    console.log('\nCreando historias clínicas...');

    const historia1 = await HistoriaClinica.create({
      motivoConsulta: 'Dolor en el pecho y dificultad para respirar',
      diagnostico: 'Hipertensión arterial grado II',
      tratamiento: 'Losartán 50mg cada 12 horas, control de presión arterial diario, dieta baja en sodio',
      fecha: new Date('2024-01-15'),
      pacienteId: pacientes[0].id
    });
    await historia1.setDoctores([doctores[0], doctores[1]]);

    const historia2 = await HistoriaClinica.create({
      motivoConsulta: 'Chequeo de rutina y control de embarazo',
      diagnostico: 'Embarazo de 12 semanas, evolución normal',
      tratamiento: 'Ácido fólico 400mcg diario, hierro 60mg diario, control prenatal mensual',
      fecha: new Date('2024-02-20'),
      pacienteId: pacientes[1].id
    });
    await historia2.setDoctores([doctores[1]]);

    const historia3 = await HistoriaClinica.create({
      motivoConsulta: 'Mareos frecuentes y dolor de cabeza persistente',
      diagnostico: 'Migraña crónica con aura',
      tratamiento: 'Sumatriptán 50mg según necesidad, propranolol 40mg cada 12 horas como profiláctico',
      fecha: new Date('2024-03-10'),
      pacienteId: pacientes[2].id
    });
    await historia3.setDoctores([doctores[2], doctores[1]]);

    console.log('✓ 3 historias clínicas creadas con sus doctores asignados');

    console.log('\n✅ Proceso de seed completado exitosamente\n');
    console.log('Datos de prueba disponibles:');
    console.log('- Paciente 1: Juan Pérez (Cédula: 1234567890)');
    console.log('- Paciente 2: María González (Cédula: 0987654321)');
    console.log('- Paciente 3: Carlos Rodríguez (Cédula: 1122334455)');
    console.log('- Paciente 4: Ana Martínez (Cédula: 5544332211 - Sin historia clínica)\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

seedData();
