import express from "express";
import path from "path";
import { ENV } from "./config/config.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"
import { functions, inngest } from "./config/inngest.js";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.routes.js";

const app = express()
const __dirname = path.resolve()

// Middlewares
app.use(express.json())
app.use(clerkMiddleware())


// Routes
app.use("/api/inngest", serve({ client: inngest, functions }))

app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)

app.get("/api/health", (req, res) => {
    return res.status(200).json({ message: "Success" })
})

if (ENV.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));

    app.get("/{*any}", (req, res) => {
        return res
            .sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

app.listen(ENV.PORT, () => {
    console.log("Server is up and runnning", ENV.PORT)
    connectDB()
})