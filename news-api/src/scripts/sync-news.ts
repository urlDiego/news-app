import "dotenv/config";
import { db, pool } from "../db/index.js";
import { articles, categories } from "../db/schema.js";

interface NewsAPISource {
  id: string | null;
  name: string;
}

interface NewsAPIArticle {
  source: NewsAPISource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

async function syncNews() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY no está configurada en las variables de entorno");
  }

  const endpoint = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${apiKey}`;

  console.log("Iniciando sincronización con NewsAPI...");

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Error en la petición a NewsAPI: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as NewsAPIResponse;

    if (data.status !== "ok" || !Array.isArray(data.articles)) {
      console.warn("Respuesta inválida de NewsAPI:", data);
      return;
    }

    const [defaultCategory] = await db
      .select({ id: categories.id })
      .from(categories)
      .limit(1);

    const categoryId = defaultCategory?.id ?? 1;

    const articlesToInsert = data.articles
      .filter((item) => item.title && item.url && item.title !== "[Removed]")
      .map((item) => ({
        title: item.title.slice(0, 200),

        description: item.description ? item.description.slice(0, 255) : null,

        image_url: item.urlToImage ? item.urlToImage.slice(0, 255) : null,

        url: item.url,

        source: item.source?.name ? item.source.name.slice(0, 255) : "Desconocido",

        published_at: new Date(item.publishedAt),

        category_id: categoryId,
      }));

    if (articlesToInsert.length === 0) {
      console.log("No hay artículos válidos para insertar.");
      return;
    }

    const inserted = await db
      .insert(articles)
      .values(articlesToInsert)
      .onConflictDoNothing({ target: articles.url })
      .returning();

    console.log(`Sincronización completada. Se guardaron ${inserted.length} artículos nuevos.`);
  } catch (error) {
    console.error("Error durante syncNews:", error);
  } finally {
    console.log("Cerrando pool de conexiones...");
    await pool.end();
  }
}

syncNews();