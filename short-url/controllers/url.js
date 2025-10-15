import shortid from 'shortid';
import URL from "../models/url.js"; 

async function handleGenerateNewShortUrl(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: "URL is required" });
    
        const shortID = shortid();

        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });
        return res.json({ id: shortID });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


async function handleShortId(req, res){
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            {
                shortId,
            }, {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            },
        },
            {new: true}
        );

         if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        return res.redirect(entry.redirectURL);

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

    async function handleGetAnalytics(req, res) {
        const shortId = req.params.shortId;
        const result = await URL.findOne({shortId});

        return res.json({
            totalClicks : result.visitHistory.length,
            analytics : result.visitHistory, 
        });
    }

export { handleGenerateNewShortUrl, handleShortId, handleGetAnalytics };