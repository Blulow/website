class XFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.outerHTML = `
            <footer>

            </footer>
        `;
    }
}

customElements.define("x-footer", XFooter);