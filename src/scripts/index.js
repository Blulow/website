import { projects } from "./projects-data.js";

const carousel = document.querySelector(".section-carousel");
projects.forEach(e => {
    const a = document.createElement("a");
    a.href = `/pages/project.html?id=${e.id}`;
    a.classList.add("carousel-item");

    const img = document.createElement("img");
    img.src = e.coverImage;
    img.alt = e.coverAlt;
    img.title = e.title;

    a.appendChild(img);
    carousel.appendChild(a);
});