export const projects = await fetch("/assets/data/projects.json")
    .then(res => res.json());