class XHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.outerHTML = `
            <header>
                <x-navbar id="navbar" aria-label="Navigation Menu">
                    <a class="nav-links" href="/public/index.html">Home</a>
                    <a class="nav-links" href="/public/pages/projects.html">Projects</a>
                    <a class="nav-links" href="">Lorem</a>
                </x-navbar>
            </header>
        `;
    }
}

customElements.define("x-header", XHeader);