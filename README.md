  # Sistema de Gestión de Historias Clínicas - GraphQL API

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-16.8.1-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Apollo Server](https://img.shields.io/badge/Apollo%20Server-3.13.0-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.35.2-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-20+-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Servicio web desarrollado con GraphQL para la gestión de historias clínicas básicas de pacientes en un hospital. Proyecto desarrollado para el Parcial Práctico de Arquitectura de Software.

## Descripción

Este sistema permite:
- Consultar historias clínicas por cédula del paciente
- Registrar nuevas historias clínicas con información de pacientes y doctores
- Gestionar relaciones entre pacientes, doctores e historias clínicas
- Interfaz web para consumir las APIs GraphQL

## Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **GraphQL**: Apollo Server 3.x
- **ORM**: Sequelize
- **Base de Datos**: MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Contenedores**: Docker + Docker Compose

## Requisitos Previos

### Opción 1: Con Docker (Recomendado)
- Docker Desktop instalado
- Docker Compose instalado

### Opción 2: Sin Docker
- Node.js 18 o superior
- MySQL 8.0 o superior
- npm o yarn

## Instalación y Ejecución

### Opción 1: Usando Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd p3ArqSoft
```

2. **Iniciar los contenedores**
```bash
docker-compose up --build
```

3. **Cargar datos de prueba (opcional)**
```bash
docker-compose exec app npm run seed
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

### Opción 2: Sin Docker

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd p3ArqSoft
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_db
DB_USER=root
DB_PASSWORD=tu_password
PORT=4000
NODE_ENV=development
```

4. **Crear la base de datos**
```sql
CREATE DATABASE hospital_db;
```

5. **Iniciar el servidor**
```bash
npm start
```

6. **Cargar datos de prueba (opcional)**
```bash
npm run seed
```

7. **Acceder a la aplicación**
- Frontend: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

## Estructura del Proyecto

```
p3ArqSoft/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de Sequelize
│   ├── models/
│   │   ├── index.js             # Inicialización de modelos y relaciones
│   │   ├── Paciente.js          # Modelo de Paciente
│   │   ├── Doctor.js            # Modelo de Doctor
│   │   └── HistoriaClinica.js   # Modelo de Historia Clínica
│   ├── graphql/
│   │   ├── schema.js            # Esquema GraphQL (tipos, queries, mutations)
│   │   └── resolvers.js         # Resolvers de GraphQL
│   ├── seeders/
│   │   └── seed.js              # Script para cargar datos de prueba
│   └── index.js                 # Servidor principal
├── public/
│   └── index.html               # Frontend web
├── docker-compose.yml           # Configuración de Docker Compose
├── Dockerfile                   # Dockerfile para la aplicación
├── package.json                 # Dependencias del proyecto
├── .env.example                 # Ejemplo de variables de entorno
└── README.md                    # Este archivo
```

## Modelo de Base de Datos

### Diagrama de Relaciones

```
┌─────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│    Pacientes    │         │  Historias_Clinicas  │         │    Doctores     │
├─────────────────┤         ├──────────────────────┤         ├─────────────────┤
│ id (PK)         │────1:1──│ id (PK)              │         │ id (PK)         │
│ nombre          │         │ motivo_consulta      │         │ nombre          │
│ apellido        │         │ diagnostico          │         │ cedula_prof.(UK)│
│ cedula (UNIQUE) │         │ tratamiento          │         │ especialidad    │
│ edad            │         │ fecha                │         │ created_at      │
│ genero          │         │ paciente_id (FK,UK)  │         │ updated_at      │
│ created_at      │         │ created_at           │         └─────────────────┘
│ updated_at      │         │ updated_at           │                 │
└─────────────────┘         └──────────────────────┘                 │
                                      │                               │
                                      └────────────N:M────────────────┘
                                            historias_doctores
                                        (historia_clinica_id, doctor_id)
```

### Relaciones

1. **Paciente - Historia Clínica**: Relación 1:1
   - Un paciente tiene una única historia clínica
   - Cada historia clínica pertenece a un solo paciente

2. **Historia Clínica - Doctores**: Relación N:M
   - Una historia clínica puede ser atendida por múltiples doctores
   - Un doctor puede atender múltiples historias clínicas
   - Se usa tabla intermedia `historias_doctores`

### Entidades

#### Paciente
- `id`: Integer (PK, Auto-increment)
- `nombre`: String(100)
- `apellido`: String(100)
- `cedula`: String(20) - UNIQUE
- `edad`: Integer
- `genero`: ENUM('Masculino', 'Femenino', 'Otro')
- `created_at`: DateTime
- `updated_at`: DateTime

#### Doctor
- `id`: Integer (PK, Auto-increment)
- `nombre`: String(100)
- `cedula_profesional`: String(20) - UNIQUE
- `especialidad`: String(100)
- `created_at`: DateTime
- `updated_at`: DateTime

#### Historia Clínica
- `id`: Integer (PK, Auto-increment)
- `motivo_consulta`: Text
- `diagnostico`: Text
- `tratamiento`: Text
- `fecha`: Date
- `paciente_id`: Integer (FK, UNIQUE) - Referencia a Pacientes
- `created_at`: DateTime
- `updated_at`: DateTime

## Esquema GraphQL

### Tipos

```graphql
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
```

### Queries

```graphql
type Query {
  # Consultar historia clínica por cédula del paciente
  obtenerHistoriaClinicaPorCedula(cedula: String!): HistoriaClinica

  # Listar todos los pacientes
  obtenerTodosPacientes: [Paciente!]!

  # Listar todos los doctores
  obtenerTodosDoctores: [Doctor!]!

  # Listar todas las historias clínicas
  obtenerTodasHistoriasClinicas: [HistoriaClinica!]!
}
```

### Mutations

```graphql
type Mutation {
  # Registrar una nueva historia clínica
  registrarHistoriaClinica(input: HistoriaClinicaInput!): HistoriaClinica!
}

input HistoriaClinicaInput {
  paciente: PacienteInput!
  doctores: [DoctorInput!]!
  motivoConsulta: String!
  diagnostico: String!
  tratamiento: String!
  fecha: String
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
```

## Ejemplos de Uso

### Query: Consultar Historia Clínica por Cédula

**Request:**
```graphql
query {
  obtenerHistoriaClinicaPorCedula(cedula: "1234567890") {
    id
    motivoConsulta
    diagnostico
    tratamiento
    fecha
    paciente {
      nombre
      apellido
      edad
      genero
    }
    doctores {
      nombre
      especialidad
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "obtenerHistoriaClinicaPorCedula": {
      "id": "1",
      "motivoConsulta": "Dolor en el pecho y dificultad para respirar",
      "diagnostico": "Hipertensión arterial grado II",
      "tratamiento": "Losartán 50mg cada 12 horas, control de presión arterial diario",
      "fecha": "2024-01-15T00:00:00.000Z",
      "paciente": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "edad": 45,
        "genero": "Masculino"
      },
      "doctores": [
        {
          "nombre": "Dr. Roberto Silva",
          "especialidad": "Cardiología"
        },
        {
          "nombre": "Dra. Laura Fernández",
          "especialidad": "Medicina General"
        }
      ]
    }
  }
}
```

### Mutation: Registrar Nueva Historia Clínica

**Request:**
```graphql
mutation {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Pedro"
      apellido: "López"
      cedula: "9876543210"
      edad: 35
      genero: "Masculino"
    }
    doctores: [
      {
        nombre: "Dr. Roberto Silva"
        cedulaProfesional: "DOC001"
        especialidad: "Cardiología"
      }
    ]
    motivoConsulta: "Dolor de cabeza persistente"
    diagnostico: "Cefalea tensional"
    tratamiento: "Ibuprofeno 400mg cada 8 horas"
    fecha: "2024-03-15"
  }) {
    id
    motivoConsulta
    diagnostico
    paciente {
      nombre
      apellido
      cedula
    }
    doctores {
      nombre
      especialidad
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "registrarHistoriaClinica": {
      "id": "4",
      "motivoConsulta": "Dolor de cabeza persistente",
      "diagnostico": "Cefalea tensional",
      "paciente": {
        "nombre": "Pedro",
        "apellido": "López",
        "cedula": "9876543210"
      },
      "doctores": [
        {
          "nombre": "Dr. Roberto Silva",
          "especialidad": "Cardiología"
        }
      ]
    }
  }
}
```

## Características Implementadas

- Validación de datos de entrada
- Reutilización de pacientes y doctores existentes (búsqueda por cédula)
- Prevención de duplicados de historias clínicas (1 historia por paciente)
- Manejo de errores con mensajes descriptivos
- Sincronización automática de base de datos
- Scripts de seeds para datos de prueba
- Frontend funcional con interfaz amigable
- Contenedorización con Docker
- Healthcheck para MySQL en Docker Compose

## Datos de Prueba

Después de ejecutar `npm run seed`, tendrás disponibles:

**Pacientes con Historia Clínica:**
- Juan Pérez - Cédula: 1234567890
- María González - Cédula: 0987654321
- Carlos Rodríguez - Cédula: 1122334455

**Paciente sin Historia Clínica:**
- Ana Martínez - Cédula: 5544332211

**Doctores:**
- Dr. Roberto Silva (DOC001) - Cardiología
- Dra. Laura Fernández (DOC002) - Medicina General
- Dr. Miguel Ángel Torres (DOC003) - Neurología
- Dra. Patricia Ramírez (DOC004) - Pediatría
- Dr. Fernando Castro (DOC005) - Ortopedia

## Evidencias de Pruebas

### 1. Servidor en Ejecución
El servidor inicia correctamente en el puerto 4000 y se conecta a la base de datos MySQL.

### 2. GraphQL Playground
Accediendo a `http://localhost:4000/graphql` se puede ver el playground de Apollo Server donde están disponibles todas las queries y mutations.

### 3. Frontend Web
La interfaz web en `http://localhost:4000` permite:
- Consultar historias por cédula
- Registrar nuevas historias con múltiples doctores
- Ver listado de todas las historias clínicas

### 4. Consulta Exitosa
La query `obtenerHistoriaClinicaPorCedula` retorna correctamente la información del paciente, diagnóstico y doctores asignados.

### 5. Registro Exitoso
La mutation `registrarHistoriaClinica` crea correctamente nuevas historias y maneja la lógica de reutilización de pacientes/doctores.

### 6. Base de Datos
Las tablas `pacientes`, `doctores`, `historias_clinicas` y `historias_doctores` se crean correctamente con las relaciones establecidas.

## Scripts Disponibles

```bash
# Iniciar servidor en producción
npm start

# Iniciar servidor en desarrollo (con nodemon)
npm run dev

# Cargar datos de prueba
npm run seed
```

## Comandos Docker

```bash
# Construir e iniciar contenedores
docker-compose up --build

# Iniciar contenedores en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down

# Eliminar contenedores y volúmenes
docker-compose down -v

# Ejecutar seed dentro del contenedor
docker-compose exec app npm run seed
```

## Manejo de Errores

El sistema maneja los siguientes casos de error:

1. **Paciente no encontrado**: Cuando se consulta una cédula que no existe
2. **Paciente sin historia**: Cuando el paciente existe pero no tiene historia clínica
3. **Historia duplicada**: Cuando se intenta crear una segunda historia para un paciente
4. **Errores de base de datos**: Problemas de conexión o consultas inválidas
5. **Validación de datos**: Campos requeridos o formatos inválidos

## Tecnologías y Versiones

- Node.js: 18+
- Express: 4.18.2
- Apollo Server Express: 3.13.0
- GraphQL: 16.8.1
- Sequelize: 6.35.2
- MySQL2: 3.6.5
- Docker: 20+
- MySQL: 8.0

## Autor

Proyecto desarrollado para el Parcial Práctico de Arquitectura de Software.

## Licencia

MIT
