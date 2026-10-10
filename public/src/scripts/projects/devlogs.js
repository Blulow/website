import { addProjects } from "./projects-data.js";

// navbar

const devlogsBtn = document.querySelector(".nav-devlogs-btn");
devlogsBtn.classList.add("nav-btn-active");

// projects

addProjects(["devlog-container"], "devlogs");

// version

const version = new URLSearchParams(window.location.search).get("version") || "public";
fetch(`/api/content?version=${version}`)
    .then(res => res.json())
    .then(data => {
        const icon = document.querySelector("link[rel=\"shortcut icon\"]");
        const r = new URL("../../../", import.meta.url).href;
        if (data.img) icon.href = r + data.img;
    })
    .catch(err => console.error("Error loading version content:", err));