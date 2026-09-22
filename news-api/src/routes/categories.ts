import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { categories } from '../db/schema.js'

export async function categoryRoutes(fastify: FastifyInstance) {
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