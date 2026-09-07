class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --x-nav-col: #1316303f;
                    --x-padding-top: 1rem;
                    --x-padding-right: 2rem;
                    --x-padding-bottom: 1rem;
                    --x-padding-left: 2rem;
                    --x-gap: 3rem;
                    background-color: var(--x-nav-col);
                }

                ul {
                    margin: 0;
                    padding: var(--x-padding-top) var(--x-padding-right) var(--x-padding-bottom) var(--x-padding-left);
                    list-style: none;
                    display: flex;
                    gap: var(--x-gap);
                }
            </style>
            <ul>
                <slot></slot>
            </ul>
        `;

        this.attachInternals().role = "navigation";
    }

    connectedCallback() {
        Array.from(this.children).forEach(e => {
            const li = document.createElement("li");
            li.appendChild(e);
            this.appendChild(li);
        });
    }
}

customElements.define("x-navbar", Navbar);