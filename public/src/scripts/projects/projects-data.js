export const locations = {
    projects: "/public/assets/data/projects.json",
    devlogs: "/public/assets/data/devlogs.json"
}

export async function getProjects(location) {
    const projects = await fetch(location)
        .then(res => res.json())
        .catch(err => console.error(err));
    
    return projects;
}

export function addProject(data, container, src) {
    container.innerHTML += `
        <x-project-frame class="section-project-frame" x-title="${data.title}" x-href="/public/pages/project.html?src=${src}&id=${data.id}" x-src="${data.coverImage}" x-alt="${data.coverAlt}">
            ${data.description}
        </x-project-frame>
    `;
}

export async function addProjects(ids, src) {
    const projects = await getProjects(locations[src]);
    const projectTypes = [...new Set(projects.map(e => e.type))];

    if (projectTypes.length != ids.length) {
        throw new Error("Length of projectTypes and classNames are not equal.");
    }

    for (let i = 0; i < projectTypes.length; i++) {
        const _projects = projects.filter(e => e.type === projectTypes[i]);
        const project = document.getElementById(ids[i]);
        _projects.forEach(e => addProject(e, project, src));
    }
}