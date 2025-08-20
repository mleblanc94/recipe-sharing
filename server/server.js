// server/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection'); // this should call mongoose.connect(...)

const PORT = process.env.PORT || 3001;

async function start() {
  // --- create express app
  const app = express();

  // --- CORS: allow your Vite dev origin(s)
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'], // add others if needed
      credentials: true, // set to true only if you will use cookies
    })
  );

  // --- body parsers
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // --- Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // --- static assets (images)
  app.use('/images', express.static(path.join(__dirname, '../client/images')));

  // --- production: serve built client
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // --- start only after Mongo is connected
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API Server running on port ${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});