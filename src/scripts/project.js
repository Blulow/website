import { projects } from "./projects-data.js";

const id = new URLSearchParams(window.location.search).get("id");
const content = projects.find(e => e.id === id).content;
console.log(content);