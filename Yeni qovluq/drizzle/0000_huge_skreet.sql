CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "brands_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "chronic_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_profile_id" integer NOT NULL,
	"description" text NOT NULL,
	"km_from" integer,
	"km_to" integer,
	"repair_cost_min" integer,
	"repair_cost_max" integer,
	"severity" text DEFAULT 'orta' NOT NULL,
	"source_type" text NOT NULL,
	"confidence" real DEFAULT 0.5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"scraped_at" timestamp with time zone,
	"processed_at" timestamp with time zone,
	"raw_text" text
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_profile_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"vin" text,
	"year" integer NOT NULL,
	"mileage_km" integer NOT NULL,
	"condition" text NOT NULL,
	"price" integer NOT NULL,
	"city" text NOT NULL,
	"description" text,
	"photo_url" text,
	"status" text DEFAULT 'aktiv' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer NOT NULL,
	"year_from" integer NOT NULL,
	"year_to" integer NOT NULL,
	"engine" text NOT NULL,
	"body_type" text,
	"summary" text
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_profile_id" integer NOT NULL,
	"date" text NOT NULL,
	"price" integer NOT NULL,
	"source" text
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"city" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chronic_problems" ADD CONSTRAINT "chronic_problems_model_profile_id_model_profiles_id_fk" FOREIGN KEY ("model_profile_id") REFERENCES "public"."model_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_model_profile_id_model_profiles_id_fk" FOREIGN KEY ("model_profile_id") REFERENCES "public"."model_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_profiles" ADD CONSTRAINT "model_profiles_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_points" ADD CONSTRAINT "price_points_model_profile_id_model_profiles_id_fk" FOREIGN KEY ("model_profile_id") REFERENCES "public"."model_profiles"("id") ON DELETE no action ON UPDATE no action;