"use client";
// Runs in the browser instead of on the server, since it needs to react to scrolling, hovering and clicks.

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import FloatingParticles from "@/components/FloatingParticles";
import { blenderProjects } from "./data";
import ContactForm from "../components/ContactForm";
import SoftParticles from "@/components/SoftParticles";
import { FadeUp, StaggerGroup, staggerItem, AppleScrollSection } from "@/components/ScrollReveal";

// The little thumbnail inside each CAD card. If the image fails to load, it just falls back to a placeholder.
function ProjectPreview({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
      <div className="relative mb-4 w-full h-52 overflow-hidden rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setImageSrc("/images/placeholder-project.svg")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
    </div>
  );
}

// One card in the CAD grid. Clicking it opens the full-size popup further down.
// Just hovering, without clicking, zooms it in slightly after 1.5 seconds.
function ProjectCard({ proj, onOpen }) {
  const [previewing, setPreviewing] = useState(false);
  const timerRef = useRef(null); // the pending 1.5s timer, so we can cancel it if the mouse leaves early

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setPreviewing(true), 1500);
  };
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setPreviewing(false);
  };

  // Clear the timer if the card gets removed from the page while it's still running.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <motion.div
      variants={staggerItem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(proj.id)}
      className="bg-neutral-900/70 rounded-3xl p-4 transition transform shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-white/10 cursor-pointer"
    >
      <motion.div
        animate={{ scale: previewing ? 1.06 : 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <ProjectPreview
          src={proj.thumbnail || "/images/placeholder-project.svg"}
          alt={proj.title}
        />
      </motion.div>

      <h3 className="font-bold text-lg">{proj.title}</h3>
      <p className="text-gray-400 text-sm">{proj.description}</p>
    </motion.div>
  );
}

export default function Home() {
  // Which CAD project is open in the popup right now. Null means nothing is open.
  const [expandedProject, setExpandedProject] = useState(null);

  // heroRef lets us track how far the visitor has scrolled through the hero section,
  // as a number from 0 (top) to 1 (fully scrolled past). We turn that into the fade,
  // shrink and drift-up effect so the name gently disappears as the next section arrives.
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.85]);
  const heroY = useTransform(heroProgress, [0, 1], [0, -80]);

  // Every other section needs its own ref too, so AppleScrollSection can fade
  // and scale it in and out as it scrolls through the screen.
  const cadSectionRef = useRef(null);
  const projectsRef = useRef(null);
  const musicRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      {/* Background particles sitting behind the whole page */}
      <SoftParticles />
      <Navbar />

      {/* Hero: the big name and title at the top of the page */}
      <section
        id="home"
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden"
      >
        {/* Floating particles behind the text */}
        <FloatingParticles />

        {/* This is what fades, shrinks and drifts up as you scroll past the hero */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="flex flex-col items-center"
        >
          {/* Animated Name */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight mb-3 mt-24 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-white/90 to-purple-500 animate-pulse-slow"
          >
            Divine Obienu
          </motion.h1>

          {/* Floating Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-lg md:text-xl text-neutral-300 max-w-xl text-center z-10 relative tracking-[0.2em] uppercase"
          >
            Design Engineer • Creator • Innovator
          </motion.h2>
        </motion.div>
      </section>

      {/* Projects: a couple of featured design projects, each linking out to a slideshow */}
      <section
        id="projects"
        ref={projectsRef}
        className="min-h-screen flex flex-col justify-center items-center px-8 py-24"
      >
        {/* Fades and scales this whole section in and out as you scroll past it */}
        <AppleScrollSection sectionRef={projectsRef} className="w-full flex flex-col items-center">
        {/* Fades this heading up into place the first time it scrolls into view */}
        <FadeUp className="max-w-5xl w-full">
          <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">
            Projects
          </h2>
          <div className="h-1 w-24 rounded-full mb-10" style={{ background: "linear-gradient(90deg, #f43f5e, #a78bfa)" }} />
        </FadeUp>

        {/* Makes the two cards below animate in one after the other instead of both at once */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl justify-items-center">
          {/* Transitional Chess */}
          <motion.a
            variants={staggerItem}
            href="https://1drv.ms/p/c/f5bd0da8c5428b6f/EdmV14zrVQNDo9OLi6NbbgkBsy614qP7DozEm5fwVdV7xA?e=33pYzf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(255,255,255,0.08)] hover:border-white/20 transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                Educational Games and Toys: Transitional Chess
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                A reimagined chess set that transitions between different
                &quot;dimensions&quot; of play. The design explores how an
                added spatial layer can increase strategic depth and encourage
                players to think more abstractly about movement, position and
                interaction.
              </p>
            </motion.div>
          </motion.a>

          {/* LED Lamp */}
          <motion.a
            variants={staggerItem}
            href="https://1drv.ms/p/c/f5bd0da8c5428b6f/EbAq4qFF95ZKmnc7aFObCv4BjB_rHf3NJmEZID0bu7Ltag?e=h0poN3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(255,255,255,0.08)] hover:border-white/20 transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                LED Lamp
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                A minimalist LED lamp design that prioritises clean form,
                controlled light spill and user comfort. The project explores
                how simple geometry, surface treatment and colour temperature
                can influence mood and the character of a space.
              </p>
            </motion.div>
          </motion.a>
        </StaggerGroup>
        </AppleScrollSection>
      </section>


      {/* CAD Skills: the grid of Blender projects. Click a card to see it full size. */}
<section
  id="CAD"
  ref={cadSectionRef}
  className="min-h-screen flex flex-col justify-center px-8 py-24"
>
  <AppleScrollSection sectionRef={cadSectionRef} className="w-full flex flex-col">
  <FadeUp className="max-w-6xl w-full mx-auto">
    <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">CAD Skills</h2>
    <div className="h-1 w-24 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #fb923c, #f43f5e)" }} />
  </FadeUp>

  {/* One card per project listed in app/data.js */}
  <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
    {blenderProjects.map((proj) => (
      <ProjectCard key={proj.id} proj={proj} onOpen={setExpandedProject} />
    ))}
  </StaggerGroup>
  </AppleScrollSection>

  {/* The full-size popup. Only shows up once expandedProject has an id in it.
      Image on top, caption underneath, so long captions never cover the picture. */}
  {expandedProject && (
    (() => {
      const active = blenderProjects.find((p) => p.id === expandedProject);
      if (!active) return null;
      const src = active.thumbnail || "/images/placeholder-project.svg";
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          {/* Dimmed background — clicking it closes the popup too */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setExpandedProject(null)}
          />

          {/* The popup card itself */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-y-auto border border-white/10 bg-neutral-900/95 shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex flex-col"
          >
            {/* Small close button, top right */}
            <button
              type="button"
              onClick={() => setExpandedProject(null)}
              aria-label="Close preview"
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-black/60 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative w-full h-[55vh] md:h-[65vh] shrink-0 bg-black/40">
              <Image src={src} alt={active.title} fill className="object-contain" sizes="100vw" />
            </div>
            <div className="p-4 border-t border-white/10 bg-neutral-900/95 shrink-0">
              <h4 className="font-semibold text-white">{active.title}</h4>
              <p className="text-sm text-gray-200 mt-1">{active.description}</p>
            </div>
          </motion.div>
        </div>
      );
    })()
  )}
</section>


      {/* Music: just some text, same scroll effect as everywhere else */}
      <section
        id="music"
        ref={musicRef}
        className="min-h-screen flex flex-col justify-center px-8 py-24 relative z-10"
      >
        <AppleScrollSection sectionRef={musicRef} className="w-full">
        <FadeUp className="max-w-3xl w-full mx-auto">
          <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">Music</h2>
          <div className="h-1 w-24 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #a78bfa, #38bdf8)" }} />
        </FadeUp>
        <FadeUp delay={0.15} className="text-gray-200 max-w-3xl mx-auto leading-relaxed text-lg">
          <p>
            Music is where I tell the stories behind everything I learn, fight, or overcome.
I create Christian rap that blends faith, honesty, and reflection — the same mindset I bring into my engineering work. It’s another way I communicate: not just through visuals or design, but through rhythm, lyricism, and testimony.
          </p>
        </FadeUp>
        </AppleScrollSection>
      </section>

      {/* About: a short bio, laid out the same way as Music */}
      <section
        id="about"
        ref={aboutRef}
        className="min-h-screen flex flex-col justify-center px-8 py-24 relative z-10"
      >
        <AppleScrollSection sectionRef={aboutRef} className="w-full">
        <FadeUp className="max-w-4xl w-full mx-auto">
          <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">About</h2>
          <div className="h-1 w-24 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #34d399, #60a5fa)" }} />
        </FadeUp>
        <FadeUp delay={0.15} className="text-gray-200 max-w-4xl mx-auto leading-relaxed text-lg">
          <p>
            I'm Divine Obienu, an aspiring Design Engineer who is always curious about how things work and how to make them better.
            I like taking an idea from a sketch to a 3D model, and then into a real-world prototype. Outside of engineering, I love to spend time making music, learning about different cultures/thought processes of people and in some occasions animals.
            In my music, I'm mainly writing things that are about faith, however a common theme you'd find in my lyrics isn't me dishing a line about "find Christ" but rather it's more about telling my story and experiences I've had. Which all in all is what everything I do is about. Telling my story.
            This portfolio showcases skills I've spent my time developing; however, it is no where near complete yet. There is still so much more I want to learn and create, and I hope to share that journey with you.
          </p>
        </FadeUp>
        </AppleScrollSection>
      </section>

      {/* Contact: the form component drops in here */}
      <section
        id="contact"
        ref={contactRef}
        className="min-h-screen flex flex-col justify-center px-8 py-24 mb-20"
      >
        <AppleScrollSection sectionRef={contactRef} className="w-full">
        <FadeUp>
          <ContactForm />
        </FadeUp>
        </AppleScrollSection>
      </section>
    </main>
  );
}
