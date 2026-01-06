// this file uses all middlewares and routes and exports app ------------------------------
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";
import { appendFile, appendFileSync } from "node:fs";

const app = express();
// custom middleware in app level
app.use((req, res, next) => {
  appendFile(
    "logs.txt",
    `${req.method} at ${req.url} with cookies ${req.cookies}\n`,
    () => next()
  );
});
// 3rd party middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// set the json body limit
app.use(express.json({ limit: "16kb" }));
// set the urlencoded body limit
app.use(urlencoded({ extended: true, limit: "16kb" }));
// set the static folder (favicons, logos etc),now /temp in multer will point to public/temp
app.use(express.static("public"));
// set the cookie parser

app.use(cookieParser());

// routes import
import userRouter from "./routes/users.js";

//routes decleration
app.use("/api/v1/users", userRouter); // createas /users prefix to all the routes inside userRouter
export { app };
