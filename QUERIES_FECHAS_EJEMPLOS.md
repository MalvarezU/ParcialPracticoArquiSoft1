# Ejemplos de Queries con Manejo de Fechas

Este documento muestra ejemplos de consultas GraphQL que demuestran el mejor manejo de fechas implementado en el proyecto.

## 📅 Formatos de Fecha Soportados

El sistema ahora acepta múltiples formatos de fecha:

- `YYYY-MM-DD` (ej: `2024-01-15`)
- `DD/MM/YYYY` (ej: `15/01/2024`)
- `ISO 8601` (ej: `2024-01-15T10:30:00Z`)
- `DD/MM/YYYY HH:mm:ss` (ej: `15/01/2024 10:30:00`)

## 🔍 Query: Obtener Historia Clínica por Cédula

Esta consulta muestra cómo se devuelven las fechas formateadas correctamente:

```graphql
query {
  obtenerHistoriaClinicaPorCedula(cedula: "1234567890") {
    id
    motivoConsulta
    diagnostico
    tratamiento
    fecha                  # Fecha de la historia clínica
    createdAt              # Fecha de creación
    updatedAt              # Fecha de última modificación
    paciente {
      id
      nombre
      apellido
      cedula
      edad
      genero
      createdAt            # Fecha de creación del paciente
      updatedAt            # Fecha de última modificación del paciente
    }
    doctores {
      id
      nombre
      cedulaProfesional
      especialidad
      createdAt            # Fecha de creación del doctor
      updatedAt            # Fecha de última modificación del doctor
    }
  }
}
```

### **Respuesta Esperada:**

```json
{
  "data": {
    "obtenerHistoriaClinicaPorCedula": {
      "id": "1",
      "motivoConsulta": "Dolor en el pecho y dificultad para respirar",
      "diagnostico": "Hipertensión arterial grado II",
      "tratamiento": "Losartán 50mg cada 12 horas",
      "fecha": "2024-01-15T10:30:00.000-05:00",
      "createdAt": "2024-01-15T10:30:00.000-05:00",
      "updatedAt": "2024-01-15T10:30:00.000-05:00",
      "paciente": {
        "id": "1",
        "nombre": "Juan",
        "apellido": "Pérez",
        "cedula": "1234567890",
        "edad": 45,
        "genero": "Masculino",
        "createdAt": "2024-01-15T10:30:00.000-05:00",
        "updatedAt": "2024-01-15T10:30:00.000-05:00"
      },
      "doctores": [
        {
          "id": "1",
          "nombre": "Dr. Roberto Silva",
          "cedulaProfesional": "DOC001",
          "especialidad": "Cardiología",
          "createdAt": "2024-01-15T10:30:00.000-05:00",
          "updatedAt": "2024-01-15T10:30:00.000-05:00"
        }
      ]
    }
  }
}
```

## 📝 Mutation: Registrar Historia Clínica con Diferentes Formatos de Fecha

### **Ejemplo 1: Usando formato YYYY-MM-DD**

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
    fecha
    createdAt
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

### **Ejemplo 2: Usando formato DD/MM/YYYY**

```graphql
mutation {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "María"
      apellido: "González"
      cedula: "5555555555"
      edad: 28
      genero: "Femenino"
    }
    doctores: [
      {
        nombre: "Dra. Laura Fernández"
        cedulaProfesional: "DOC002"
        especialidad: "Medicina General"
      }
    ]
    motivoConsulta: "Fiebre y dolor de garganta"
    diagnostico: "Amigdalitis bacteriana"
    tratamiento: "Antibióticos y analgésicos"
    fecha: "15/03/2024"
  }) {
    id
    fecha
    paciente {
      nombre
      apellido
    }
  }
}
```

### **Ejemplo 3: Usando formato ISO 8601**

```graphql
mutation {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Carlos"
      apellido: "Rodríguez"
      cedula: "6666666666"
      edad: 52
      genero: "Masculino"
    }
    doctores: [
      {
        nombre: "Dr. Miguel Ángel Torres"
        cedulaProfesional: "DOC003"
        especialidad: "Neurología"
      }
    ]
    motivoConsulta: "Mareos frecuentes"
    diagnostico: "Vértigo paroxístico benigno"
    tratamiento: "Betahistina y reposo"
    fecha: "2024-03-15T14:30:00Z"
  }) {
    id
    fecha
    createdAt
    paciente {
      nombre
      apellido
    }
  }
}
```

### **Ejemplo 4: Sin especificar fecha (usará fecha actual)**

```graphql
mutation {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Ana"
      apellido: "Martínez"
      cedula: "7777777777"
      edad: 31
      genero: "Femenino"
    }
    doctores: [
      {
        nombre: "Dra. Patricia Ramírez"
        cedulaProfesional: "DOC004"
        especialidad: "Pediatría"
      }
    ]
    motivoConsulta: "Control rutinario"
    diagnostico: "Niño sano"
    tratamiento: "Continuar controles periódicos"
    # No se especifica fecha, usará la fecha actual
  }) {
    id
    fecha
    createdAt
    paciente {
      nombre
      apellido
    }
  }
}
```

## 🚫 Ejemplo de Error: Formato de Fecha Inválido

```graphql
mutation {
  registrarHistoriaClinica(input: {
    paciente: {
      nombre: "Error"
      apellido: "Prueba"
      cedula: "9999999999"
      edad: 25
      genero: "Otro"
    }
    doctores: [
      {
        nombre: "Dr. Test"
        cedulaProfesional: "DOC999"
        especialidad: "Test"
      }
    ]
    motivoConsulta: "Test error"
    diagnostico: "Test"
    tratamiento: "Test"
    fecha: "fecha_invalida"  # Esto causará un error
  }) {
    id
    fecha
  }
}
```

### **Respuesta de Error:**

```json
{
  "errors": [
    {
      "message": "Error al registrar historia clínica: Formato de fecha inválido. Use formatos: YYYY-MM-DD, DD/MM/YYYY, o formato ISO",
      "locations": [
        {
          "line": 1,
          "column": 2
        }
      ],
      "path": [
        "registrarHistoriaClinica"
      ]
    }
  ],
  "data": null
}
```

## 📋 Query: Obtener Todas las Historias Clínicas

Esta consulta muestra todas las fechas formateadas en la lista completa:

```graphql
query {
  obtenerTodasHistoriasClinicas {
    id
    motivoConsulta
    diagnostico
    fecha
    createdAt
    updatedAt
    paciente {
      nombre
      apellido
      createdAt
    }
    doctores {
      nombre
      especialidad
      createdAt
    }
  }
}
```

## 📊 Query: Obtener Todos los Pacientes

```graphql
query {
  obtenerTodosPacientes {
    id
    nombre
    apellido
    cedula
    edad
    genero
    createdAt
    updatedAt
    historiaClinica {
      id
      fecha
      motivoConsulta
    }
  }
}
```

## 👨‍⚕️ Query: Obtener Todos los Doctores

```graphql
query {
  obtenerTodosDoctores {
    id
    nombre
    cedulaProfesional
    especialidad
    createdAt
    updatedAt
  }
}
```

## 🎯 Características Implementadas

1. **Formateo Consistente**: Todas las fechas se devuelven en formato ISO 8601 con zona horaria
2. **Múltiples Formatos de Entrada**: El sistema acepta diferentes formatos de fecha
3. **Validación de Fechas**: Se validan todas las fechas de entrada
4. **Manejo de Errores**: Mensajes de error claros para fechas inválidas
5. **Zona Horaria**: Todas las fechas usan la zona horaria de Bogotá (America/Bogota)
6. **Fechas Nulas**: Manejo seguro de fechas nulas o inválidas

## 🔧 Notas Técnicas

- **Zona Horaria**: Todas las fechas se manejan en la zona horaria `America/Bogota`
- **Formato de Salida**: Las fechas se devuelven en formato ISO 8601 completo
- **Validación**: Se validan todos los formatos de fecha de entrada
- **Seguridad**: El sistema maneja correctamente fechas nulas o inválidas
- **Consistencia**: Todas las entidades (Paciente, Doctor, HistoriaClinica) usan el mismo formateo de fechas
