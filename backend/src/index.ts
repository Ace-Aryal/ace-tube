import express from "express";
import "dotenv/config";
import { connectDB } from "./db/connection.js";
const app = express();
const port = process.env.PORT;

connectDB();
app.get("/", (req, res) => {
  res.send("Hola from Express + TypeScript!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
