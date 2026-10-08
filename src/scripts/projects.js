import { addProjects } from "./projects-data.js";

// navbar

const homeBtn = document.querySelector(".nav-projects-btn");
homeBtn.classList.add("nav-btn-active");

// projects

addProjects(["highlighted-container", "other-container"], "projects");