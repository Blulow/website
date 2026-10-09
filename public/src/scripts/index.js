import { locations, getProjects } from "./projects/projects-data.js";

// navbar

const homeBtn = document.querySelector(".nav-home-btn");
homeBtn.classList.add("nav-btn-active");

// carousel

const carousel = document.querySelector("#projects-carousel");
const projects = await getProjects(locations.projects);
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

// video expanding

let expanded = false;

const expandVidBtn = document.querySelector(".expand-video");
const expandVidImg = expandVidBtn.children[0];

const introVid = document.querySelector(".intro-vid-container");
introVid.style.height = "70vh";

expandVidBtn.addEventListener("click", () => {
    if (expanded) {
        introVid.style.height = "70vh";
        expandVidImg.src = "/public/assets/images/expand-video.png";
        expandVidImg.alt = "Expand Video";
        expandVidImg.title = "Expand Video";
        expanded = false;
    } else {
        introVid.style.height = "100vh";
        expandVidImg.src = "/public/assets/images/shrink-video.png";
        expandVidImg.alt = "Shrink Video";
        expandVidImg.title = "Shrink Video";
        expanded = true;
    }
});