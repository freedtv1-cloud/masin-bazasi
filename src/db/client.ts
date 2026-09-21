import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Supabase / hər hansı Postgres bağlantısı. Netlify-də bu, Environment
// Variables bölməsində DATABASE_URL kimi qoyulmalıdır (Supabase layihə
// ayarlarında "Connection string" → "Transaction pooler" tövsiyə olunur).
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL tapılmadı. .env.local faylına (yerli inkişaf üçün) və ya " +
      "Netlify Environment Variables bölməsinə (istehsalat üçün) Supabase " +
      "Postgres bağlantı sətrini əlavə edin."
  );
}

// Supabase-in pooler qoşulmaları üçün "prepare: false" tövsiyə olunur.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
