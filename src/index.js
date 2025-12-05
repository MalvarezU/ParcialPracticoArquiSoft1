const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  console.log('\n🏥 Iniciando servidor de Historias Clínicas...\n');

  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('No se pudo conectar a la base de datos. Reintentando en 5 segundos...');
    setTimeout(startServer, 5000);
    return;
  }

  await syncDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`\n✓ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✓ GraphQL disponible en http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`✓ Frontend disponible en http://localhost:${PORT}\n`);
  });
}

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
