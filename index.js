const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require("pg");
app.use(express.json());
app.use(cors());

app.listen(3000, console.log("SERVER OK ON 3000"));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "like",
  password: "postgres",
  port: 5000,
  allowExitOnIdle: true,
});

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.log("Server ERROR");
    res.status(500).json({ message: "Server ERROR" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;
    const likes = 0;
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING id",
      [titulo, img, descripcion, likes]
    );
    const object = {
      id: result.rows[0].id,
      titulo: titulo,
      img: img,
      descripcion: descripcion,
      likes: likes,
    };
    res.json(object);
  } catch (error) {
    console.log("Server ERROR");
    res.status(500).json({ message: "Server ERROR" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      console.log("POST NO ENCONTRADO");
      res.status(404).json({ message: "POST NO ENCONTRADO" });
    } else {
      console.log("POST ELIMINADO");
      res.status(200).json({ message: "POST ELIMINADO" });
    }
  } catch (error) {
    console.log("Server ERROR");
    res.status(500).json({ message: "Server ERROR" });
  }
});

app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1",
      [id]
    );
    if (result.rowCount == 0) {
      console.log("POST NO ENCONTRADO");
      res.status(404).json({ message: "POST NO ENCONTRADO" });
    } else {
      console.log("LIKE AGREGADO");
      res.status(200).json({ message: "LIKE AGREGADO" });
    }
  } catch (error) {
    console.log("Server ERROR");
    res.status(500).json({ message: "Server ERROR" });
  }
});
