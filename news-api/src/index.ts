import Fastify, { type FastifyError } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { categoryRoutes } from './routes/categories.js'
import { articleRoutes } from './routes/articles.js'
import { authRoutes } from './routes/auth.js';
import { bookmarkRoutes } from './routes/bookmarks.js';
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

const allowedOrigins = [
  'http://localhost:4321',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

fastify.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return cb(null, true);
    }
    return cb(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'secret_fallback',
})

fastify.get('/', async (request, reply) => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await fastify.register(categoryRoutes, {
      prefix: '/api/categories'
    });
    await fastify.register(articleRoutes, {
      prefix: '/api/articles'
    });
    await fastify.register(authRoutes, {
      prefix: '/auth'
    });
    await fastify.register(bookmarkRoutes, {
      prefix: '/api/bookmarks'
    });
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

fastify.setErrorHandler(function (error: FastifyError, request, reply) {
  request.log.error(error)
  const statusCode = error.statusCode || 500
  reply.status(statusCode).send({
    statusCode,
    error: error.name || 'Internal Server Error',
    message: error.message
  });
})

start();