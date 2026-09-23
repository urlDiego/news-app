import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { categories } from '../db/schema.js'

/**
 * Registers REST API endpoints for article categories.
 * 
 * @param fastify - The Fastify instance to register routes on.
 */
export async function categoryRoutes(fastify: FastifyInstance) {
    /**
     * GET /api/categories
     * Fetches all registered news categories from PostgreSQL.
     */
    fastify.get('/', async (request, reply) => {
        try {
            const allCategories = await db.select().from(categories);
            return allCategories;
        } catch (err) {
            request.log.error(err);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}