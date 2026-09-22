CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_article_id_articles_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id");