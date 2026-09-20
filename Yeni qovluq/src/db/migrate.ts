import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL tapılmadı (.env.local faylını yoxlayın).");
  }

  // Migrasiya üçün ayrıca, tək-birləşmə (max: 1) client tövsiyə olunur.
  const migrationClient = postgres(connectionString, { max: 1, prepare: false });
  const db = drizzle(migrationClient);

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrasiya tamamlandı.");

  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
