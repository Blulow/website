class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    --x-background-color: unset;
                    --x-padding-top: unset;
                    --x-padding-right: unset;
                    --x-padding-bottom: unset;
                    --x-padding-left: unset;
                    --x-hamburger-padding-top: unset;
                    --x-hamburger-padding-right: unset;
                    --x-hamburger-padding-bottom: unset;
                    --x-hamburger-padding-left: unset;
                    --x-gap: unset;
                    --x-justify-content: unset;
                    --x-align-items: unset;
                }

                .nav-menu, .hamburger-wrapper {
                    margin: 0;
                    padding: var(--x-padding-top) var(--x-padding-right) var(--x-padding-bottom) var(--x-padding-left);
                    list-style: none;
                    display: flex;
                    justify-content: var(--x-justify-content);
                    align-items: var(--x-align-items);
                    gap: var(--x-gap);
                }

                .hamburger-wrapper {
                    display: none
                }

                .hamburger {
                    width: 3rem;
                    height: 3rem;
                    margin: 0;
                    padding: var(--x-hamburger-padding-top) var(--x-hamburger-padding-right) var(--x-hamburger-padding-bottom) var(--x-hamburger-padding-left);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                }
                
                .hamburger:hover {
                    opacity: 0.7;
                }

                .hamburger.active .hamburger-bar:nth-child(1) {
                    transform: translateY(var(--bar-dist)) rotate(225deg);
                }
                    
                .hamburger.active .hamburger-bar:nth-child(2) {
                    transform: translateX(100%);
                    opacity: 0;
                }
                
                .hamburger.active .hamburger-bar:nth-child(3) {
                    transform: translateY(calc(var(--bar-dist) * -1)) rotate(-225deg);
                }

                .hamburger-bar {
                    width: 80%;
                    height: 10%;
                    background-color: white;
                    border-radius: 10px;
                    transition: all 0.3s ease-in-out;
                    display: block;
                }

                @media (max-width: 1024px) {
                    .hamburger-wrapper {
                        display: flex;
                    }
                    
                    .nav-menu {
                        display: flex;
                        position: absolute;
                        right: 0;
                        top: var(--nav-height);
                        flex-direction: column;
                        padding: 0;
                        gap: 0;
                        width: 100%;
                        text-align: right;
                    }

                    ::slotted(li:not([slot="home"])) {
                        background-color: var(--x-background-color);
                        box-sizing: border-box;
                        --padding-gap: calc(var(--x-gap) / 2);
                        padding: var(--padding-gap) var(--x-padding-right) var(--padding-gap) var(--x-padding-left) !important;
                        opacity: 0;
                        transform: translateY(-100%);
                        pointer-events: none;
                        transition: all 0.3s ease-in-out;
                    }

                    ::slotted(li.active:not([slot="home"])) {
                        opacity: 1;    
                        transform: translateY(0);
                        pointer-events: auto;
                    }
                }
                
                .home-link {
                    position: absolute;
                    list-style: none;
                    height: 100%;
                    left: 1em;
                }
                
                ::slotted([slot="home"]) {
                    list-style: none;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
            <div class="home-link">
                <slot name="home"></slot>
            </div>
            
            <ul class="nav-menu">
                <slot></slot>
            </ul>

            <div class="hamburger-wrapper">
                <button class="hamburger">
                    <span class="hamburger-bar"></span>
                    <span class="hamburger-bar"></span>
                    <span class="hamburger-bar"></span>
                </div>
            </div>
        `;

        this.attachInternals().role = "navigation";
    }

    connectedCallback() {
        Array.from(this.children).forEach(e => {
            const li = document.createElement("li");
            if (e.classList.contains("home")) li.slot = "home";
            li.appendChild(e);
            this.appendChild(li);
        });

        // hamburger transition

        const hamburger = this.shadowRoot.querySelector(".hamburger");
        const bars = hamburger.children;
        const barDist = bars[1].offsetTop - bars[0].offsetTop;
        
        const slot = this.shadowRoot.querySelector("slot:not([name=\"home\"])");
        const lis = slot.assignedElements();
        hamburger.style.setProperty("--bar-dist", barDist + "px");
        hamburger.addEventListener("click", () =>  {
            hamburger.classList.toggle("active");
            
            lis.forEach((e, i) => {
                if (e.classList.contains("active")) e.style.transitionDelay = (lis.length - i) * 0.1 + "s"; 
                else e.style.transitionDelay = i * 0.1 + "s";

                e.classList.toggle("active");
            });
        });

        // hamburger nav position

        const hamburgerWrapper = this.shadowRoot.querySelector(".hamburger-wrapper");
        const navMenu = this.shadowRoot.querySelector(".nav-menu");
        navMenu.style.setProperty("--nav-height", hamburgerWrapper.clientHeight + "px");
    }
}

customElements.define("x-navbar", Navbar);