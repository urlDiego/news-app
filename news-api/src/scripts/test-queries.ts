import { articles } from "../db/schema.js";
import { db, pool } from "../db/index.js";
import { eq } from "drizzle-orm";


async function findAll() {
    const result = await db.select().from(articles);
    console.log(result);
}

async function findById(id: number) {
    const result = await db.select().from(articles).where(eq(articles.id, id));
    console.log(result);
}

async function findByCategory(category_id: number) {
    const result = await db.select().from(articles).where(eq(articles.category_id, category_id));
    console.log(result);
}

async function main() {
    await findAll();
    await findById(2);
    await findByCategory(3);
    await pool.end();
}

main();