const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HistoriaClinica = sequelize.define('HistoriaClinica', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    motivoConsulta: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'motivo_consulta'
    },
    diagnostico: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tratamiento: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'paciente_id'
    }
  }, {
    tableName: 'historias_clinicas',
    timestamps: true
  });

  return HistoriaClinica;
};
