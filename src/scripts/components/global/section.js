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
                    --x-title-padding-top: unset;
                    --x-title-padding-right: unset;
                    --x-title-padding-bottom: unset;
                    --x-title-padding-left: unset;
                    --x-content-padding-top: unset;
                    --x-content-padding-right: unset;
                    --x-content-padding-bottom: unset;
                    --x-content-padding-left: unset;
                    --x-align-items: unset;

                    display: block;
                }

                .section-title {
                    background-color: var(--sec-head-col);
                    font-size: var(--x-title-font-size);
                    text-align: var(--x-text-align);
                    padding: var(--x-title-padding-top) var(--x-title-padding-right) var(--x-title-padding-bottom) var(--x-title-padding-left);
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
                <h1 class="section-title"></h1>
                <div class="section-content">
                    <slot></slot>
                </div>
            </div>
        `;

        const css = new CSSStyleSheet();
        fetch("/src/style.css")
            .then(res => res.text())
            .then(text => css.replaceSync(text));
        this.shadowRoot.adoptedStyleSheets = [css];

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