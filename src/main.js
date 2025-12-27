/**
 * Main Entry Point
 * Modern Portfolio - Kumudh Ranasinghe
 */

// Import styles
import './styles/index.css'

// Import modules
import { initSmoothScroll } from './js/smooth-scroll.js'
import { initAnimations, handleResize } from './js/animations.js'

/**
 * Initialize the application
 */
function init() {
    // Initialize smooth scrolling
    const lenis = initSmoothScroll()

    // Initialize GSAP animations
    initAnimations()

    // Handle window resize
    handleResize()

    // Initialize mobile navigation
    initMobileNav()

    // Initialize project card hover effects
    initProjectCardEffects()

    // Initialize all carousels (projects + certifications)
    initCarousels()

    // Add loaded class for initial animations
    document.body.classList.add('loaded')

    console.log('🚀 Portfolio initialized')
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const toggle = document.getElementById('navbar-toggle')
    const nav = document.getElementById('navbar-nav')

    if (!toggle || !nav) return

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active')
        nav.classList.toggle('active')
        document.body.classList.toggle('nav-open')
    })

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active')
            nav.classList.remove('active')
            document.body.classList.remove('nav-open')
        })
    })

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active')
            nav.classList.remove('active')
            document.body.classList.remove('nav-open')
        }
    })
}

/**
 * Project Showcase - Thumbnail Selection with Smooth Transition
 */
function initProjectCardEffects() {
    const thumbnails = document.querySelectorAll('.project-thumb')
    const mainCard = document.getElementById('project-main')
    const mainContent = document.getElementById('project-main-content')

    if (!mainCard || !mainContent || thumbnails.length === 0) return

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Skip if already active
            if (thumb.classList.contains('active')) return

            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'))
            thumb.classList.add('active')

            // Get data from clicked thumbnail
            const title = thumb.dataset.title
            const date = thumb.dataset.date
            const description = thumb.dataset.description
            const stack = thumb.dataset.stack.split(',')
            const link = thumb.dataset.link

            // Smooth transition: fade out, update, fade in
            mainContent.classList.add('transitioning')

            setTimeout(() => {
                // Update content
                const mainDate = mainContent.querySelector('.project-main-date')
                const mainTitle = mainContent.querySelector('.project-main-title')
                const mainDesc = mainContent.querySelector('.project-main-description')
                const mainStack = mainContent.querySelector('.project-main-stack')
                const mainLink = mainContent.querySelector('.project-main-link')

                if (mainDate) mainDate.textContent = date
                if (mainTitle) mainTitle.textContent = title
                if (mainDesc) mainDesc.textContent = description
                if (mainLink) mainLink.href = link

                // Update tech stack pills
                if (mainStack) {
                    mainStack.innerHTML = stack.map(tech => `<span>${tech.trim()}</span>`).join('')
                }

                // Fade in
                mainContent.classList.remove('transitioning')
            }, 200)
        })
    })
}

/**
 * Lazy load images with Intersection Observer
 */
function initLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]')

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target
                    img.src = img.dataset.src || img.src
                    img.classList.add('loaded')
                    imageObserver.unobserve(img)
                }
            })
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1,
        })

        images.forEach((img) => imageObserver.observe(img))
    }
}

/**
 * Preload critical resources
 */
function preloadResources() {
    // Preload hero background if exists
    const heroOrbs = document.querySelectorAll('.hero-orb')
    heroOrbs.forEach((orb) => {
        orb.style.willChange = 'transform'
    })
}

/**
 * Unified Carousel System with Infinite Loop
 * Works for both projects and certifications carousels
 */
function initCarousels() {
    // Initialize Projects Carousel
    initCarousel({
        carousel: document.querySelector('.projects-carousel'),
        track: document.querySelector('.projects-carousel-track'),
        nav: document.querySelector('.projects-carousel-nav'),
        autoAdvanceInterval: 8000,
        startDelay: 3000
    })

    // Initialize Certification Carousels (one per category)
    document.querySelectorAll('.cert-carousel').forEach((carousel) => {
        initCarousel({
            carousel: carousel,
            track: carousel.querySelector('.cert-carousel-track'),
            nav: carousel.querySelector('.cert-carousel-nav'),
            autoAdvanceInterval: 5000,
            startDelay: 2000
        })
    })
}

function initCarousel({ carousel, track, nav, autoAdvanceInterval = 5000, startDelay = 2000 }) {
    if (!carousel || !track) return

    const originalCards = Array.from(track.children)
    const cardCount = originalCards.length
    if (cardCount === 0) return

    // Clone first card and append to end for seamless infinite loop
    const firstClone = originalCards[0].cloneNode(true)
    firstClone.setAttribute('data-clone', 'true')
    track.appendChild(firstClone)

    // Create navigation dots (only for original cards)
    if (nav) {
        nav.innerHTML = ''
        for (let i = 0; i < cardCount; i++) {
            const dot = document.createElement('button')
            dot.className = `${nav.classList.contains('projects-carousel-nav') ? 'projects-carousel-dot' : 'cert-carousel-dot'} ${i === 0 ? 'active' : ''}`
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`)
            dot.addEventListener('click', () => goToSlide(i))
            nav.appendChild(dot)
        }
    }

    let currentIndex = 0
    let autoAdvanceTimer = null
    let isPaused = false
    let isTransitioning = false

    const updateDots = () => {
        if (!nav) return
        const dots = nav.children
        const dotIndex = currentIndex % cardCount
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === dotIndex)
        }
    }

    const goToSlide = (index, smooth = true) => {
        if (isTransitioning && smooth) return

        currentIndex = index

        // Calculate translation accounting for gap
        // Get the first card's actual width
        const cards = track.children
        if (cards.length === 0) return

        const card = cards[0]
        const cardRect = card.getBoundingClientRect()
        const cardWidth = cardRect.width

        // Get gap from computed style
        const trackStyle = window.getComputedStyle(track)
        const gap = parseFloat(trackStyle.gap) || 0

        // Total slide distance = card width + gap
        const slideDistance = cardWidth + gap
        const translateX = -(currentIndex * slideDistance)

        track.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
        track.style.transform = `translateX(${translateX}px)`
        updateDots()

        if (smooth) {
            isTransitioning = true
            setTimeout(() => {
                isTransitioning = false
            }, 600)
        }
    }

    const nextSlide = () => {
        if (isTransitioning) return

        currentIndex++
        goToSlide(currentIndex, true)

        // When we reach the clone, instantly jump back to the first real slide
        if (currentIndex >= cardCount) {
            setTimeout(() => {
                goToSlide(0, false) // Instant jump, no animation
            }, 600) // Wait for transition to complete
        }
    }

    const startAutoAdvance = () => {
        autoAdvanceTimer = setInterval(() => {
            if (!isPaused) nextSlide()
        }, autoAdvanceInterval)
    }

    // Pause on hover over entire carousel container
    carousel.addEventListener('mouseenter', () => {
        isPaused = true
    })

    carousel.addEventListener('mouseleave', () => {
        isPaused = false
    })

    // Start auto-advance after delay
    setTimeout(startAutoAdvance, startDelay)
}

/**
 * Projects Carousel - replaced by unified initCarousels
 */
function initProjectsAutoScroll() {
    // Now handled by initCarousels()
}

/**
 * Certifications Carousel - replaced by unified initCarousels
 */
function initCertCarousel() {
    // Now handled by initCarousels()
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}

// Preload resources immediately
preloadResources()
