class ProjectFrame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --x-txt-col: unset;
                    --x-text-align: unset;
                    --x-font-size: unset;
                    --x-cover-image-padding-top: unset;
                    --x-cover-image-padding-right: unset;
                    --x-cover-image-padding-bottom: unset;
                    --x-cover-image-padding-left: unset;
                    --x-description-padding-top: unset;
                    --x-description-padding-right: unset;
                    --x-description-padding-bottom: unset;
                    --x-description-padding-left: unset;

                    display: flex;
                    flex-direction: column;
                }

                .cover-image {
                    padding: var(--x-cover-image-padding-top) var(--x-cover-image-padding-right) var(--x-cover-image-padding-bottom) var(--x-cover-image-padding-left);
                }
                
                .description {
                    text-align: var(--x-text-align);
                    font-size: var(--x-font-size);
                    color: var(--x-txt-col);
                    padding: var(--x-description-padding-top) var(--x-description-padding-right) var(--x-description-padding-bottom) var(--x-description-padding-left);
                }
            </style>
            <img class="cover-image" src="" alt="">
            <p class="description"><slot></slot></p>
        `;
    }

    static get observedAttributes() {
        return ["x-src", "x-alt"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const coverImage = this.shadowRoot.querySelector(".cover-image");
        switch (name) {
            case "x-src":
                coverImage.src = newValue;
                break;
            case "x-alt":
                coverImage.alt = newValue;
                break;
        }
    }
}

customElements.define("x-project-frame", ProjectFrame);