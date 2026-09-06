class Carousel extends HTMLElement {
    
    #animationFrame;
    #track;
    #trackChildren;
    #ogTrackChildren;
    #ogTrackWidth;
    #gapDistance;
    #targetScrollLeft;
    #lastScrollLeft;
    #scrollSnapping;
    #closestChild;
    #closestChildIdx;
    #originCycleIdx;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --bg: #3498db;
                    --gap: 5%;
                    --left-arrow-image: none;
                    --right-arrow-image: none;
                    
                    display: block;
                    background-color: var(--bg);
                }

                .carousel-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-items: center;
                    align-items: center;
                    padding: 1rem 5rem;
                    box-sizing: border-box;
                }
                
                .carousel-track {
                    flex: 1 1 auto;
                    display: flex;
                    gap: var(--gap);
                    overflow-x: auto;

                    -ms-overflow-style: none;
                    scrollbar-width: none
                }
                
                .carousel-track::-webkit-scrollbar {
                    display: none;
                }
                
                ::slotted(img) {
                    height: 100%;
                    width: auto;
                }

                .carousel-left-arrow {
                    background-image: var(--left-arrow-image);
                    background-size: 100%;
                    width: 5%;
                    aspect-ratio: 0.25;
                    margin-right: 5%;
                    flex-shrink: 0;
                }
                
                .carousel-right-arrow {
                    background-image: var(--right-arrow-image);
                    background-size: 100%;
                    width: 5%;
                    aspect-ratio: 0.25;
                    margin-left: 5%;
                    flex-shrink: 0;
                }
            </style>

            <div class="carousel-container" part="container">
                <button class="carousel-left-arrow" part="left-arrow"></button>
                <div class="carousel-track" part="track">
                    <slot></slot>
                </div>
                <button class="carousel-right-arrow" part="right-arrow"></button>
            </div>
        `;

        this.#update = this.#update.bind(this);
        this.#animationFrame = null;

        this.#track = this.shadowRoot.querySelector(".carousel-track");
        this.#trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
        this.#ogTrackChildren = null;
        this.#ogTrackWidth = this.#track.scrollWidth;
        this.#gapDistance = this.#track.clientWidth * parseFloat(getComputedStyle(this.#track).gap) / 100;

        this.#targetScrollLeft = 0;
        this.#lastScrollLeft = 0;
        this.#scrollSnapping = false;
        this.#closestChild = null;
        this.#closestChildIdx = -1;
        this.#originCycleIdx = -1;
    }

    connectedCallback() {
        this.#handleScrolling();
        this.#handleButton();
    }

    #handleScrolling() {
        //set original track children
        this.#ogTrackChildren = this.#trackChildren;
        
        const container = this.shadowRoot.querySelector(".carousel-container");
        
        // set original track width
        let trackWidth = this.#ogTrackWidth;
        // accumulate track width until hit all criteria:
        // track width >= 3 * container width
        // track duplicate >= 4
        while (trackWidth < container.clientWidth * 3 || this.#trackChildren.length / this.#ogTrackChildren.length < 4) {
            this.#ogTrackChildren.forEach(e => this.appendChild(e.cloneNode(true)));
            trackWidth = this.#track.scrollWidth;
            this.#trackChildren = this.shadowRoot.querySelector("slot").assignedElements();
        }
        
        // set initial scroll left for margin for scroll
        const nDuplicates = this.#trackChildren.length / this.#ogTrackChildren.length;
        this.#originCycleIdx = Math.floor(nDuplicates / 2);
        this.#track.scrollLeft = (this.#ogTrackWidth + this.#gapDistance) * this.#originCycleIdx;
        // set last scroll left (for looping)
        this.#lastScrollLeft = this.#track.scrollLeft;
        // set target scroll left (for tweening)
        this.#targetScrollLeft = this.#track.scrollLeft;
        this.#track.addEventListener("wheel", e => {
            e.preventDefault();
            e.stopPropagation();

            // interrupt scroll snapping
            this.#scrollSnapping = false;

            // accumulate and clamp target scroll left
            this.#targetScrollLeft += e.deltaY;
            this.#targetScrollLeft = Math.min(Math.max(this.#targetScrollLeft, 0), this.#track.scrollWidth - this.#track.clientWidth);
            if (this.#targetScrollLeft <= 0 || this.#targetScrollLeft >= this.#track.scrollWidth - this.#track.clientWidth) return;
            
            // animate tween if scroll
            if (this.#animationFrame == null) this.#animationFrame = requestAnimationFrame(this.#update);
        }, { passive: false });

        this.#animationFrame = requestAnimationFrame(this.#update);
    }

    #update = () => {
        // get track client center (for snapping)
        const center = this.#track.getBoundingClientRect().left + this.#track.getBoundingClientRect().width / 2;
        // get tween distance
        const distance = this.#targetScrollLeft - this.#track.scrollLeft;
        
        // looping (by moving actual and target scroll left up or down a cycle)
        if (Math.abs(this.#lastScrollLeft - this.#track.scrollLeft) > this.#ogTrackWidth + this.#gapDistance) {
            if (this.#lastScrollLeft < this.#track.scrollLeft) {
                this.#track.scrollLeft -= this.#ogTrackWidth + this.#gapDistance;
                this.#targetScrollLeft -= this.#ogTrackWidth + this.#gapDistance;
            } else {
                this.#track.scrollLeft += this.#ogTrackWidth + this.#gapDistance;
                this.#targetScrollLeft += this.#ogTrackWidth + this.#gapDistance;
            }
        }
        
        if (this.#scrollSnapping) {
            // snapping

            // accumulate snap distance (closest child x - center x)
            const snapDistance = this.#closestChild.getBoundingClientRect().left + this.#closestChild.getBoundingClientRect().width / 2 - center;
            this.#track.scrollLeft += snapDistance * 0.1;
            
            // finish snapping
            if (Math.abs(snapDistance * 0.1) < 1) {
                this.#scrollSnapping = false;
                this.#lastScrollLeft = this.#track.scrollLeft;
                this.#animationFrame = null;
                return;
            }
        } else {
            // scrolling

            if (Math.abs(distance * 0.1) < 1) {
                // scroll finish (when target and actual get close enough [because target and actual can miss])

                this.#track.scrollLeft = this.#targetScrollLeft;
                // get closest child and index to center
                const closestData = this.#trackChildren.reduce((closest, child, index) => {
                    const childCenter = child.getBoundingClientRect().left + child.getBoundingClientRect().width / 2;
                    const closestChildCenter = closest.child.getBoundingClientRect().left + closest.child.getBoundingClientRect().width / 2;
                    return Math.abs(childCenter - center) < Math.abs(closestChildCenter - center) ? { child, index } : closest;
                }, { child: this.#trackChildren[0], index: 0 });
                this.#closestChild = closestData.child;
                this.#closestChildIdx = closestData.index;
                // enable snapping
                this.#scrollSnapping = true;
            } else {
                // tween scrolling (from actual to target)
                this.#track.scrollLeft += distance * 0.1;
            }
        }

        this.#animationFrame = requestAnimationFrame(this.#update);
    }

    #handleButton() {
        const leftBtn = this.shadowRoot.querySelector(".carousel-left-arrow");
        const rightBtn = this.shadowRoot.querySelector(".carousel-right-arrow");

        leftBtn.addEventListener("click", () => {
            this.#moveTargetChild(-1);
        });
        rightBtn.addEventListener("click", () => {
            this.#moveTargetChild(1);
        });
    }

    #moveTargetChild(dir) {
        // interrupt scroll snapping
        this.#scrollSnapping = false;

        // set initial target child idx
        let targetChildIdx = this.#closestChildIdx + dir;
        // wrap (loop) around idx and directly set current scroll left for illusion
        if (targetChildIdx < this.#ogTrackChildren.length * this.#originCycleIdx) {
            targetChildIdx += this.#ogTrackChildren.length;
            this.#track.scrollLeft += this.#ogTrackWidth + this.#gapDistance;
            this.#targetScrollLeft += this.#ogTrackWidth + this.#gapDistance;
        } else if (targetChildIdx >= this.#ogTrackChildren.length * (this.#originCycleIdx + 1)) {
            targetChildIdx -= this.#ogTrackChildren.length;
            this.#track.scrollLeft -= this.#ogTrackWidth + this.#gapDistance;
            this.#targetScrollLeft -= this.#ogTrackWidth + this.#gapDistance;
        }
        // get target child and distance
        const targetChild = this.#trackChildren[targetChildIdx];
        const targetChildLeft = targetChild.getBoundingClientRect().left + targetChild.getBoundingClientRect().width / 2 - this.#track.getBoundingClientRect().left + this.#track.scrollLeft;
        // set target scroll left to previous child
        this.#targetScrollLeft = targetChildLeft - this.#track.clientWidth / 2;
        this.#targetScrollLeft = Math.min(Math.max(this.#targetScrollLeft, 0), this.#track.scrollWidth - this.#track.clientWidth);
        if (this.#targetScrollLeft <= 0 || this.#targetScrollLeft >= this.#track.scrollWidth - this.#track.clientWidth) return;
        
        // animate tween if scroll
        if (this.#animationFrame == null) this.#animationFrame = requestAnimationFrame(this.#update);
    }
}

customElements.define('x-carousel', Carousel);