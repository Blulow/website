class Carousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --bg: #3498db;
                    --gap: 5%;
                    
                    display: block;
                    background-color: var(--bg);
                }

                .carousel-container {
                    height: 100%;
                    display: flex;
                    justify-items: center;
                    align-items: center;
                    padding: 1rem 5rem;
                    box-sizing: border-box;
                }
                
                .carousel-track {
                    display: flex;
                    gap: var(--gap);
                    overflow-x: auto;
                    /* scroll-snap-type: x mandatory; */
                    /* scroll-behavior: smooth; */

                    -ms-overflow-style: none;
                    scrollbar-width: none
                }
                
                .carousel-track::-webkit-scrollbar {
                    display: none;
                }
                
                ::slotted(img) {
                    height: 100%;
                    width: auto;
                    /* scroll-snap-align: center; */
                }
            </style>

            <div class="carousel-container">
                <div class="carousel-track">
                    <slot></slot>
                </div>
            </div>
        `;

        this.update = this.update.bind(this);
        this.animationFrame = null;

        this.track = this.shadowRoot.querySelector(".carousel-track");
        this.trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
        this.targetScrollLeft = 0;
        this.scrollSnapping = false;
    }

    connectedCallback() {
        const ogTrackChildren = this.trackChildren;
        const ogTrackWidth = this.track.scrollWidth;
        
        const container = this.shadowRoot.querySelector(".carousel-container");
        
        let trackWidth = ogTrackWidth;
        if (trackWidth < container.clientWidth) {
            while (trackWidth < container.clientWidth) {
                ogTrackChildren.forEach(e => this.appendChild(e.cloneNode(true)));
                trackWidth = this.track.scrollWidth;
            }
        } else {
            ogTrackChildren.forEach(e => this.appendChild(e.cloneNode(true)));
            trackWidth = this.track.scrollWidth;
        }

        this.trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
        
        this.targetScrollLeft = this.track.scrollLeft;
        this.track.addEventListener("wheel", e => {
                e.preventDefault();
                e.stopPropagation();

                this.targetScrollLeft += e.deltaY;
                this.targetScrollLeft = Math.min(Math.max(this.targetScrollLeft, 0), this.track.scrollWidth - this.track.clientWidth);

            if (this.animationFrame == null) this.animationFrame = requestAnimationFrame(this.update)
        }, { passive: false });
    }

    update() {
        const distance = this.targetScrollLeft - this.track.scrollLeft;
        
        if (Math.abs(distance * 0.1) < 1) {
            this.track.scrollLeft = this.targetScrollLeft;
            this.animationFrame = null;
            this.scrollSnapping = true;
        }
        
        if (this.scrollSnapping) {
            console.log(this.trackChildren)
            this.scrollSnapping = false;
            return;
        }
        
        this.track.scrollLeft += distance * 0.1;

        this.animationFrame = requestAnimationFrame(this.update);
    }
}

customElements.define('x-carousel', Carousel);