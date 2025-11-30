import express from "express";

const app = express()

app.get("/api/health", (req, res) => {
    return res.status(200).json({ message: "Success" })
})

app.listen(3000, () => {
    console.log("Server is up and runnning")
})