class Section extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                }

                :host {
                    --x-sec-head-col: #222816;
                    --x-title-font-size: 4rem;
                    --x-text-align: center;
                    --x-content-padding-top: 1rem;
                    --x-content-padding-right: 5rem;
                    --x-content-padding-bottom: 1rem;
                    --x-content-padding-left: 5rem;
                    --x-text-font-size: 1.2rem;
                    --x-text-padding-top: 1rem;
                    --x-text-padding-right: 5rem;
                    --x-text-padding-bottom: 1rem;
                    --x-text-padding-left: 5rem;

                    display: block;
                }

                .section-title {
                    background-color: var(--sec-head-col);
                    font-size: var(--x-title-font-size);
                    text-align: var(--x-text-align);
                }

                .section-content {
                    padding: var(--x-content-padding-top) var(--x-content-padding-right) var(--x-content-padding-bottom) var(--x-content-padding-left);
                }

                .section-text {    
                    font-size: var(--x-text-font-size);
                    text-align: var(--x-text-align);
                    padding: var(--x-text-padding-top) var(--x-text-padding-right) var(--x-text-padding-bottom) var(--x-text-padding-left);
                }
            </style>
            <div class="section-container">    
                <h1 class="section-title"></h1>
                <div class="section-content">
                    <slot></slot>
                </div>
            </div>
        `;

        this.attachInternals().role = "region";
    }

    static get observedAttributes() {
        return ["x-title"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "x-title") this.shadowRoot.querySelector(".section-title").textContent = newValue;
    }
}

customElements.define("x-section", Section);