class ImageTitleFrame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --x-title-font-size: unset;
                    --x-title-bg-col: unset;
                    --x-title-col: unset;
                    --x-title-padding-top: unset;
                    --x-title-padding-right: unset;
                    --x-title-padding-bottom: unset;
                    --x-title-padding-left: unset;

                    display: inline-block;
                    position: relative;
                }
                
                ::slotted(img) {
                    display: block;
                    width: 100%;
                    height: auto;
                }
                    
                .carousel-item-title {
                    margin: 0;
                    position: absolute;
                    display: block;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    box-sizing: border-box;
                    font-size: var(--x-title-font-size);
                    background-color: var(--x-title-bg-col);
                    color: var(--x-title-col);
                    padding: var(--x-title-padding-top) var(--x-title-padding-right) var(--x-title-padding-bottom) var(--x-title-padding-left);
                }
            </style>
            <slot></slot>
            <h3 class="carousel-item-title"></h3>
        `;
    }

    static get observedAttributes() {
        return ["x-title"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const title = this.shadowRoot.querySelector(".carousel-item-title");
        if (name === "x-title") title.textContent = newValue;
    }
}

customElements.define("x-image-title-frame", ImageTitleFrame);