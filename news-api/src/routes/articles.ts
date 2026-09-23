import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { articles, categories } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export async function articleRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        try {
            const { 
                page = '1', 
                limit = '10',
                sort = 'new'
            } = request.query as { 
                page?: string; 
                limit?: string; 
                sort?: string; 
            };
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.max(1, Number(limit) || 10);
            const offsetNum = (pageNum - 1) * limitNum;

            let query = db.select({
                id: articles.id,
                title: articles.title,
                description: articles.description,
                image_url: articles.image_url,
                imageUrl: articles.image_url,
                urlToImage: articles.image_url,
                url: articles.url,
                source: articles.source,
                published_at: articles.published_at,
                publishedAt: articles.published_at,
                is_featured: articles.is_featured,
                isFeatured: articles.is_featured,
                category_id: articles.category_id,
            }).from(articles);

            if (sort === 'popular') {
                const allArticles = await query
                    .orderBy(desc(articles.published_at))
                    .limit(limitNum)
                    .offset(offsetNum + 10);
                return allArticles;
            } else if (sort === 'trending') {
                const allArticles = await query
                    .orderBy(desc(articles.published_at))
                    .limit(limitNum)
                    .offset(offsetNum + 20);
                return allArticles;
            } else {
                // Default 'new': latest news first
                const allArticles = await query
                    .orderBy(desc(articles.published_at))
                    .limit(limitNum)
                    .offset(offsetNum);
                return allArticles;
            }
        } catch (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const [item] = await db.select().from(articles).where(eq(articles.id, Number(id)));
            if (!item) {
                return reply.status(404).send({ error: 'Article not found' });
            }
            return {
                ...item,
                image_url: item.image_url,
                imageUrl: item.image_url,
                urlToImage: item.image_url,
                published_at: item.published_at,
                publishedAt: item.published_at,
            };
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
                    image_url: articles.image_url,
                    imageUrl: articles.image_url,
                    urlToImage: articles.image_url,
                    url: articles.url,
                    source: articles.source,
                    published_at: articles.published_at,
                    publishedAt: articles.published_at,
                    is_featured: articles.is_featured,
                    isFeatured: articles.is_featured,
                    categoryName: categories.name,
                    categorySlug: categories.slug
                })
                .from(articles)
                .innerJoin(categories, eq(articles.category_id, categories.id))
                .where(eq(categories.slug, slug))
                .orderBy(desc(articles.published_at));

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