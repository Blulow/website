import { locations, getProjects } from "./projects/projects-data.js";

// navbar

const homeBtn = document.querySelector(".nav-home-btn");
homeBtn.classList.add("nav-btn-active");

// carousel

const carousel = document.querySelector("#projects-carousel");
const projects = await getProjects(locations.projects);
projects.forEach(e => {
    const a = document.createElement("a");

    a.href = `pages/project.html?src=projects&id=${e.id}`;
    a.classList.add("carousel-item", "animated-button");

    const carouselItem = document.createElement("x-image-title-frame");
    carouselItem.classList.add("image-title-frame");
    carouselItem.setAttribute("x-title", e.title);
    
    const img = document.createElement("img");
    img.src = `${e.coverImage}`;
    img.alt = e.coverAlt;
    img.title = e.title;

    carouselItem.appendChild(img);
    a.appendChild(carouselItem);
    carousel.appendChild(a);
});

// intro vid

let expanded = false;

const expandVidBtn = document.querySelector(".expand-video");
const expandVidImg = expandVidBtn.children[0];

const introVid = document.querySelector(".intro-vid-container");
const introVidMarker = document.querySelector("#intro-vid-container-marker");
const navbar = document.querySelector("#navbar");
introVid.style.height = "70vh";
introVidMarker.style.height = `${window.innerHeight * 0.7 - navbar.clientHeight}px`;

expandVidBtn.addEventListener("click", () => {
    if (expanded) {
        introVid.style.height = "70vh";
        introVidMarker.style.height = `${window.innerHeight * 0.7 - navbar.clientHeight}px`;
        expandVidImg.src = "assets/images/expand-video.png";
        expandVidImg.alt = "Expand Video";
        expandVidImg.title = "Expand Video";
        expanded = false;
    } else {
        introVid.style.height = "100vh";
        introVidMarker.style.height = `${window.innerHeight - navbar.clientHeight}px`;
        expandVidImg.src = "assets/images/shrink-video.png";
        expandVidImg.alt = "Shrink Video";
        expandVidImg.title = "Shrink Video";
        expanded = true;
    }
});

// version

const version = new URLSearchParams(window.location.search).get("version") || "public";
fetch(`/api/content?version=${version}`)
    .then(res => res.json())
    .then(data => {
        if (data.img) {
            const icon = document.querySelector("link[rel=\"shortcut icon\"]");
            const r = new URL("../../", import.meta.url).href;
            icon.href = r + data.img;

            document.querySelector(".blu").textContent = data.blu;
            document.querySelector(".low").textContent = data.low;
        }

    })
    .catch(err => console.error("Error loading version content:", err));
