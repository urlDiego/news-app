import Fastify from 'fastify';
import { categoryRoutes } from './routes/categories.js'
import { articleRoutes } from './routes/articles.js'

const fastify = Fastify({
  logger: true
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

start();