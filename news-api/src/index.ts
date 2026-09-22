import Fastify, { type FastifyError } from 'fastify'
import { categoryRoutes } from './routes/categories.js'
import { articleRoutes } from './routes/articles.js'
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: 'http://localhost:4321',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

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
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
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