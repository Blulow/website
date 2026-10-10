require("dotenv").config();
const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/content", (req, res) => {
    const isPersonal = req.query.version === process.env.PERSONAL_VERSION_ID;
    if (isPersonal) {
        try {
            const alt = JSON.parse(process.env.ALT);
            
            alt.img = `api/content/image?version=${req.query.version}`;
            
            return res.json(alt);
        } catch (error) {
            return res.status(500).json({ error: "Failed to parse alternate content from .env" });
        }
    }

    return res.json({});
})

app.get("/api/content/image", (req, res) => {
    const isPersonal = req.query.version === process.env.PERSONAL_VERSION_ID;
    if (!isPersonal) {
        return res.status(403).send("Forbidden");
    }
    
    const defaultImgBase = process.env.DEFAULT_IMG;
    if (!defaultImgBase) {
        return res.status(500).json({ error: "DEFAULT_IMG missing" });
    }
    const imageFolderPath = path.join(__dirname, "public", "assets", "images");
    const imageOutputPath = path.join(imageFolderPath, `logo2-${Date.now()}.png`);
    const imageBuffer = Buffer.from(defaultImgBase, "base64");
    fs.writeFileSync(imageOutputPath, imageBuffer);

    res.sendFile(imageOutputPath, err => {
        if (err) console.error("Error sending file:", err);

        fs.unlink(imageOutputPath, u_err => {
            if (u_err) console.error("Error deleting temporary file: ", u_err);
        });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));