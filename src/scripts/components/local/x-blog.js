import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

class Blog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --x-blog-bg-col: unset;
                    --x-blog-width: unset;
                    --x-title-font-size: unset;
                    --x-title-padding-top: unset;
                    --x-title-padding-right: unset;
                    --x-title-padding-bottom: unset;
                    --x-title-padding-left: unset;
                    --x-content-padding-top: unset;
                    --x-content-padding-right: unset;
                    --x-content-padding-bottom: unset;
                    --x-content-padding-left: unset;

                    display: flex;
                    justify-content: center;
                }

                .container {
                    background-color: var(--x-blog-bg-col);
                    width: var(--x-blog-width);
                }

                .title {
                    margin: 0;
                    font-size: var(--x-title-font-size);
                    text-align: center;
                    padding: var(--x-title-padding-top) var(--x-title-padding-right) var(--x-title-padding-bottom) var(--x-title-padding-left);
                }
                
                .content {
                    font-size: 1.2rem;
                    padding: var(--x-content-padding-top) var(--x-content-padding-right) var(--x-content-padding-bottom) var(--x-content-padding-left);
                }

                blockquote {
                    background-color: #00000039;
                    padding: 0.1rem 3rem;
                    border-left: 0.5rem solid #00000088;
                }
            </style>
            <div class="container">
                <h1 class="title"></h1>
                <div class="content"></div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ["x-title", "x-content"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const title = this.shadowRoot.querySelector(".title");
        const content = this.shadowRoot.querySelector(".content");
        switch (name) {
            case "x-title":
                title.textContent = newValue;
                break;
            case "x-content":
                if (!newValue) throw new Error("The attribute x-content is empty.");
                fetch(newValue)
                    .then(res => res.text())
                    .then(text => {
                        content.innerHTML = marked.parse(text);
                    })
                    .catch(err => {
                        content.innerHTML = "Error loading content.";
                        console.error(err);
                    });
                break;
        }
    }
}

customElements.define("x-blog", Blog);