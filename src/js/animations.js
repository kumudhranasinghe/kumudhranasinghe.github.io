/**
 * GSAP Animations
 * Premium scroll-triggered animations for modern portfolio
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * Initialize all animations
 */
export function initAnimations() {
    // Wait for DOM and fonts to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAnimations)
    } else {
        setupAnimations()
    }
}

function setupAnimations() {
    animateHero()
    animateRevealElements()
    animateProjects()
    animateSkills()
    animateExperience()
    animateNavbar()

    // Multiple refresh points to ensure ScrollTrigger catches all elements
    // Initial refresh after short delay
    setTimeout(() => {
        ScrollTrigger.refresh()
    }, 150)

    // Refresh again after a longer delay for slower loading elements
    setTimeout(() => {
        ScrollTrigger.refresh()
    }, 500)

    // Additional refresh after images/fonts load
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh()
        }, 100)
    })
}

/**
 * Hero Section Animations
 */
function animateHero() {
    const heroTitle = document.querySelector('.hero-title')
    if (!heroTitle) return

    const words = heroTitle.querySelectorAll('.word')

    // Animate each word with stagger
    gsap.fromTo(words,
        {
            opacity: 0,
            y: 80,
            rotateX: -45,
        },
        {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
            delay: 0.3,
        }
    )

    // Animate floating orbs with continuous motion
    const orbs = document.querySelectorAll('.hero-orb')
    orbs.forEach((orb, index) => {
        gsap.to(orb, {
            x: `random(-30, 30)`,
            y: `random(-30, 30)`,
            duration: `random(15, 25)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.5,
        })
    })
}

/**
 * Scroll Reveal Animations
 */
function animateRevealElements() {
    const revealElements = document.querySelectorAll('.reveal')

    revealElements.forEach((element, index) => {
        // Set initial state
        gsap.set(element, { opacity: 0, y: 40 })

        gsap.to(element,
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                delay: index * 0.1 % 0.3,
            }
        )
    })
}

/**
 * Projects Grid Animation (no more pinned scroll)
 */
function animateProjects() {
    const projectCards = document.querySelectorAll('.project-card')

    projectCards.forEach((card, index) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 40,
                scale: 0.95,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                delay: (index % 4) * 0.1, // Stagger for 2x2 grid
            }
        )
    })
}

/**
 * Skills Grid Animation
 */
function animateSkills() {
    const skillCards = document.querySelectorAll('.skill-card')

    skillCards.forEach((card, index) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 30,
                scale: 0.9,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                delay: (index % 5) * 0.08, // Stagger by row
            }
        )
    })

    // Animate skill bar fills on hover
    skillCards.forEach((card) => {
        const barFill = card.querySelector('.skill-bar-fill')
        if (!barFill) return

        const fillAmount = barFill.style.getPropertyValue('--fill') || '80%'

        card.addEventListener('mouseenter', () => {
            gsap.to(barFill, {
                scaleX: parseFloat(fillAmount) / 100,
                duration: 0.6,
                ease: 'expo.out',
            })
        })

        card.addEventListener('mouseleave', () => {
            gsap.to(barFill, {
                scaleX: 0,
                duration: 0.3,
                ease: 'power2.in',
            })
        })
    })
}

/**
 * Experience Timeline Animation
 */
function animateExperience() {
    const timelineItems = document.querySelectorAll('.timeline-item')
    const timelineLine = document.getElementById('timeline-line')
    const timeline = document.querySelector('.timeline')

    if (!timeline) return

    // Animate timeline line drawing
    if (timelineLine) {
        gsap.fromTo(timelineLine,
            { height: 0 },
            {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: timeline,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: 1,
                },
            }
        )
    }

    // Animate each timeline item
    timelineItems.forEach((item, index) => {
        // Set initial state explicitly
        gsap.set(item, { opacity: 0, x: -50 })

        gsap.to(item,
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => item.classList.add('visible'),
                },
                delay: index * 0.1,
            }
        )

        // Animate the dot
        const dot = item.querySelector('.timeline-dot')
        if (dot) {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => item.classList.add('active'),
                onLeave: () => item.classList.remove('active'),
                onEnterBack: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active'),
            })
        }
    })
}

/**
 * Navbar Scroll Effect
 */
function animateNavbar() {
    const navbar = document.getElementById('navbar')
    if (!navbar) return

    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
            if (self.direction === 1 && self.scroll() > 80) {
                navbar.classList.add('scrolled')
            } else if (self.scroll() <= 80) {
                navbar.classList.remove('scrolled')
            }
        },
    })
}

/**
 * Parallax effect for sections
 */
export function initParallax() {
    const sections = document.querySelectorAll('.section')

    sections.forEach((section) => {
        const bg = section.querySelector('.section-bg')
        if (!bg) return

        gsap.to(bg, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        })
    })
}

/**
 * Refresh ScrollTrigger on resize
 */
export function handleResize() {
    let resizeTimeout

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh()
        }, 250)
    })
}
