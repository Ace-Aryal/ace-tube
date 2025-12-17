import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DB_NAME}`
    );
    console.log("Database connected", connectionInstance.connection.base);
    return connectionInstance;
  } catch (err) {
    console.error(err, "Error connecting to db");
    process.exit(1);
  }
};
