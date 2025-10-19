import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./data.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomefilme TEXT NOT NULL,
      nota INTEGER NOT NULL,
      genero TEXT,
      comentario TEXT,
      data TEXT,
      capa TEXT
    )
  `);

  return db;
}
