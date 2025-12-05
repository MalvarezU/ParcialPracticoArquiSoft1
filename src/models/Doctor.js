const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Doctor = sequelize.define('Doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cedulaProfesional: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'cedula_profesional'
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'doctores',
    timestamps: true
  });

  return Doctor;
};
