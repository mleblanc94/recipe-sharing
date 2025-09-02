// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

// allowlist for CORS
const FRONTEND_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_ORIGIN  // e.g. https://recipe-sharing-hub-97ef44b34b8f.herokuapp.com
].filter(Boolean);

async function start() {
  const app = express();

  app.use(cors({
    origin(origin, cb) {
      // allow same-origin/no-origin (SSR, curl, etc.)
      if (!origin) return cb(null, true);
      if (FRONTEND_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

  // static assets
  app.use('/images', express.static(path.join(__dirname, '../client/images')));

  if (process.env.NODE_ENV === 'production') {
    const dist = path.join(__dirname, '../client/dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API Server on ${PORT}`);
      console.log(`GraphQL: /graphql`);
      console.log(`CORS allowlist:`, FRONTEND_ORIGINS);
    });
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
