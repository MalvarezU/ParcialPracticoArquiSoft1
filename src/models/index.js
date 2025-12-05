const { sequelize } = require('../config/database');
const PacienteModel = require('./Paciente');
const DoctorModel = require('./Doctor');
const HistoriaClinicaModel = require('./HistoriaClinica');

const Paciente = PacienteModel(sequelize);
const Doctor = DoctorModel(sequelize);
const HistoriaClinica = HistoriaClinicaModel(sequelize);

Paciente.hasOne(HistoriaClinica, {
  foreignKey: 'pacienteId',
  as: 'historiaClinica'
});

HistoriaClinica.belongsTo(Paciente, {
  foreignKey: 'pacienteId',
  as: 'paciente'
});

HistoriaClinica.belongsToMany(Doctor, {
  through: 'historias_doctores',
  foreignKey: 'historia_clinica_id',
  otherKey: 'doctor_id',
  as: 'doctores'
});

Doctor.belongsToMany(HistoriaClinica, {
  through: 'historias_doctores',
  foreignKey: 'doctor_id',
  otherKey: 'historia_clinica_id',
  as: 'historiasClinicas'
});

const syncDatabase = async (force = false) => {
  try {
    console.log('Sincronizando base de datos...');
    
    if (force) {
      console.log('Modo force: true - se eliminarán datos existentes');
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    }
    await sequelize.sync({ force });
    
    if (force) {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    
    console.log('✓ Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('✗ Error al sincronizar la base de datos:', error);
    
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
    }
    throw error;
  }
};

module.exports = {
  sequelize,
  Paciente,
  Doctor,
  HistoriaClinica,
  syncDatabase
};
