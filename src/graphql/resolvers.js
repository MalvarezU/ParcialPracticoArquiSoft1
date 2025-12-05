const { Paciente, Doctor, HistoriaClinica } = require('../models');

// Función helper para formatear fechas en formato local (YYYY-MM-DDTHH:mm:ss)
const formatLocalDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  // Formato: YYYY-MM-DDTHH:mm:ss (hora local sin .000Z)
  const pad = (n) => n.toString().padStart(2, '0');
  
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

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

        // Formatear todas las fechas
        const historiaFormateada = {
          ...paciente.historiaClinica.toJSON(),
          fecha: formatLocalDate(paciente.historiaClinica.fecha),
          createdAt: formatLocalDate(paciente.historiaClinica.createdAt),
          updatedAt: formatLocalDate(paciente.historiaClinica.updatedAt),
          doctores: paciente.historiaClinica.doctores.map(doctor => ({
            ...doctor.toJSON(),
            createdAt: formatLocalDate(doctor.createdAt),
            updatedAt: formatLocalDate(doctor.updatedAt)
          }))
        };

        return historiaFormateada;
      } catch (error) {
        throw new Error(`Error al obtener historia clínica: ${error.message}`);
      }
    },

    obtenerTodosPacientes: async () => {
      try {
        const pacientes = await Paciente.findAll({
          include: [
            {
              model: HistoriaClinica,
              as: 'historiaClinica'
            }
          ]
        });
        
        // Formatear fechas para pacientes
        return pacientes.map(paciente => ({
          ...paciente.toJSON(),
          createdAt: formatLocalDate(paciente.createdAt),
          updatedAt: formatLocalDate(paciente.updatedAt),
          // También formatear en historia clínica si existe
          historiaClinica: paciente.historiaClinica ? {
            ...paciente.historiaClinica.toJSON(),
            fecha: formatLocalDate(paciente.historiaClinica.fecha),
            createdAt: formatLocalDate(paciente.historiaClinica.createdAt),
            updatedAt: formatLocalDate(paciente.historiaClinica.updatedAt)
          } : null
        }));
      } catch (error) {
        throw new Error(`Error al obtener pacientes: ${error.message}`);
      }
    },

    obtenerTodosDoctores: async () => {
      try {
        const doctores = await Doctor.findAll();
        // Formatear fechas para doctores
        return doctores.map(doctor => ({
          ...doctor.toJSON(),
          createdAt: formatLocalDate(doctor.createdAt),
          updatedAt: formatLocalDate(doctor.updatedAt)
        }));
      } catch (error) {
        throw new Error(`Error al obtener doctores: ${error.message}`);
      }
    },

    obtenerTodasHistoriasClinicas: async () => {
      try {
        const historias = await HistoriaClinica.findAll({
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
        
        // Formatear fechas para historias clínicas
        return historias.map(historia => ({
          ...historia.toJSON(),
          fecha: formatLocalDate(historia.fecha),
          createdAt: formatLocalDate(historia.createdAt),
          updatedAt: formatLocalDate(historia.updatedAt),
          // También formatear en paciente asociado
          paciente: historia.paciente ? {
            ...historia.paciente.toJSON(),
            createdAt: formatLocalDate(historia.paciente.createdAt),
            updatedAt: formatLocalDate(historia.paciente.updatedAt)
          } : null,
          // Formatear doctores asociados
          doctores: historia.doctores ? historia.doctores.map(doctor => ({
            ...doctor.toJSON(),
            createdAt: formatLocalDate(doctor.createdAt),
            updatedAt: formatLocalDate(doctor.updatedAt)
          })) : []
        }));
      } catch (error) {
        throw new Error(`Error al obtener historias clínicas: ${error.message}`);
      }
    }
  },

  Mutation: {
    registrarHistoriaClinica: async (_, { input }) => {
      try {
        const { paciente: pacienteInput, doctores: doctoresInput, motivoConsulta, diagnostico, tratamiento, fecha } = input;

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
          fecha: fecha || new Date(),
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

        // Formatear la respuesta del mutation también
        return {
          ...historiaCompleta.toJSON(),
          fecha: formatLocalDate(historiaCompleta.fecha),
          createdAt: formatLocalDate(historiaCompleta.createdAt),
          updatedAt: formatLocalDate(historiaCompleta.updatedAt),
          paciente: historiaCompleta.paciente ? {
            ...historiaCompleta.paciente.toJSON(),
            createdAt: formatLocalDate(historiaCompleta.paciente.createdAt),
            updatedAt: formatLocalDate(historiaCompleta.paciente.updatedAt)
          } : null,
          doctores: historiaCompleta.doctores.map(doctor => ({
            ...doctor.toJSON(),
            createdAt: formatLocalDate(doctor.createdAt),
            updatedAt: formatLocalDate(doctor.updatedAt)
          }))
        };
      } catch (error) {
        throw new Error(`Error al registrar historia clínica: ${error.message}`);
      }
    }
  },

  // Resolvers para tipos específicos (field resolvers)
  HistoriaClinica: {
    fecha: (historiaClinica) => {
      return formatLocalDate(historiaClinica.fecha);
    },
    
    paciente: async (historiaClinica) => {
      if (historiaClinica.paciente) {
        return {
          ...historiaClinica.paciente.toJSON(),
          createdAt: formatLocalDate(historiaClinica.paciente.createdAt),
          updatedAt: formatLocalDate(historiaClinica.paciente.updatedAt)
        };
      }
      const paciente = await Paciente.findByPk(historiaClinica.pacienteId);
      return paciente ? {
        ...paciente.toJSON(),
        createdAt: formatLocalDate(paciente.createdAt),
        updatedAt: formatLocalDate(paciente.updatedAt)
      } : null;
    },
    
    doctores: async (historiaClinica) => {
      let doctores;
      if (historiaClinica.doctores) {
        doctores = historiaClinica.doctores;
      } else {
        doctores = await historiaClinica.getDoctores();
      }
      
      return doctores.map(doctor => ({
        ...doctor.toJSON(),
        createdAt: formatLocalDate(doctor.createdAt),
        updatedAt: formatLocalDate(doctor.updatedAt)
      }));
    }
  },

  Paciente: {
    historiaClinica: async (paciente) => {
      if (paciente.historiaClinica !== undefined) {
        return paciente.historiaClinica ? {
          ...paciente.historiaClinica.toJSON(),
          fecha: formatLocalDate(paciente.historiaClinica.fecha),
          createdAt: formatLocalDate(paciente.historiaClinica.createdAt),
          updatedAt: formatLocalDate(paciente.historiaClinica.updatedAt)
        } : null;
      }
      const historia = await HistoriaClinica.findOne({
        where: { pacienteId: paciente.id },
        include: [
          {
            model: Doctor,
            as: 'doctores',
            through: { attributes: [] }
          }
        ]
      });
      
      return historia ? {
        ...historia.toJSON(),
        fecha: formatLocalDate(historia.fecha),
        createdAt: formatLocalDate(historia.createdAt),
        updatedAt: formatLocalDate(historia.updatedAt),
        doctores: historia.doctores.map(doctor => ({
          ...doctor.toJSON(),
          createdAt: formatLocalDate(doctor.createdAt),
          updatedAt: formatLocalDate(doctor.updatedAt)
        }))
      } : null;
    }
  }
};

module.exports = resolvers;
