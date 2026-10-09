class XHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const f = new URL(".", import.meta.url).href;
        const index = new URL("../../../../../index.html", f).href;
        const pages = new URL("../../../../pages", f).href;
        const assets = new URL("../../../../assets", f).href;

        this.outerHTML = `
            <header>
                <x-navbar id="navbar" aria-label="Navigation Menu">
                    <div class="animated-button logo home"><a class="nav-links nav-home-btn" href="${index}">
                        <img src="${assets}/images/Blulow.jpg" alt="Blulow logo">
                        Home
                    </a></div>
                    <div class="animated-button"><a class="nav-links" href="${index}#about-me-marker">About</a></div>
                    <div class="animated-button"><a class="nav-links" href="${index}#contact-marker">Contact</a></div>
                    <div class="animated-button"><a class="nav-links nav-projects-btn" href="${pages}/projects.html">Projects</a></div>
                    <div class="animated-button"><a class="nav-links nav-devlogs-btn" href="${pages}/smallmodeler.html">Devlogs</a></div>
                </x-navbar>
            </header>
        `;
    }
}

customElements.define("x-header", XHeader);