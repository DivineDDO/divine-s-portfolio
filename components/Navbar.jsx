"use client"
// The nav bar at the top of the site. On desktop it hides itself once you scroll
// down a bit, then comes back if you move the mouse near the top of the screen
// or scroll back up. Each link also gets a coloured pill behind it that slides
// smoothly between links as you hover or as the active section changes.
import { Link } from "react-scroll"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// The five links in the nav, each with the section id it jumps to and its accent colour.
const navItems = [
  { name: "Projects", id: "projects", color: "blue" },
  { name: "CAD", id: "CAD", color: "orange" },
  { name: "Music", id: "music", color: "purple" },
  { name: "About", id: "about", color: "green" },
  { name: "Contact", id: "contact", color: "pink" },
]

export default function Navbar() {
  const [active, setActive] = useState(null)   // which section is in view right now
  const [hovered, setHovered] = useState(null) // which link the mouse is over

  const [hidden, setHidden] = useState(false)
  const SCROLL_THRESHOLD = 120   // px (scroll past this -> hide)
  const HOTSPOT = 70             // px from top to reveal when pointer moves there

  // Decide whether the navbar should start hidden, based on how far down the
  // page already is. Mobile always starts visible since there's no mouse to hover with.
  useEffect(() => {
    if (typeof window === "undefined") return

    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // 📱 mobile: navbar should always be visible
      setHidden(false)
    } else {
      setHidden(window.scrollY > SCROLL_THRESHOLD)
    }
  }, [])

  // Wires up the listeners for the show/hide behaviour: scroll position, mouse
  // movement, and taps near the top edge on touch devices.
  useEffect(() => {
    if (typeof window === "undefined") return

    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // 📱 mobile: skip scroll + pointer behaviour entirely
      return
    }

    let ticking = false // stops us handling scroll more than once per frame

    function onScroll() {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset
          setHidden(y > SCROLL_THRESHOLD)
          ticking = false
        })
      }
    }

    // Moving the mouse into the top strip always brings the navbar back,
    // even past the scroll threshold.
    function onPointerMove(e) {
      const y = e.clientY ?? -1
      if (y >= 0 && y <= HOTSPOT) {
        setHidden(false)
        return
      }
      if (window.scrollY > SCROLL_THRESHOLD) setHidden(true)
      else setHidden(false)
    }

    function onTouchStart(e) {
      const t = e.touches && e.touches[0]
      if (t && t.clientY <= HOTSPOT) {
        setHidden(false)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("touchstart", onTouchStart, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("touchstart", onTouchStart)
    }
  }, [])

  // Gets the Tailwind classes for a nav item's colour.
  const getColor = (color, type) => {
    const colors = {
      blue: { text: "text-blue-400", bg: "bg-blue-500/20" },
      orange: { text: "text-orange-400", bg: "bg-orange-500/20" },
      purple: { text: "text-purple-400", bg: "bg-purple-500/20" },
      green: { text: "text-green-400", bg: "bg-green-500/20" },
      pink: { text: "text-pink-400", bg: "bg-pink-500/20" },
    }
    return colors[color]?.[type] || colors.blue[type]
  }

  // Picks the glow effect for a colour (defined in globals.css).
  const glowFor = (color) =>
    color === "blue" ? "bg-blue-glow" :
    color === "orange" ? "bg-orange-glow" :
    color === "purple" ? "bg-purple-glow" :
    color === "green" ? "bg-green-glow" :
    "bg-pink-glow"

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: hidden ? -90 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed top-0 left-0 w-full bg-neutral-950/70 backdrop-blur-lg text-white px-4 md:px-6 py-3 flex justify-between items-center z-50 border-b border-neutral-800"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerEnter={() => setHidden(false)}
    >
      <a href="/" className="text-lg md:text-xl font-bold hover:text-gray-300 transition whitespace-nowrap mr-4">
        Divine<span className="text-red-700">.</span>
      </a>

      {/* Nav items container – scrollable on mobile */}
      <div
        className="
          flex gap-4 md:gap-5 text-sm
          overflow-x-auto overflow-y-hidden whitespace-nowrap
          md:overflow-visible
          [-webkit-overflow-scrolling:touch]
          scrollbar-hide
        "
      >
        {navItems.map((item) => {
          const isActive = active === item.id
          const isHovered = hovered === item.id
          const color = getColor(item.color, "text")
          const bgColor = getColor(item.color, "bg")
          const glowClass = glowFor(item.color)

          return (
            <motion.div
              key={item.id}
              className="relative cursor-pointer"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* react-scroll's Link smooth-scrolls to the matching section id,
                  and spy watches scroll position to mark the right link active
                  without needing a click. */}
              <Link
                to={item.id}
                smooth={true}
                spy={true}
                offset={-70}
                duration={600}
                onSetActive={() => setActive(item.id)}
                className={`relative px-3 py-1 font-medium transition-colors duration-300 ${
                  isActive ? color : "text-gray-400"
                }`}
              >
                {/* The coloured pill behind the active or hovered link. layoutId
                    lets it slide smoothly to its new spot instead of just jumping there. */}
                {(isHovered || isActive) && (
                  <motion.span
                    layoutId={`bubble-${item.id}`}
                    className={`absolute inset-0 rounded-full ${bgColor} ${glowClass}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                )}

                <span className="relative z-10">{item.name}</span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.nav>
  )
}
