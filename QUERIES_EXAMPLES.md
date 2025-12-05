# Ejemplos de Queries y Mutations GraphQL

Este archivo contiene ejemplos listos para copiar y pegar en GraphQL Playground o Apollo Studio.

## Queries

### 1. Consultar Historia Clínica por Cédula

```graphql
query ConsultarHistoria {
  obtenerHistoriaClinicaPorCedula(cedula: "1234567890") {
    id
    motivoConsulta
    diagnostico
    tratamiento
    fecha
    paciente {
      id
      nombre
      apellido
      cedula
      edad
      genero
    }
    doctores {
      id
      nombre
      cedulaProfesional
      especialidad
    }
  }
}
```

### 2. Obtener Todos los Pacientes

```graphql
query ObtenerPacientes {
  obtenerTodosPacientes {
    id
    nombre
    apellido
    cedula
    edad
    genero
    historiaClinica {
      id
      motivoConsulta
      diagnostico
      fecha
    }
  }
}
```

### 3. Obtener Todos los Doctores

```graphql
query ObtenerDoctores {
  obtenerTodosDoctores {
    id
    nombre
    cedulaProfesional
    especialidad
    createdAt
  }
}
```

### 4. Obtener Todas las Historias Clínicas

```graphql
query ObtenerTodasHistorias {
  obtenerTodasHistoriasClinicas {
    id
    motivoConsulta
    diagnostico
    tratamiento
    fecha
    paciente {
      nombre
      apellido
      cedula
      edad
    }
    doctores {
      nombre
      especialidad
    }
  }
}
```

## Mutations

### 1. Registrar Historia Clínica (Paciente y Doctor Nuevos)

```graphql
mutation RegistrarHistoriaNueva {
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
        nombre: "Dr. José Mendoza"
        cedulaProfesional: "DOC999"
        especialidad: "Medicina Interna"
      }
    ]
    motivoConsulta: "Dolor de cabeza persistente durante 3 días"
    diagnostico: "Cefalea tensional aguda"
    tratamiento: "Ibuprofeno 400mg cada 8 horas por 5 días, descanso"
    fecha: "2024-03-15"
  }) {
    id
    motivoConsulta
    diagnostico
    tratamiento
    fecha
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

### 2. Registrar Historia Clínica (Reutilizando Paciente Existente)

Esta mutation intentará crear una historia para Ana Martínez (cédula: 5544332211) que existe pero no tiene historia clínica.

```graphql
mutation RegistrarHistoriaParaPacienteExistente {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Ana"
      apellido: "Martínez"
      cedula: "5544332211"
      edad: 28
      genero: "Femenino"
    }
    doctores: [
      {
        nombre: "Dra. Patricia Ramírez"
        cedulaProfesional: "DOC004"
        especialidad: "Pediatría"
      }
    ]
    motivoConsulta: "Control de rutina y vacunación"
    diagnostico: "Paciente sana, aplicación de vacuna contra influenza"
    tratamiento: "Vacuna aplicada, control en 1 año"
    fecha: "2024-03-20"
  }) {
    id
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

### 3. Registrar Historia con Múltiples Doctores

```graphql
mutation RegistrarHistoriaMultiplesDoctores {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Luis"
      apellido: "García"
      cedula: "1357924680"
      edad: 62
      genero: "Masculino"
    }
    doctores: [
      {
        nombre: "Dr. Roberto Silva"
        cedulaProfesional: "DOC001"
        especialidad: "Cardiología"
      },
      {
        nombre: "Dr. Miguel Ángel Torres"
        cedulaProfesional: "DOC003"
        especialidad: "Neurología"
      },
      {
        nombre: "Dra. Laura Fernández"
        cedulaProfesional: "DOC002"
        especialidad: "Medicina General"
      }
    ]
    motivoConsulta: "Dolor en el pecho con mareos y entumecimiento"
    diagnostico: "Enfermedad cardiovascular con complicaciones neurológicas"
    tratamiento: "Aspirina 100mg diario, atorvastatina 40mg nocturno, control mensual con equipo multidisciplinario"
    fecha: "2024-03-18"
  }) {
    id
    motivoConsulta
    diagnostico
    paciente {
      nombre
      apellido
    }
    doctores {
      nombre
      especialidad
    }
  }
}
```

### 4. Intento de Duplicar Historia (Debe Fallar)

Esta mutation debe fallar porque Juan Pérez ya tiene una historia clínica registrada.

```graphql
mutation IntentarDuplicarHistoria {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Juan"
      apellido: "Pérez"
      cedula: "1234567890"
      edad: 45
      genero: "Masculino"
    }
    doctores: [
      {
        nombre: "Dr. Roberto Silva"
        cedulaProfesional: "DOC001"
        especialidad: "Cardiología"
      }
    ]
    motivoConsulta: "Segunda consulta"
    diagnostico: "Control"
    tratamiento: "Continuar tratamiento"
    fecha: "2024-03-25"
  }) {
    id
  }
}
```

**Respuesta esperada (Error):**
```json
{
  "errors": [
    {
      "message": "Error al registrar historia clínica: El paciente con cédula 1234567890 ya tiene una historia clínica registrada"
    }
  ]
}
```

## Casos de Prueba

### Caso 1: Consulta Exitosa
- **Query**: `obtenerHistoriaClinicaPorCedula`
- **Input**: cedula: "1234567890"
- **Resultado Esperado**: Retorna la historia de Juan Pérez con sus doctores

### Caso 2: Paciente No Encontrado
- **Query**: `obtenerHistoriaClinicaPorCedula`
- **Input**: cedula: "0000000000"
- **Resultado Esperado**: Error "No se encontró un paciente con cédula 0000000000"

### Caso 3: Paciente Sin Historia
- **Query**: `obtenerHistoriaClinicaPorCedula`
- **Input**: cedula: "5544332211" (Ana Martínez)
- **Resultado Esperado**: Error "El paciente con cédula 5544332211 no tiene historia clínica registrada"

### Caso 4: Registro Exitoso con Nuevos Datos
- **Mutation**: `registrarHistoriaClinica`
- **Input**: Nuevos paciente y doctor
- **Resultado Esperado**: Historia creada con nuevos registros

### Caso 5: Registro con Reutilización
- **Mutation**: `registrarHistoriaClinica`
- **Input**: Cédulas de paciente/doctor existentes
- **Resultado Esperado**: Historia creada reutilizando registros existentes

### Caso 6: Prevención de Duplicados
- **Mutation**: `registrarHistoriaClinica`
- **Input**: Paciente con historia existente
- **Resultado Esperado**: Error de historia duplicada

## Variables de Query

Puedes usar variables para hacer las queries más dinámicas:

```graphql
query ConsultarHistoriaConVariable($cedula: String!) {
  obtenerHistoriaClinicaPorCedula(cedula: $cedula) {
    id
    motivoConsulta
    paciente {
      nombre
      apellido
    }
  }
}
```

**Variables:**
```json
{
  "cedula": "1234567890"
}
```

## Tips para Pruebas

1. **Ejecuta primero el seed**: `npm run seed` o `docker-compose exec app npm run seed`
2. **Usa el GraphQL Playground**: Visita `http://localhost:4000/graphql`
3. **Verifica los datos**: Usa las queries de listado para ver todos los registros
4. **Prueba casos de error**: Intenta duplicar historias o buscar cédulas inexistentes
5. **Experimenta con múltiples doctores**: Prueba asignar varios doctores a una historia

## Acceso Directo al Frontend

También puedes probar todas estas funcionalidades desde el frontend web:
- URL: http://localhost:4000
- Tab "Consultar Historia": Para queries por cédula
- Tab "Registrar Historia": Para crear nuevas historias
- Tab "Ver Todos": Para listar todas las historias
