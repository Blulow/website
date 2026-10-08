import { addProjects } from "./projects-data.js";

// navbar

const projectsBtn = document.querySelector(".nav-projects-btn");
projectsBtn.classList.add("nav-btn-active");

// projects

addProjects(["highlighted-container", "other-container"], "projects");