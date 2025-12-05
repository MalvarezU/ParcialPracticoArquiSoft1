# Guía de Inicio Rápido

## Opción 1: Docker (Más Fácil)

```bash
# 1. Iniciar todo con Docker
docker-compose up --build

# 2. En otra terminal, cargar datos de prueba
docker-compose exec app npm run seed

# 3. Abrir en el navegador
# - Frontend: http://localhost:4000
# - GraphQL Playground: http://localhost:4000/graphql
```

## Opción 2: Sin Docker

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Editar .env con tus credenciales de MySQL

# 3. Crear base de datos MySQL
# Ejecutar en MySQL: CREATE DATABASE hospital_db;

# 4. Iniciar servidor
npm start

# 5. En otra terminal, cargar datos de prueba
npm run seed

# 6. Abrir en el navegador
# - Frontend: http://localhost:4000
# - GraphQL Playground: http://localhost:4000/graphql
```

## Probar el Sistema

### Desde el Frontend (http://localhost:4000)

1. **Tab "Consultar Historia"**:
   - Ingresa cédula: `1234567890`
   - Click "Consultar"

2. **Tab "Registrar Historia"**:
   - Llena el formulario
   - Puedes agregar múltiples doctores
   - Click "Registrar Historia Clínica"

3. **Tab "Ver Todos"**:
   - Click "Actualizar Lista"
   - Verás todas las historias

### Desde GraphQL Playground (http://localhost:4000/graphql)

Copia y pega esta query:

```graphql
query {
  obtenerHistoriaClinicaPorCedula(cedula: "1234567890") {
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

## Cédulas de Prueba

Después de ejecutar el seed:
- `1234567890` - Juan Pérez (tiene historia)
- `0987654321` - María González (tiene historia)
- `1122334455` - Carlos Rodríguez (tiene historia)
- `5544332211` - Ana Martínez (NO tiene historia, puedes crear una)

## Detener el Sistema

### Con Docker
```bash
docker-compose down
```

### Sin Docker
- Presiona `Ctrl+C` en la terminal donde corre el servidor

## Ver Más Ejemplos

- Ver `QUERIES_EXAMPLES.md` para más ejemplos de queries y mutations
- Ver `README.md` para documentación completa
