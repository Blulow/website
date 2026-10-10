require("dotenv").config();
const path = require("path");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/content", (req, res) => {
    const isPersonal = req.query.version === process.env.PERSONAL_VERSION_ID;
    if (isPersonal) {
        try {
            const alt = process.env.TEST;
            return res.json(alt);
        } catch (error) {
            return res.status(500).json({ error: "Failed to parse alternate content from .env" });
        }
    }

    res.json({});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));