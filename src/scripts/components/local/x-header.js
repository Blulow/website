class XHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.outerHTML = `
            <header>
                <x-navbar id="navbar" aria-label="Navigation Menu">
                    <a class="nav-links" href="/index.html">Home</a>
                    <a class="nav-links" href="/index.html#about-me">About</a>
                    <a class="nav-links" href="/index.html#contact">Contact</a>
                    <a class="nav-links" href="/pages/projects.html">Projects</a>
                </x-navbar>
            </header>
        `;
    }
}

customElements.define("x-header", XHeader);