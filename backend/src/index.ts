import express from "express";
import "dotenv/config";
import { connectDB } from "./db/connection.js";
import userRouter from "./routes/users.js";
import { app } from "./app.js";
const port = process.env.PORT;

try {
  await connectDB();
  // see if app has error before listening
  app.listen(port || 8000, () => {
    console.log(`Server is running at ${port}`);
  });
} catch (error) {
  console.error("Error connecting to db", error);
}
