export const projects = await fetch("/assets/data/projects.json")
    .then(res => res.json())
    .catch(err => console.error(err));