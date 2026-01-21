import mongoose from "mongoose";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT ,() => {
    console.log(`Serve listeing on Port ${process.env.PORT}`)
})