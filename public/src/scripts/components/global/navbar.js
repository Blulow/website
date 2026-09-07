class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --x-padding-top: unset;
                    --x-padding-right: unset;
                    --x-padding-bottom: unset;
                    --x-padding-left: unset;
                    --x-gap: unset;
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