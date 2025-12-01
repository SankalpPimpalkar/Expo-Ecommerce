import express from "express";
import path from "path";
import { ENV } from "./config/config.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'

const app = express()
const __dirname = path.resolve()

// Middlewares
app.use(clerkMiddleware())

app.get("/api/health", (req, res) => {
    return res.status(200).json({ message: "Success" })
})

if (ENV.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));
    
    app.get("/{*any}", (req,res) => {
        return res
        .sendFile(path.json(__dirname, "../admin", "dist", "index.html"))
    })
}

app.listen(ENV.PORT, () => {
    console.log("Server is up and runnning")
    connectDB()
})