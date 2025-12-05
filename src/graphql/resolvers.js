const { Paciente, Doctor, HistoriaClinica } = require('../models');
const { formatDate, formatReadableDate, formatDateOnly, parseDate, isValidDate } = require('../utils/dateFormatter');

const resolvers = {
  Query: {
    obtenerHistoriaClinicaPorCedula: async (_, { cedula }) => {
      try {
        const paciente = await Paciente.findOne({
          where: { cedula },
          include: [
            {
              model: HistoriaClinica,
              as: 'historiaClinica',
              include: [
                {
                  model: Doctor,
                  as: 'doctores',
                  through: { attributes: [] }
                }
              ]
            }
          ]
        });

        if (!paciente) {
          throw new Error(`No se encontró un paciente con cédula ${cedula}`);
        }

        if (!paciente.historiaClinica) {
          throw new Error(`El paciente con cédula ${cedula} no tiene historia clínica registrada`);
        }

        return paciente.historiaClinica;
      } catch (error) {
        throw new Error(`Error al obtener historia clínica: ${error.message}`);
      }
    },

    obtenerTodosPacientes: async () => {
      try {
        return await Paciente.findAll({
          include: [
            {
              model: HistoriaClinica,
              as: 'historiaClinica'
            }
          ]
        });
      } catch (error) {
        throw new Error(`Error al obtener pacientes: ${error.message}`);
      }
    },

    obtenerTodosDoctores: async () => {
      try {
        return await Doctor.findAll();
      } catch (error) {
        throw new Error(`Error al obtener doctores: ${error.message}`);
      }
    },

    obtenerTodasHistoriasClinicas: async () => {
      try {
        return await HistoriaClinica.findAll({
          include: [
            {
              model: Paciente,
              as: 'paciente'
            },
            {
              model: Doctor,
              as: 'doctores',
              through: { attributes: [] }
            }
          ]
        });
      } catch (error) {
        throw new Error(`Error al obtener historias clínicas: ${error.message}`);
      }
    }
  },

  Mutation: {
    registrarHistoriaClinica: async (_, { input }) => {
      try {
        const { paciente: pacienteInput, doctores: doctoresInput, motivoConsulta, diagnostico, tratamiento, fecha } = input;

        // Validar y parsear la fecha si se proporciona
        let fechaProcesada = null;
        if (fecha) {
          fechaProcesada = parseDate(fecha);
          if (!fechaProcesada) {
            throw new Error('Formato de fecha inválido. Use formatos: YYYY-MM-DD, DD/MM/YYYY, o formato ISO');
          }
        } else {
          fechaProcesada = new Date();
        }

        let paciente = await Paciente.findOne({
          where: { cedula: pacienteInput.cedula }
        });

        if (paciente) {
          const historiaExistente = await HistoriaClinica.findOne({
            where: { pacienteId: paciente.id }
          });

          if (historiaExistente) {
            throw new Error(`El paciente con cédula ${pacienteInput.cedula} ya tiene una historia clínica registrada`);
          }
        } else {
          paciente = await Paciente.create(pacienteInput);
        }

        const doctores = [];
        for (const doctorInput of doctoresInput) {
          let doctor = await Doctor.findOne({
            where: { cedulaProfesional: doctorInput.cedulaProfesional }
          });

          if (!doctor) {
            doctor = await Doctor.create(doctorInput);
          }

          doctores.push(doctor);
        }

        const historiaClinica = await HistoriaClinica.create({
          motivoConsulta,
          diagnostico,
          tratamiento,
          fecha: fechaProcesada,
          pacienteId: paciente.id
        });

        await historiaClinica.setDoctores(doctores);

        const historiaCompleta = await HistoriaClinica.findByPk(historiaClinica.id, {
          include: [
            {
              model: Paciente,
              as: 'paciente'
            },
            {
              model: Doctor,
              as: 'doctores',
              through: { attributes: [] }
            }
          ]
        });

        return historiaCompleta;
      } catch (error) {
        throw new Error(`Error al registrar historia clínica: ${error.message}`);
      }
    }
  },

  HistoriaClinica: {
    fecha: (historiaClinica) => {
      return formatDate(historiaClinica.fecha);
    },
    createdAt: (historiaClinica) => {
      return formatDate(historiaClinica.createdAt);
    },
    updatedAt: (historiaClinica) => {
      return formatDate(historiaClinica.updatedAt);
    },

    paciente: async (historiaClinica) => {
      if (historiaClinica.paciente) {
        return historiaClinica.paciente;
      }
      return await Paciente.findByPk(historiaClinica.pacienteId);
    },

    doctores: async (historiaClinica) => {
      if (historiaClinica.doctores) {
        return historiaClinica.doctores;
      }
      return await historiaClinica.getDoctores();
    }
  },

  Paciente: {
    historiaClinica: async (paciente) => {
      if (paciente.historiaClinica !== undefined) {
        return paciente.historiaClinica;
      }
      return await HistoriaClinica.findOne({
        where: { pacienteId: paciente.id },
        include: [
          {
            model: Doctor,
            as: 'doctores',
            through: { attributes: [] }
          }
        ]
      });
    },
    createdAt: (paciente) => {
      return formatDate(paciente.createdAt);
    },
    updatedAt: (paciente) => {
      return formatDate(paciente.updatedAt);
    }
  },

  Doctor: {
    createdAt: (doctor) => {
      return formatDate(doctor.createdAt);
    },
    updatedAt: (doctor) => {
      return formatDate(doctor.updatedAt);
    }
  }
};

module.exports = resolvers;
