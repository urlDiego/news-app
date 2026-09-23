import "dotenv/config";
import { db, pool } from "../db/index.js";
import { articles, categories } from "../db/schema.js";
import { inArray, eq } from "drizzle-orm";

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

const CATEGORIES_TO_SEED = [
  { name: "Technology", slug: "technology" },
  { name: "Science", slug: "science" },
  { name: "Business", slug: "business" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Sports", slug: "sports" },
  { name: "General", slug: "general" },
];

async function seedAndSync() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not defined");
  }

  console.log("🧹 1. Cleaning dummy test articles...");
  await db
    .delete(articles)
    .where(inArray(articles.url, ["url1.com", "url2.com", "url3.com"]));
  console.log("✓ Dummy articles removed.");

  console.log("📁 2. Ensuring all categories exist...");
  for (const cat of CATEGORIES_TO_SEED) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoNothing({ target: categories.slug });
  }
  const allCategories = await db.select().from(categories);
  console.log(`✓ Total categories in DB: ${allCategories.length}`);

  console.log("📰 3. Fetching and syncing news for each category...");
  let totalNew = 0;

  for (const cat of allCategories) {
    const endpoint = `https://newsapi.org/v2/top-headlines?country=us&category=${cat.slug}&apiKey=${apiKey}`;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        console.warn(`Could not fetch category ${cat.name}: ${res.statusText}`);
        continue;
      }

      const data = (await res.json()) as NewsAPIResponse;
      if (data.status !== "ok" || !Array.isArray(data.articles)) continue;

      const articlesToInsert = data.articles
        .filter((item) => item.title && item.url && item.title !== "[Removed]")
        .map((item) => ({
          title: item.title.slice(0, 255),
          description: item.description ?? null,
          image_url: item.urlToImage ?? null,
          url: item.url,
          source: item.source?.name ? item.source.name.slice(0, 255) : "Unknown",
          published_at: new Date(item.publishedAt),
          category_id: cat.id,
        }));

      if (articlesToInsert.length > 0) {
        const inserted = await db
          .insert(articles)
          .values(articlesToInsert)
          .onConflictDoNothing({ target: articles.url })
          .returning();

        totalNew += inserted.length;
        console.log(`  - Category ${cat.name}: added ${inserted.length} articles`);
      }
    } catch (err) {
      console.error(`Error syncing category ${cat.name}:`, err);
    }
  }

  console.log(`\n🎉 Sync complete! Total new articles inserted: ${totalNew}`);
  await pool.end();
}

seedAndSync().catch((e) => {
  console.error(e);
  pool.end();
});
