import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

if(PORT === undefined)
    throw new Error("Port is not defined!");

const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello world");
})

app.listen(PORT, () => console.log(`Farmly API listening on port ${PORT}...`))