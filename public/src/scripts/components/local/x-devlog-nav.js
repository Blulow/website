// import sheet from "../../../style.css" with { type: "css" };
import { locations, getProjects } from "../../projects/projects-data.js";

const response = await fetch(
    new URL("../../../style.css", import.meta.url)
);

const css = await response.text();

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

class DevlogNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const f = new URL(".", import.meta.url).href;
        const devlogPage = new URL("../../../../pages/smallmodeler.html", f).href;
        const arrowImg = new URL("../../../../assets/images/proceed-arrow.png", f).href;

        this.shadowRoot.innerHTML = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                }

                #devlog-nav {
                    width: 100%;
                    height: 100%;
                    position: fixed;
                    top: 0;
                    pointer-events: none;
                }

                .devlog-nav-btn {
                    position: absolute;
                    pointer-events: auto;
                }

                #devlog-prev {
                    bottom: 0;
                }

                #devlog-next {
                    right: 0;
                    bottom: 0;
                }

                @media (max-width: 1024px) {
                    .devlog-nav-btn span {
                        display: none;
                    }
                    
                    .devlog-nav-btn#devlog-all::after {
                        content: "All";
                    }

                    .devlog-nav-btn:not(#devlog-all) img {
                        margin: 0 !important;
                    }

                    .devlog-nav-btn::after {
                        padding-top: calc(13em / 53);
                        font-size: clamp(0rem, 5vw, 5rem);
                    }
                }
            </style>
            <div id="devlog-nav">
                <a id="devlog-all" class="btn-link animated-button devlog-nav-btn" href="${devlogPage}">
                    <img class="flipped" src="${arrowImg}" alt="Proceed Arrow">
                    <span><strong>All Devlogs</strong></span>
                </a>
                <a id="devlog-prev" class="btn-link animated-button devlog-nav-btn" href="">
                    <img class="flipped" src="${arrowImg}" alt="Proceed Arrow">
                    <span><strong>Previous Devlog</strong></span>
                </a>
                <a id="devlog-next" class="btn-link animated-button devlog-nav-btn" href="">
                    <span><strong>Next Devlog</strong></span>
                    <img src="${arrowImg}" alt="Proceed Arrow">
                </a>
            </div>
        `

        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    async connectedCallback() {
        // styling

        const navbar = document.querySelector("x-nav-margin");
        const nav = this.shadowRoot.querySelector("#devlog-nav");

        const navbarMarginTop = navbar.style.marginTop ? navbar.style.marginTop : 0; 
        const navbarMarginBottom = navbar.style.marginBottom ? navbar.style.marginBottom : 0; 
        const navbarHeight = parseInt(navbarMarginTop) + parseInt(navbarMarginBottom);
        const boundingBox = {
            x: 0,
            y: navbar.clientTop + navbarHeight,
            width: window.innerWidth,
            height: window.innerHeight - navbarHeight
        };

        nav.style.top = `${boundingBox.y}px`;
        nav.style.height = `${boundingBox.height}px`;

        // functionality

        const prevBtn = this.shadowRoot.querySelector("#devlog-prev");
        const nextBtn = this.shadowRoot.querySelector("#devlog-next");

        const devlogs = await getProjects(locations.devlogs);
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) throw new Error("Missing devlog id.");

        const devlogIdx = devlogs.findIndex(e => e.id === id);
        if (typeof devlogIdx !== "number" || Number.isNaN(devlogIdx)) throw new Error (`Devlog with id ${id} does not exist.`);

        const prevDevlogId = devlogIdx > 0 ? devlogs[devlogIdx - 1].id : null;
        const nextDevlogId = devlogIdx < devlogs.length - 1 ? devlogs[devlogIdx + 1].id : null;

        const f = new URL(".", import.meta.url).href;
        const pages = new URL("../../../../pages", f).href;
        const urlParams = new URLSearchParams(window.location.search);
        const version = urlParams.get("version") ? `&version=${urlParams.get("version")}` : "";
        prevBtn.href = prevDevlogId ? `${pages}/project.html?src=devlogs&id=${prevDevlogId}${version}` : "";
        nextBtn.href = nextDevlogId ? `${pages}/project.html?src=devlogs&id=${nextDevlogId}${version}` : "";
    }
}

customElements.define("x-devlog-nav", DevlogNav);