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
                    --x-sec-head-col: unset;
                    --x-title-font-size: unset;
                    --x-text-align: unset;
                    --x-content-padding-top: unset;
                    --x-content-padding-right: unset;
                    --x-content-padding-bottom: unset;
                    --x-content-padding-left: unset;
                    --x-text-font-size: unset;
                    --x-text-padding-top: unset;
                    --x-text-padding-right: unset;
                    --x-text-padding-bottom: unset;
                    --x-text-padding-left: unset;

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