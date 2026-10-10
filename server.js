require("dotenv").config();
const path = require("path");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/config", (req, res) => {
    console.log(res);
    res.json({
        test: process.env.TEST
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});