import { addProjects } from "./projects-data.js";

// navbar

const devlogsBtn = document.querySelector(".nav-devlogs-btn");
devlogsBtn.classList.add("nav-btn-active");

// projects

addProjects(["devlog-container"], "devlogs");