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
                    --x-justify-content: unset;
                    --x-align-items: unset;

                }

                ul {
                    margin: 0;
                    padding: var(--x-padding-top) var(--x-padding-right) var(--x-padding-bottom) var(--x-padding-left);
                    list-style: none;
                    display: flex;
                    justify-content: var(--x-justify-content);
                    align-items: var(--x-align-items);
                    gap: var(--x-gap);
                }
                
                .home-link {
                    position: absolute;
                    list-style: none;
                    height: 100%;
                    left: 1em;
                }
                
                ::slotted([slot="home"]) {
                    list-style: none;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
            <div class="home-link">
                <slot name="home"></slot>
            </div>
            <ul>
                <slot></slot>
            </ul>
        `;

        this.attachInternals().role = "navigation";
    }

    connectedCallback() {
        Array.from(this.children).forEach(e => {
            const li = document.createElement("li");
            if (e.classList.contains("home")) li.slot = "home";
            li.appendChild(e);
            this.appendChild(li);
        });
    }
}

customElements.define("x-navbar", Navbar);