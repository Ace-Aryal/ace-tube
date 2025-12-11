import mongoose from "mongoose";
import { DB_NAME } from "../constants.ts";
export const connectDB = async () => {
  try {
    const conectionRes = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DB_NAME}`
    );
    console.log("Database connected", conectionRes);
  } catch (err) {
    console.error(err, "Error connecting to db");
    process.exit(1);
  }
};
