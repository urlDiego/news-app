CREATE TABLE "articles" (
	"id" serial PRIMARY KEY,
	"title" varchar(200) NOT NULL,
	"description" varchar(255),
	"image_url" varchar(255),
	"url" varchar(255) NOT NULL UNIQUE,
	"category_id" integer,
	"published_at" timestamp DEFAULT now(),
	"source" varchar(255),
	"is_featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");