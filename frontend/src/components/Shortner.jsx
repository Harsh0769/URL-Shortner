import React, { useState, useEffect } from "react";
import axios from "axios";

function Shortener() {
    const [url, setUrl] = useState("");
    const [generatedUrl, setGeneratedUrl] = useState("");
    const [urls, setUrls] = useState([]);


    useEffect(() => {
        axios.get("https://url-shortner-pr9n.onrender.com/url")
            .then(res => setUrls(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) {
            alert("Please enter a valid URL");
            return;
        }
        try {
            const res = await axios.post("https://url-shortner-pr9n.onrender.com/url", { url });
            setGeneratedUrl(`https://url-shortner-pr9n.onrender.com/${res.data.id}`);
        } catch {
            alert("Please Enter the Correct URL");
        }
    };

    const fetchAnalytics = async (shortId) => {
        try {
            const res = await axios.get(`https://url-shortner-pr9n.onrender.com/url/analytics/${shortId}`);

            const totalClicks = res.data.totalClicks;
            const analytics = res.data.analytics;

            if (analytics.length > 0) {
                const date = new Date(analytics[0].timestamp);

                const formattedDate = date.toLocaleString();
                alert(`Total Clicks   : ${totalClicks}, \nFirst Click At : ${formattedDate}`);
                return;
            } else {
                alert(`Total Clicks: ${totalClicks}, No Clicks Recorded Yet.`);
            }
        } catch (error) {
            alert("Failed to fetch analytics");
        }
    };

    // const fetchUrls = async () => {
    //     const res = await axios.get("http://localhost:8001/all-urls");
    //     setUrls(res.data);
    // };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="url-input"
                />
                <button type="submit" className="gen-btn">
                    Generate
                </button>
            </form>

            {generatedUrl && (
                <p>
                    Short URL: <a href={generatedUrl} target="_blank">{generatedUrl}</a>
                </p>
            )}

            <h2>URL History</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Original URL</th>
                        <th>Short URL</th>
                        <th>Clicks</th>
                        <th>Analytics</th>
                    </tr>
                </thead>
                <tbody>
                    {urls.map((item, index) => (
                        <tr key={index}>
                            <td data-label="Original URL" className="url-name">{item.redirectURL}</td>
                            <td data-label="Short URL">
                                <a className="Short-link" href={`https://url-shortner-pr9n.onrender.com/${item.shortId}`} target="_blank">
                                    {`https://url-shortner-pr9n.onrender.com/${item.shortId}`}
                                </a>

                            </td>
                            <td data-label="Clicks">{item.visitHistory.length}</td>
                            <td data-label="Analytics">
                                <button onClick={() => fetchAnalytics(item.shortId)}>
                                    View Analytics
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Shortener;
