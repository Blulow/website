import { addProjects } from "./projects-data.js";

// navbar

const projectsBtn = document.querySelector(".nav-projects-btn");
projectsBtn.classList.add("nav-btn-active");

// projects

addProjects(["highlighted-container", "other-container"], "projects");

// version

const version = new URLSearchParams(window.location.search).get("version") || "public";
fetch(`/api/content?version=${version}`)
    .then(res => res.json())
    .then(data => {
        const icon = document.querySelector("link[rel=\"shortcut icon\"]");
        console.log(icon);
        const r = new URL("../../../", import.meta.url).href;
        if (data.img) icon.href = r + data.img;
    })
    .catch(err => console.error("Error loading version content:", err));