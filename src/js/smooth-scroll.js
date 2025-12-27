/**
 * Lenis Smooth Scroll Setup
 * Integrates with GSAP ScrollTrigger for butter-smooth scrolling
 */

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * Initialize Lenis smooth scrolling
 * @returns {Lenis} The Lenis instance
 */
export function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    })

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis to GSAP ticker for smooth updates
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    // Disable GSAP ticker's default lag smoothing
    gsap.ticker.lagSmoothing(0)

    // Handle anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href')
            if (href === '#') return

            e.preventDefault()
            const target = document.querySelector(href)
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80, // Navbar offset
                    duration: 1.5,
                })
            }
        })
    })

    // Handle back to top button
    const backToTop = document.getElementById('back-to-top')
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 2 })
        })
    }

    return lenis
}

/**
 * Stop smooth scrolling (for modals, etc.)
 * @param {Lenis} lenis 
 */
export function stopSmoothScroll(lenis) {
    lenis.stop()
}

/**
 * Resume smooth scrolling
 * @param {Lenis} lenis 
 */
export function startSmoothScroll(lenis) {
    lenis.start()
}
