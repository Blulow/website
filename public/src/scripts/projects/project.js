import { locations, getProjects } from "./projects-data.js";

// project content loading

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const src = params.get("src");
if (!id || !src) throw new Error("Missing project ID or source.");

const location = locations[src];
if (!location) throw new Error(`Unknown data source: ${src}`);

const projects = await getProjects(location);
const project = projects.find(e => e.id === id);

document.title = project.title;

const container = document.querySelector(".blog-container");
const f = new URL(".", import.meta.url).href;
const p = new URL("../../../", f).href;
container.innerHTML = `
    <x-blog class="blog" x-title="${project.title}" x-content="${p}/${project.content}"></x-blog>
`;

// devlog nav

if (src === "devlogs") document.querySelector("#container").appendChild(document.createElement("x-devlog-nav"));