class ProjectFrame extends HTMLElement {
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
                    --x-title-font-size: unset;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: fit-content;
                    min-width: 100%;
                }

                .title {
                    font-size: var(--x-title-font-size);
                    text-align: center;
                    display: block;
                }
                
                .project-link {
                    display: block;
                    width: fit-content;
                }
                
                .cover-image {
                    display: block;
                    padding: var(--x-cover-image-padding-top) var(--x-cover-image-padding-right) var(--x-cover-image-padding-bottom) var(--x-cover-image-padding-left);
                }
                
                .description {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    text-align: var(--x-text-align);
                    font-size: var(--x-font-size);
                    color: var(--x-txt-col);
                    padding: var(--x-description-padding-top) var(--x-description-padding-right) var(--x-description-padding-bottom) var(--x-description-padding-left);
                }
            </style>
            <h3 class="title"></h3>
            <a class="project-link" href="">
                <img class="cover-image" src="" alt="">
            </a>
            <p class="description"><slot></slot></p>
        `;
    }

    static get observedAttributes() {
        return ["x-title", "x-href", "x-src", "x-alt"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const title = this.shadowRoot.querySelector(".title");
        const link = this.shadowRoot.querySelector(".project-link");
        const coverImage = this.shadowRoot.querySelector(".cover-image");
        switch (name) {
            case "x-title":
                title.textContent = newValue;
                break;
            case "x-href":
                link.href = newValue;
                break;
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