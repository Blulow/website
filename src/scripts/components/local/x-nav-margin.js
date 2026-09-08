class XNavMargin extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const navbar = document.querySelector("#navbar");
        this.style.marginTop = `${navbar.clientHeight}px`;
        this.style.width = `100%`;
        this.style.display = "block";
    }
}

customElements.define("x-nav-margin", XNavMargin);