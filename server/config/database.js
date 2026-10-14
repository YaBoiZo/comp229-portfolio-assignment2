import mongoose from "mongoose";
import { environment } from "./environment.js";

export async function connectDatabase(uri = environment.mongoUri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "Portfolio" });
  console.info("Connected to the Portfolio database.");
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
