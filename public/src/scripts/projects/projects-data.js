const f = new URL(".", import.meta.url).href;
const _public = new URL("../../../", f).href;

export const locations = {
    projects: `${_public}/assets/data/projects.json`,
    devlogs: `${_public}/assets/data/devlogs.json`
}

export async function getProjects(location) {
    const projects = await fetch(location)
        .then(res => res.json())
        .catch(err => console.error(err));
    
    return projects;
}

export function addProject(data, container, src) {
    const project = new URL("../../../pages/project.html", f).href;
    
    const version = new URLSearchParams(window.location.search).get("version") || "public";
    fetch(`/api/content?version=${version}`)
        .then(res => res.json())
        .then(data => {
            if (data.img) {
                document.querySelectorAll("x-project-frame")
                .forEach(e => {
                    if (e.getAttribute("x-src").includes("/logo.png")) {
                        e.setAttribute("x-src", `${_public}${data.img}`)
                    }
                });
            }
        })
        .catch(err => console.error("Error loading version content:", err));
    
    container.innerHTML += `
        <x-project-frame class="section-project-frame" x-title="${data.title}" x-href="${project}?src=${src}&id=${data.id}" x-src="${_public}${data.coverImage}" x-alt="${data.coverAlt}">
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