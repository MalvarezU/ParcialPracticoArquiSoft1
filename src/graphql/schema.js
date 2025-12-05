const { gql } = require('apollo-server-express');

const typeDefs = gql`

  scalar Date
  
  type Paciente {
    id: ID!
    nombre: String!
    apellido: String!
    cedula: String!
    edad: Int!
    genero: String!
    historiaClinica: HistoriaClinica
    createdAt: Date!
    updatedAt: Date!
  }

  type Doctor {
    id: ID!
    nombre: String!
    cedulaProfesional: String!
    especialidad: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type HistoriaClinica {
    id: ID!
    motivoConsulta: String!
    diagnostico: String!
    tratamiento: String!
    fecha: Date!
    paciente: Paciente!
    doctores: [Doctor!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input PacienteInput {
    nombre: String!
    apellido: String!
    cedula: String!
    edad: Int!
    genero: String!
  }

  input DoctorInput {
    nombre: String!
    cedulaProfesional: String!
    especialidad: String!
  }

  input HistoriaClinicaInput {
    paciente: PacienteInput!
    doctores: [DoctorInput!]!
    motivoConsulta: String!
    diagnostico: String!
    tratamiento: String!
    fecha: Date
  }

  type Query {
    obtenerHistoriaClinicaPorCedula(cedula: String!): HistoriaClinica
    obtenerTodosPacientes: [Paciente!]!
    obtenerTodosDoctores: [Doctor!]!
    obtenerTodasHistoriasClinicas: [HistoriaClinica!]!
  }

  type Mutation {
    registrarHistoriaClinica(input: HistoriaClinicaInput!): HistoriaClinica!
  }
`;

module.exports = typeDefs;
