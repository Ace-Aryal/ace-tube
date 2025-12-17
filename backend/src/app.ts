// this file just expors the express app instance
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// set the json body limit
app.use(express.json({ limit: "16kb" }));
// set the urlencoded body limit
app.use(urlencoded({ extended: true, limit: "16kb" }));
// set the static folder (favicons, logos etc)
app.use(express.static("public"));
// set the cookie parser
app.use(cookieParser());
export { app };
