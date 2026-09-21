import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Verilənlər bazası sxemi — konsepsiya sənədindəki "Verilənlər bazası sxemi"
 * bölməsinə uyğun qurulub. PostgreSQL (Supabase uyğun) üçün yazılıb —
 * Netlify kimi serverless mühitlərdə fayl əsaslı SQLite persistent
 * olmadığı üçün istehsalatda Postgres məcburidir.
 */

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brands.id),
  name: text("name").notNull(),
});

export const modelProfiles = pgTable("model_profiles", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id")
    .notNull()
    .references(() => models.id),
  yearFrom: integer("year_from").notNull(),
  yearTo: integer("year_to").notNull(),
  engine: text("engine").notNull(), // məs: "2.5L Benzin", "2.0L Dizel"
  bodyType: text("body_type"), // sedan, offroader, hetçbek və s.
  summary: text("summary"), // profilin qısa icmalı (AI-generasiyalı ola bilər)
  // 0-10 arası reytinq xalları — profil kartlarında dairəvi göstərici kimi çıxır.
  safetyScore: integer("safety_score"), // Təhlükəsizlik
  reliabilityScore: integer("reliability_score"), // Dözümlülük
  valueScore: integer("value_score"), // Qiymət/dəyər nisbəti
  performanceScore: integer("performance_score"), // Performans
});

export const chronicProblems = pgTable("chronic_problems", {
  id: serial("id").primaryKey(),
  modelProfileId: integer("model_profile_id")
    .notNull()
    .references(() => modelProfiles.id),
  description: text("description").notNull(),
  kmFrom: integer("km_from"),
  kmTo: integer("km_to"),
  repairCostMin: integer("repair_cost_min"), // AZN
  repairCostMax: integer("repair_cost_max"), // AZN
  severity: text("severity", { enum: ["aşağı", "orta", "yüksək"] })
    .notNull()
    .default("orta"),
  sourceType: text("source_type", {
    enum: ["forum", "xarici_baza", "ai_generasiya"],
  }).notNull(),
  confidence: real("confidence").notNull().default(0.5), // 0..1
});

export const pricePoints = pgTable("price_points", {
  id: serial("id").primaryKey(),
  modelProfileId: integer("model_profile_id")
    .notNull()
    .references(() => modelProfiles.id),
  date: text("date").notNull(), // ISO tarix (YYYY-MM-DD)
  price: integer("price").notNull(), // AZN
  source: text("source"),
});

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  modelProfileId: integer("model_profile_id")
    .notNull()
    .references(() => modelProfiles.id),
  sellerId: integer("seller_id")
    .notNull()
    .references(() => sellers.id),
  vin: text("vin"),
  year: integer("year").notNull(),
  mileageKm: integer("mileage_km").notNull(),
  condition: text("condition", {
    enum: ["əla", "yaxşı", "orta", "təmirə ehtiyaclı"],
  }).notNull(),
  price: integer("price").notNull(), // AZN
  city: text("city").notNull(),
  description: text("description"),
  photoUrl: text("photo_url"),
  status: text("status", { enum: ["aktiv", "satılıb", "arxiv"] })
    .notNull()
    .default("aktiv"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Elana aid bir neçə şəkil — photo_url sahəsi tək şəkil üçün saxlanılır,
// bu cədvəl isə çoxlu şəkil linkini sıra ilə saxlamağa imkan verir.
export const listingPhotos = pgTable("listing_photos", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  type: text("type", {
    enum: ["forum", "xarici_baza", "ai_generasiya"],
  }).notNull(),
  url: text("url"),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  rawText: text("raw_text"),
});
