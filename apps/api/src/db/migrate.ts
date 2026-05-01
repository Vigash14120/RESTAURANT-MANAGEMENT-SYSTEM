import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RowDataPacket } from "mysql2";

import { pool } from "./mysql.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDirectory = path.resolve(__dirname, "../../../../database/migrations");

interface MigrationRow extends RowDataPacket {
  file_name: string;
}

async function ensureMigrationTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      file_name VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getPendingMigrationFiles(): Promise<string[]> {
  const [rows] = await pool.query<MigrationRow[]>("SELECT file_name FROM schema_migrations");
  const applied = new Set(rows.map((row) => row.file_name));

  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  return files.filter((file) => !applied.has(file));
}

async function applyMigration(fileName: string): Promise<void> {
  const sqlPath = path.join(migrationsDirectory, fileName);
  const sqlContent = await readFile(sqlPath, "utf8");
  const migrationSql = sqlContent.trim();
  if (migrationSql.length === 0) {
    throw new Error(`Migration file "${fileName}" is empty.`);
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(migrationSql);
    await connection.query("INSERT INTO schema_migrations (file_name) VALUES (?)", [fileName]);
    await connection.commit();
    console.log(`Applied migration: ${fileName}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function runMigrations(): Promise<void> {
  await ensureMigrationTable();
  const pendingFiles = await getPendingMigrationFiles();
  if (pendingFiles.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  for (const fileName of pendingFiles) {
    await applyMigration(fileName);
  }
}

runMigrations()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error: unknown) => {
    console.error("Migration failed.", error);
    await pool.end();
    process.exit(1);
  });
