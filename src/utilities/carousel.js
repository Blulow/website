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
        this.closestChild = null;
    }

    connectedCallback() {
        //set original track children
        const ogTrackChildren = this.trackChildren;
        
        const container = this.shadowRoot.querySelector(".carousel-container");
        
        // set original track width
        let trackWidth = this.ogTrackWidth;
        // accumulate track width until hit all criteria:
        // track width >= 3 * container width
        // track duplicate >= 4
        while (trackWidth < container.clientWidth * 3 || this.trackChildren.length / ogTrackChildren.length < 4) {
            ogTrackChildren.forEach(e => this.appendChild(e.cloneNode(true)));
            trackWidth = this.track.scrollWidth;
            this.trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
        }
        
        // set initial scroll left for margin for scroll
        const nDuplicates = this.trackChildren.length / ogTrackChildren.length;
        this.track.scrollLeft = (this.ogTrackWidth + this.gapDistance) * Math.floor(nDuplicates / 2);
        // set last scroll left (for looping)
        this.lastScrollLeft = this.track.scrollLeft;
        // set target scroll left (for tweening)
        this.targetScrollLeft = this.track.scrollLeft;
        this.track.addEventListener("wheel", e => {
            e.preventDefault();
            e.stopPropagation();

            // interrupt scroll snapping
            this.scrollSnapping = false;

            // accumulate and clamp target scroll left
            this.targetScrollLeft += e.deltaY;
            this.targetScrollLeft = Math.min(Math.max(this.targetScrollLeft, 0), this.track.scrollWidth - this.track.clientWidth);
            if (this.targetScrollLeft <= 0 || this.targetScrollLeft >= this.track.scrollWidth - this.track.clientWidth) return;
            
            // animate tween if scroll
            if (this.animationFrame == null) this.animationFrame = requestAnimationFrame(this.update);
        }, { passive: false });

        this.animationFrame = requestAnimationFrame(this.update);
    }

    update() {
        // get track client center (for snapping)
        const center = this.track.getBoundingClientRect().left + this.track.getBoundingClientRect().width / 2;
        // get tween distance
        const distance = this.targetScrollLeft - this.track.scrollLeft;
        
        // looping (by moving actual and target scroll left up or down a cycle)
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
            // snapping

            // accumulate snap distance (closest child x - center x)
            const snapDistance = this.closestChild.getBoundingClientRect().left + this.closestChild.getBoundingClientRect().width / 2 - center;
            this.track.scrollLeft += snapDistance * 0.1;
            
            // finish snapping
            if (Math.abs(snapDistance * 0.1) < 1) {
                this.scrollSnapping = false;
                this.lastScrollLeft = this.track.scrollLeft;
                this.animationFrame = null;
                return;
            }
        } else {
            // scrolling

            if (Math.abs(distance * 0.1) < 1) {
                // scroll finish (when target and actual get close enough [because target and actual can miss])

                this.track.scrollLeft = this.targetScrollLeft;
                // get closest child to center
                this.closestChild = this.trackChildren.reduce((c, e) => {
                    const childCenter = e.getBoundingClientRect().left + e.getBoundingClientRect().width / 2;
                    const closestChildCenter = c.getBoundingClientRect().left + c.getBoundingClientRect().width / 2;
                    return Math.abs(childCenter - center) < Math.abs(closestChildCenter - center) ? e : c;
                });
                // enable snapping
                this.scrollSnapping = true;
            } else {
                // tween scrolling (from actual to target)
                this.track.scrollLeft += distance * 0.1;
            }
        }

        this.animationFrame = requestAnimationFrame(this.update);
    }
}

customElements.define('x-carousel', Carousel);