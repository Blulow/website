import sheet from "../../../style.css" with { type: "css" };

class Section extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --x-sec-head-col: unset;
                    --x-title-font-size: unset;
                    --x-text-align: unset;
                    --x-flex-direction: unset;
                    --x-heading-padding-top: unset;
                    --x-heading-padding-right: unset;
                    --x-heading-padding-bottom: unset;
                    --x-heading-padding-left: unset;
                    --x-title-padding-top: unset;
                    --x-title-padding-right: unset;
                    --x-title-padding-bottom: unset;
                    --x-title-padding-left: unset;
                    --x-description-padding-top: unset;
                    --x-description-padding-right: unset;
                    --x-description-padding-bottom: unset;
                    --x-description-padding-left: unset;
                    --x-content-padding-top: unset;
                    --x-content-padding-right: unset;
                    --x-content-padding-bottom: unset;
                    --x-content-padding-left: unset;
                    --x-align-items: unset;

                    display: block;
                }

                .section-heading {
                    background-color: var(--sec-head-col);
                    text-align: var(--x-text-align);
                    padding: var(--x-heading-padding-top) var(--x-heading-padding-right) var(--x-heading-padding-bottom) var(--x-heading-padding-left);
                }
                
                .section-title {
                    font-size: var(--x-title-font-size);
                    padding: var(--x-title-padding-top) var(--x-title-padding-right) var(--x-title-padding-bottom) var(--x-title-padding-left);
                }
                
                .section-description {
                    font-size: var(--x-description-font-size);
                    padding: var(--x-description-padding-top) var(--x-description-padding-right) var(--x-description-padding-bottom) var(--x-description-padding-left);
                }

                .section-content {
                    display: flex;
                    flex-direction: var(--x-flex-direction);
                    justify-content: var(--x-justify-content);
                    align-items: var(--x-align-items);
                    padding: var(--x-content-padding-top) var(--x-content-padding-right) var(--x-content-padding-bottom) var(--x-content-padding-left);
                }
            </style>
            <div class="section-container">
                <div class="section-heading">
                    <h1 class="section-title"></h1>
                    <p class="section-description"></p>
                </div>
                <div class="section-content">
                    <slot></slot>
                </div>
            </div>
        `;

        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.attachInternals().role = "region";
    }

    static get observedAttributes() {
        return ["x-title", "x-description"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "x-title":
                this.shadowRoot.querySelector(".section-title").textContent = newValue;
                break;
            case "x-description":
                this.shadowRoot.querySelector(".section-description").textContent = newValue;
                break;
        }
    }
}

customElements.define("x-section", Section);