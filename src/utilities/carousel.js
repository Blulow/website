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
        this.ogTrackWidth = this.track.scrollWidth;
        this.gapDistance = this.track.clientWidth * parseFloat(getComputedStyle(this.track).gap) / 100;

        this.targetScrollLeft = 0;
        this.lastScrollLeft = 0;
        this.scrollSnapping = false;
    }

    connectedCallback() {
        const ogTrackChildren = this.trackChildren;
        
        const container = this.shadowRoot.querySelector(".carousel-container");
        
        let trackWidth = this.ogTrackWidth;
        if (trackWidth < container.clientWidth * 3) {
            while (trackWidth < container.clientWidth * 3 || this.trackChildren.length / ogTrackChildren.length < 4) {
                ogTrackChildren.forEach(e => this.appendChild(e.cloneNode(true)));
                trackWidth = this.track.scrollWidth;
                this.trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
            }
        } else {
            ogTrackChildren.forEach(e => {
                this.appendChild(e.cloneNode(true));
                this.appendChild(e.cloneNode(true));
            });
            trackWidth = this.track.scrollWidth;
            this.trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
        }
        
        const nDuplicates = this.trackChildren.length / ogTrackChildren.length;
        this.track.scrollLeft = (this.ogTrackWidth + this.gapDistance) * Math.floor(nDuplicates / 2);
        this.lastScrollLeft = this.track.scrollLeft;
        this.targetScrollLeft = this.track.scrollLeft;
        this.track.addEventListener("wheel", e => {
            e.preventDefault();
            e.stopPropagation();

            this.targetScrollLeft += e.deltaY;
            this.targetScrollLeft = Math.min(Math.max(this.targetScrollLeft, 0), this.track.scrollWidth - this.track.clientWidth);
            if (this.targetScrollLeft <= 0 || this.targetScrollLeft >= this.track.scrollWidth - this.track.clientWidth) return;

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
        
        if (Math.abs(this.lastScrollLeft - this.track.scrollLeft) > this.ogTrackWidth + this.gapDistance) {
            if (this.lastScrollLeft < this.track.scrollLeft) {
                this.track.scrollLeft -= this.ogTrackWidth + this.gapDistance;
                this.targetScrollLeft -= this.ogTrackWidth + this.gapDistance;
            } else {
                this.track.scrollLeft += this.ogTrackWidth + this.gapDistance;
                this.targetScrollLeft += this.ogTrackWidth + this.gapDistance;
            }
        }

        if (this.scrollSnapping) {
            console.log(this.trackChildren)
            this.scrollSnapping = false;
            this.lastScrollLeft = this.track.scrollLeft;
            return;
        }
        
        this.track.scrollLeft += distance * 0.1;

        this.animationFrame = requestAnimationFrame(this.update);
    }
}

customElements.define('x-carousel', Carousel);