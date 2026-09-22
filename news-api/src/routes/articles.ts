import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { articles, categories } from '../db/schema.js'
import { eq } from 'drizzle-orm';


export async function articleRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        try {
            const allArticles = await db.select().from(articles);
            return allArticles;
        } catch (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const article = await db.select().from(articles).where(eq(articles.id, Number(id)));
            if (article.length) {
                return article[0];
            }
            return reply.status(404).send({ error: 'Article not found' });
        } catch (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    fastify.get('/category/:slug', async (request, reply) => {
        try {
            const { slug } = request.params as { slug: string };
            const result = await db
                .select({
                    id: articles.id,
                    title: articles.title,
                    description: articles.description,
                    imageUrl: articles.image_url,
                    url: articles.url,
                    source: articles.source,
                    publishedAt: articles.published_at,
                    isFeatured: articles.is_featured,
                    categoryName: categories.name,
                    categorySlug: categories.slug
                })
                .from(articles)
                .innerJoin(categories, eq(articles.category_id, categories.id))
                .where(eq(categories.slug, slug));

            if (result.length) {
                return result;
            }

            reply.status(404).send({ error: 'Category not found' });
        } catch (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}