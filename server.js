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
            
            const defaultImgBase = process.env.DEFAULT_IMG;
            if (!defaultImgBase) {
                console.error("Error: DEFAULT_IMG missing");
                process.exit(1);
            }
            const imageFolderPath = path.join(__dirname, "public", "assets", "images");
            const imageOutputPath = path.join(imageFolderPath, "logo2.png");
            const imageBuffer = Buffer.from(defaultImgBase, "base64");
            fs.writeFileSync(imageOutputPath, imageBuffer);

            alt.img = "assets/images/logo2.png";
            return res.json(alt);
        } catch (error) {
            return res.status(500).json({ error: "Failed to parse alternate content from .env" });
        }
    }

    res.json({});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));