import express from 'express';
import { handleGenerateNewShortUrl, handleGetAnalytics , handleShortId } from '../controllers/url.js';
import URL from "../models/url.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const urls = await URL.find({});
        return res.json(urls);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch URLs" });
    }
});


router.post("/", handleGenerateNewShortUrl)

router.get("/:shortId" , handleShortId)

router.get("/analytics/:shortId" , handleGetAnalytics)

export default router;