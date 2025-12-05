const { Paciente, Doctor, HistoriaClinica } = require('../models');

// Función helper para formatear fechas en formato local (YYYY-MM-DDTHH:mm:ss)
const formatLocalDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  // Formato: YYYY-MM-DDTHH:mm:ss
  const pad = (n) => n.toString().padStart(2, '0');
  
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const extractData = (obj) => {
  if (!obj) return null;
  
  // Si ya es un objeto plano, devolverlo
  if (obj && typeof obj.toJSON !== 'function') {
    return obj;
  }
  
  // Si es un objeto Sequelize, extraer los datos
  return obj.toJSON ? obj.toJSON() : obj;
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

        // Extraer datos de la historia clínica
        const historiaData = extractData(paciente.historiaClinica);
        
        // Formatear todas las fechas
        const historiaFormateada = {
          ...historiaData,
          fecha: formatLocalDate(historiaData.fecha),
          createdAt: formatLocalDate(historiaData.createdAt),
          updatedAt: formatLocalDate(historiaData.updatedAt),
          doctores: (historiaData.doctores || []).map(doctor => {
            const doctorData = extractData(doctor);
            return {
              ...doctorData,
              createdAt: formatLocalDate(doctorData.createdAt),
              updatedAt: formatLocalDate(doctorData.updatedAt)
            };
          })
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
        return pacientes.map(paciente => {
          const pacienteData = extractData(paciente);
          
          return {
            ...pacienteData,
            createdAt: formatLocalDate(pacienteData.createdAt),
            updatedAt: formatLocalDate(pacienteData.updatedAt),
            // También formatear en historia clínica si existe
            historiaClinica: pacienteData.historiaClinica ? {
              ...extractData(pacienteData.historiaClinica),
              fecha: formatLocalDate(pacienteData.historiaClinica.fecha),
              createdAt: formatLocalDate(pacienteData.historiaClinica.createdAt),
              updatedAt: formatLocalDate(pacienteData.historiaClinica.updatedAt)
            } : null
          };
        });
      } catch (error) {
        throw new Error(`Error al obtener pacientes: ${error.message}`);
      }
    },

    obtenerTodosDoctores: async () => {
      try {
        const doctores = await Doctor.findAll();
        // Formatear fechas para doctores
        return doctores.map(doctor => {
          const doctorData = extractData(doctor);
          return {
            ...doctorData,
            createdAt: formatLocalDate(doctorData.createdAt),
            updatedAt: formatLocalDate(doctorData.updatedAt)
          };
        });
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
        return historias.map(historia => {
          const historiaData = extractData(historia);
          
          return {
            ...historiaData,
            fecha: formatLocalDate(historiaData.fecha),
            createdAt: formatLocalDate(historiaData.createdAt),
            updatedAt: formatLocalDate(historiaData.updatedAt),
            // También formatear en paciente asociado
            paciente: historiaData.paciente ? {
              ...extractData(historiaData.paciente),
              createdAt: formatLocalDate(historiaData.paciente.createdAt),
              updatedAt: formatLocalDate(historiaData.paciente.updatedAt)
            } : null,
            // Formatear doctores asociados
            doctores: (historiaData.doctores || []).map(doctor => {
              const doctorData = extractData(doctor);
              return {
                ...doctorData,
                createdAt: formatLocalDate(doctorData.createdAt),
                updatedAt: formatLocalDate(doctorData.updatedAt)
              };
            })
          };
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

        // Extraer datos
        const historiaData = extractData(historiaCompleta);
        
        // Formatear la respuesta del mutation también
        return {
          ...historiaData,
          fecha: formatLocalDate(historiaData.fecha),
          createdAt: formatLocalDate(historiaData.createdAt),
          updatedAt: formatLocalDate(historiaData.updatedAt),
          paciente: historiaData.paciente ? {
            ...extractData(historiaData.paciente),
            createdAt: formatLocalDate(historiaData.paciente.createdAt),
            updatedAt: formatLocalDate(historiaData.paciente.updatedAt)
          } : null,
          doctores: (historiaData.doctores || []).map(doctor => {
            const doctorData = extractData(doctor);
            return {
              ...doctorData,
              createdAt: formatLocalDate(doctorData.createdAt),
              updatedAt: formatLocalDate(doctorData.updatedAt)
            };
          })
        };
      } catch (error) {
        throw new Error(`Error al registrar historia clínica: ${error.message}`);
      }
    }
  },

  HistoriaClinica: {
    fecha: (historiaClinica) => {
      return formatLocalDate(historiaClinica.fecha);
    },
    
    paciente: async (historiaClinica) => {
      if (historiaClinica.paciente) {
        const pacienteData = extractData(historiaClinica.paciente);
        return {
          ...pacienteData,
          createdAt: formatLocalDate(pacienteData.createdAt),
          updatedAt: formatLocalDate(pacienteData.updatedAt)
        };
      }
      const paciente = await Paciente.findByPk(historiaClinica.pacienteId);
      if (!paciente) return null;
      
      const pacienteData = extractData(paciente);
      return {
        ...pacienteData,
        createdAt: formatLocalDate(pacienteData.createdAt),
        updatedAt: formatLocalDate(pacienteData.updatedAt)
      };
    },
    
    doctores: async (historiaClinica) => {
      let doctores;
      if (historiaClinica.doctores) {
        doctores = historiaClinica.doctores;
      } else {
        doctores = await historiaClinica.getDoctores();
      }
      
      return (doctores || []).map(doctor => {
        const doctorData = extractData(doctor);
        return {
          ...doctorData,
          createdAt: formatLocalDate(doctorData.createdAt),
          updatedAt: formatLocalDate(doctorData.updatedAt)
        };
      });
    }
  },

  Paciente: {
    historiaClinica: async (paciente) => {
      const pacienteData = extractData(paciente);
      
      if (pacienteData.historiaClinica !== undefined) {
        return pacienteData.historiaClinica ? {
          ...extractData(pacienteData.historiaClinica),
          fecha: formatLocalDate(pacienteData.historiaClinica.fecha),
          createdAt: formatLocalDate(pacienteData.historiaClinica.createdAt),
          updatedAt: formatLocalDate(pacienteData.historiaClinica.updatedAt)
        } : null;
      }
      
      const historia = await HistoriaClinica.findOne({
        where: { pacienteId: pacienteData.id },
        include: [
          {
            model: Doctor,
            as: 'doctores',
            through: { attributes: [] }
          }
        ]
      });
      
      if (!historia) return null;
      
      const historiaData = extractData(historia);
      return {
        ...historiaData,
        fecha: formatLocalDate(historiaData.fecha),
        createdAt: formatLocalDate(historiaData.createdAt),
        updatedAt: formatLocalDate(historiaData.updatedAt),
        doctores: (historiaData.doctores || []).map(doctor => {
          const doctorData = extractData(doctor);
          return {
            ...doctorData,
            createdAt: formatLocalDate(doctorData.createdAt),
            updatedAt: formatLocalDate(doctorData.updatedAt)
          };
        })
      };
    }
  }
};

module.exports = resolvers;
