import { pgTable, serial, varchar, integer, boolean, timestamp, } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories',{
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    
})

export const articles = pgTable('articles', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    description: varchar('description', { length: 255 }),
    image_url: varchar('image_url', { length: 255 }),
    url: varchar('url', { length: 255 }).notNull().unique(),
    category_id: integer('category_id').references(() => categories.id),
    published_at: timestamp('published_at').defaultNow(),
    source: varchar('source', { length: 255 }),
    is_featured: boolean('is_featured').default(false).notNull(),
});

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type ArticleInsert = typeof articles.$inferInsert;