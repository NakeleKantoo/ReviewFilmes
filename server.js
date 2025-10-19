import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { initDB } from "./db.js";
import dotenv from "dotenv";

dotenv.config(); // 👈 load .env variables

const app = express();
const PORT = process.env.PORT || 3031;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let db;
initDB().then(database => (db = database));

/* === AVALIACOES === */
app.get("/api/avaliacoes", async (req, res) => {
  const avaliacoes = await db.all(`
    SELECT *
    FROM avaliacoes
  `);
  res.json(avaliacoes);
});

app.post("/api/avaliacoes", async (req, res) => {
  const { nomefilme, nota, comentario, data } = req.body;

  // Fetch movie cover from OMDB
  let capa = null;
  let genero = null;
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(nomefilme)}&apikey=${OMDB_API_KEY}`
    );
    const movie = await response.json();
    capa = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null;
    genero = movie.Genre;
  } catch (err) {
    console.error("OMDB fetch error:", err);
  }

  await db.run(
    "INSERT INTO avaliacoes (nomefilme, nota, genero, comentario, data, capa) VALUES (?, ?, ?, ?, ?, ?)",
    [nomefilme, nota, genero, comentario, data, capa]
  );

  res.json({ success: true });
});

app.delete("/api/avaliacoes/:id", async (req, res) => {
  await db.run("DELETE FROM avaliacoes WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
