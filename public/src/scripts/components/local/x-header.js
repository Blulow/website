class XHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.outerHTML = `
            <header>
                <x-navbar id="navbar" aria-label="Navigation Menu">
                    <div class="animated-button logo home"><a class="nav-links nav-home-btn" href="/public/index.html">
                        <img src="/public/assets/images/Blulow.jpg" alt="Blulow logo">
                        Home
                    </a></div>
                    <div class="animated-button"><a class="nav-links" href="/public/index.html#about-me-marker">About</a></div>
                    <div class="animated-button"><a class="nav-links" href="/public/index.html#contact-marker">Contact</a></div>
                    <div class="animated-button"><a class="nav-links nav-projects-btn" href="/public/pages/projects.html">Projects</a></div>
                    <div class="animated-button"><a class="nav-links nav-devlogs-btn" href="/public/pages/smallmodeler.html">Devlogs</a></div>
                </x-navbar>
            </header>
        `;
    }
}

customElements.define("x-header", XHeader);