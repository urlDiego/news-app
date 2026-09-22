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

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull()
});

export const bookmarks = pgTable('bookmarks', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id).notNull(),
    article_id: integer('article_id').references(() => articles.id).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type ArticleInsert = typeof articles.$inferInsert;

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type BookmarkInsert = typeof bookmarks.$inferInsert;