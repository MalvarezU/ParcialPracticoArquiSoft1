const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Paciente {
    id: ID!
    nombre: String!
    apellido: String!
    cedula: String!
    edad: Int!
    genero: String!
    historiaClinica: HistoriaClinica
    createdAt: String!
    updatedAt: String!
  }

  type Doctor {
    id: ID!
    nombre: String!
    cedulaProfesional: String!
    especialidad: String!
    createdAt: String!
    updatedAt: String!
  }

  type HistoriaClinica {
    id: ID!
    motivoConsulta: String!
    diagnostico: String!
    tratamiento: String!
    fecha: String!
    paciente: Paciente!
    doctores: [Doctor!]!
    createdAt: String!
    updatedAt: String!
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
    fecha: String
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
