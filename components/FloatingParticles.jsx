"use client"
// The soft drifting dots behind the hero text, just for atmosphere. Built with
// plain DOM elements and requestAnimationFrame since it's simple enough not to need a library.
import { useEffect, useRef } from "react"

export default function FloatingParticles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []
    const maxParticles = 30

    function rand(min, max) {
      return Math.random() * (max - min) + min
    }

    // Create a particle
    function createParticle() {
      const p = document.createElement("div")
      const size = rand(4, 14)
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.borderRadius = "50%"
      p.style.background = `rgba(255,255,255,${rand(0.1,0.3)})`
      p.style.position = "absolute"
      p.style.left = `${rand(0, 100)}%`
      p.style.top = `${rand(0, 100)}%`
      p.style.pointerEvents = "none"
      p.style.zIndex = 0
      p.style.transition = "transform 0.1s linear"
      container.appendChild(p)
      particles.push({
        el: p,
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        dx: rand(-0.25, 0.25), // horizontal speed
        dy: rand(-0.25, 0.25), // vertical speed
      })
    }

    for (let i = 0; i < maxParticles; i++) createParticle()

    // Moves each particle a little every frame, wrapping it to the opposite
    // edge once it drifts off screen so the effect just keeps looping.
    let animationFrame
    function animate() {
      particles.forEach(p => {
        p.x += p.dx
        p.y += p.dy

        // wrap around edges
        if (p.x < -20) p.x = window.innerWidth + 20
        if (p.x > window.innerWidth + 20) p.x = -20
        if (p.y < -20) p.y = window.innerHeight + 20
        if (p.y > window.innerHeight + 20) p.y = -20

        p.el.style.transform = `translate(${p.x}px, ${p.y}px)`
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    // Stop the animation and remove the particle elements if this component ever unmounts.
    return () => {
      cancelAnimationFrame(animationFrame)
      particles.forEach(p => {
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el)
      })
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none" />
}
