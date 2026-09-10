import { projects } from "./projects-data.js";

const id = new URLSearchParams(window.location.search).get("id");
const project = projects.find(e => e.id === id);

document.title = project.title;

const container = document.querySelector(".blog-container");
container.innerHTML = `
    <x-blog class="blog" x-title="${project.title}" x-content="${project.content}"></x-blog>
`;