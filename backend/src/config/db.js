import mongoose from "mongoose";
import { ENV } from "./config.js";

export async function connectDB() {
    try {
        const response = await mongoose.connect(ENV.DB_URL)
        console.log(`✅ Connected to MongoDB: ${response.connection.host}`)
    } catch (error) {
        console.error("❌ MongoDB Connection Error", error)
        process.exit(1)
    }
}