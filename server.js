import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = process.env.CLIENT_URL

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
});