import { projects } from "./projects-data.js";

const carousel = document.querySelector(".section-carousel");
projects.forEach(e => {
    const a = document.createElement("a");
    a.href = `/pages/project.html?id=${e.id}`;
    a.classList.add("carousel-item", "animated-button");

    const carouselItem = document.createElement("x-image-title-frame");
    carouselItem.classList.add("image-title-frame");
    carouselItem.setAttribute("x-title", e.title);
    
    const img = document.createElement("img");
    img.src = e.coverImage;
    img.alt = e.coverAlt;
    img.title = e.title;

    carouselItem.appendChild(img);
    a.appendChild(carouselItem);
    carousel.appendChild(a);
});