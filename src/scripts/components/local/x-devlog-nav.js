class DevlogNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <div id="devlog-nav">
                <a id="devlog-all" class="btn-link animated-button devlog-nav-btn" href="">
                    <img class="flipped" src="/assets/images/proceed-arrow.png" alt="Proceed Arrow">
                    <span><strong>All Devlogs</strong></span>
                </a>
                <a id="devlog-prev" class="btn-link animated-button devlog-nav-btn" href="">
                    <img class="flipped" src="/assets/images/proceed-arrow.png" alt="Proceed Arrow">
                    <span><strong>Previous Devlog</strong></span>
                </a>
                <a id="devlog-next" class="btn-link animated-button devlog-nav-btn" href="">
                    <span><strong>Next Devlog</strong></span>
                    <img src="/assets/images/proceed-arrow.png" alt="Proceed Arrow">
                </a>
            </div>
        `

        const css = new CSSStyleSheet();
        fetch("/src/style.css")
            .then(res => res.text())
            .then(text => css.replaceSync(text));
        this.shadowRoot.adoptedStyleSheets = [css];
    }

    connectedCallback() {
        const navbar = document.querySelector("x-nav-margin");
        const nav = this.shadowRoot.querySelector("#devlog-nav");

        const navbarMarginTop = navbar.style.marginTop ? navbar.style.marginTop : 0; 
        const navbarMarginBottom = navbar.style.marginBottom ? navbar.style.marginBottom : 0; 
        const navbarHeight = parseInt(navbarMarginTop) + parseInt(navbarMarginBottom);
        const boundingBox = {
            x: 0,
            y: navbar.clientTop + navbarHeight,
            width: window.innerWidth,
            height: window.innerHeight - navbarHeight
        };

        nav.style.top = `${boundingBox.y}px`;
        nav.style.height = `${boundingBox.height}px`;
    }
}

customElements.define("x-devlog-nav", DevlogNav);