import express from 'express';
const app = express();
import URL from "../short-url/models/url.js";
import cors from "cors";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import connectToMongoDB from "../short-url/connect.js";
import urlRoute from "../short-url/routes/url.js";
const PORT = process.env.PORT;

connectToMongoDB(process.env.MONOGO_URI ||  "mongodb://localhost:27017/short-url")
    .then(() => { console.log("Connected to MongoDB") })
    .catch((err) => { console.error("Failed to connect to MongoDB", err) });

const __dirname = path.resolve()

app.use(express.json());
app.use(cors());


app.use("/url", urlRoute);
app.get("/:shortId", urlRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*" , (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend" , "dist" ,"index.html"));
});


app.listen(PORT , () => {
    console.log(process.env.BASE_URL || `http://localhost:${PORT}`);
})