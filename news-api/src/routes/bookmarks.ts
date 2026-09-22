import type { FastifyInstance } from "fastify";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookmarks, articles } from "../db/schema.js";

const authenticate = async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized: Invalid or missing token" });
  }
};

export async function bookmarkRoutes(fastify: FastifyInstance) {
  // Proteger todas las rutas de marcadores con preHandler
  fastify.addHook("preHandler", authenticate);

  // 1. Obtener todos los marcadores del usuario autenticado
  fastify.get("/", async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;

      const userBookmarks = await db
        .select({
          id: articles.id,
          title: articles.title,
          description: articles.description,
          image_url: articles.image_url,
          url: articles.url,
          source: articles.source,
          published_at: articles.published_at,
          bookmarked_at: bookmarks.created_at,
        })
        .from(bookmarks)
        .innerJoin(articles, eq(bookmarks.article_id, articles.id))
        .where(eq(bookmarks.user_id, userId));

      return userBookmarks;
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // 2. Verificar si un artículo específico está guardado
  fastify.get("/check/:articleId", async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const { articleId } = request.params as { articleId: string };

      const [existing] = await db
        .select()
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.user_id, userId),
            eq(bookmarks.article_id, Number(articleId))
          )
        )
        .limit(1);

      return { bookmarked: !!existing };
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // 3. Guardar artículo en favoritos
  fastify.post("/", async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const { articleId } = request.body as { articleId: number };

      if (!articleId) {
        return reply.status(400).send({ error: "articleId is required" });
      }

      const [existing] = await db
        .select()
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.user_id, userId),
            eq(bookmarks.article_id, Number(articleId))
          )
        )
        .limit(1);

      if (existing) {
        return reply.status(200).send({ message: "Already bookmarked", bookmarked: true });
      }

      await db.insert(bookmarks).values({
        user_id: userId,
        article_id: Number(articleId),
      });

      return reply.status(201).send({ message: "Article bookmarked", bookmarked: true });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // 4. Eliminar artículo de favoritos
  fastify.delete("/:articleId", async (request, reply) => {
    try {
      const userId = (request.user as { id: number }).id;
      const { articleId } = request.params as { articleId: string };

      await db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.user_id, userId),
            eq(bookmarks.article_id, Number(articleId))
          )
        );

      return reply.status(200).send({ message: "Bookmark removed", bookmarked: false });
    } catch (err) {
      request.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
