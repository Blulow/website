import { projects } from "./projects-data.js";

// get project data by type
const hProjects = projects.filter(e => e.type === "highlighted");
const oProjects = projects.filter(e => e.type === "regular");

// get containers
const highlighted = document.querySelector("#highlighted-container");
const other = document.querySelector("#other-container");

// add projects into container by type
hProjects.forEach(e => addProject(e, highlighted));
oProjects.forEach(e => addProject(e, other));

function addProject(data, container) {
    container.innerHTML += `
        <x-project-frame class="section-project-frame" x-title="${data.title}" x-href="/pages/project.html?id=${data.id}" x-src="${data.coverImage}" x-alt="${data.coverAlt}">
            ${data.description}
        </x-project-frame>
    `;
}