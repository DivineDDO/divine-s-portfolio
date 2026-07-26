"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import FloatingParticles from "@/components/FloatingParticles";
import { blenderProjects } from "./data";
import ContactForm from "../components/ContactForm";
import SoftParticles from "@/components/SoftParticles";

function ProjectPreview({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <div className="relative mb-4 w-full h-52 overflow-hidden rounded-2xl bg-neutral-800/80 border border-white/10">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageSrc("/images/placeholder-project.svg")}
      />
    </div>
  );
}

// section color map — used to give each section an accent bar that matches the navbar color
const SECTION_COLORS = {
  projects: "#851b1b", // red
  CAD: "#FB923C",      // orange
  music: "#A78BFA",    // purple
  about: "#34D399",    // green
  contact: "#F472B6",  // pink
};

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState(null);
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <SoftParticles />
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden"
      >
        {/* Floating particles behind the text */}
        <FloatingParticles />

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
      </section>

          {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex flex-col justify-center items-center px-8 py-24 border-t border-neutral-800/80"
      >
        <div className="max-w-5xl w-full">
          <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">
            Projects
          </h2>
          <div className="h-1 w-24 rounded-full mb-10" style={{ background: "linear-gradient(90deg, #f43f5e, #a78bfa)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl justify-items-center">
          {/* Transitional Chess */}
          <a
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
          </a>

          {/* LED Lamp */}
          <a
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
          </a>
        </div>
      </section>


      {/* CAD Skills Section */}
<section
  id="CAD"
  className="min-h-screen flex flex-col justify-center px-8 py-24 border-t border-neutral-800/80"
>
  <div className="max-w-6xl w-full mx-auto">
    <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">CAD Skills</h2>
    <div className="h-1 w-24 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #fb923c, #f43f5e)" }} />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
    {blenderProjects.map((proj) => (
      <div
        key={proj.id}
        onClick={() => setHoveredProject((cur) => (cur === proj.id ? null : proj.id))}
        className="bg-neutral-900/70 rounded-3xl p-4 transition transform shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-white/10 cursor-pointer"
      >
        <ProjectPreview
          src={proj.thumbnail || "/images/placeholder-project.svg"}
          alt={proj.title}
        />

        <h3 className="font-bold text-lg">{proj.title}</h3>
        <p className="text-gray-400 text-sm">{proj.description}</p>
      </div>
    ))}
  </div>

  {/* Hover overlay: centered expanded image and blurred/dimmed background */}
  {hoveredProject && (
    (() => {
      const active = blenderProjects.find((p) => p.id === hoveredProject);
      if (!active) return null;
      const src = active.thumbnail || "/images/placeholder-project.svg";
      return (
        <>
          {/* Full-screen dim + blur (does not capture pointer events so hover still works) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }} className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setHoveredProject(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          </motion.div>

          {/* Centered image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6"
          >
            <div className="max-w-4xl w-full max-h-[80vh] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)] transform relative h-[80vh]">
              <Image src={src} alt={active.title} fill className="object-cover bg-transparent" />
            </div>
          </motion.div>

          {/* Bottom-right description */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="fixed right-6 bottom-6 max-w-sm bg-transparent p-4 rounded-lg text-white z-50 pointer-events-none">
            <div className="backdrop-blur-sm bg-neutral-900/60 p-3 rounded-lg border border-white/10">
              <h4 className="font-semibold">{active.title}</h4>
              <p className="text-sm text-gray-200 mt-1">{active.description}</p>
            </div>
          </motion.div>
        </>
      );
    })()
  )}
</section>


      {/* Music Section */}
      <section
        id="music"
        className="min-h-screen flex flex-col justify-center px-8 py-24 border-t border-neutral-800/80 relative z-10"
      >
        <div className="max-w-3xl w-full mx-auto">
          <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">Music</h2>
          <div className="h-1 w-24 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #a78bfa, #38bdf8)" }} />
        </div>
        <p className="text-gray-200 max-w-3xl mx-auto leading-relaxed text-lg">
          Music is where I tell the stories behind everything I learn, fight, or overcome.
I create Christian rap that blends faith, honesty, and reflection — the same mindset I bring into my engineering work. It’s another way I communicate: not just through visuals or design, but through rhythm, lyricism, and testimony.
        </p>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center px-8 py-24 border-t border-neutral-800/80 relative z-10"
      >
        <div className="max-w-4xl w-full mx-auto">
          <h2 className="text-4xl font-semibold mb-2 text-white tracking-tight">About</h2>
          <div className="h-1 w-24 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #34d399, #60a5fa)" }} />
        </div>
        <p className="text-gray-200 max-w-4xl mx-auto leading-relaxed text-lg">
          I’m Divine Obienu — a Design Engineering student with a curiosity that refuses to switch off.
I like understanding how things work, but I love figuring out how to make them better. That’s what pushes me into engineering, CAD, and digital creativity. I work across physical prototyping, 3D modelling, and product design, where I experiment with form, movement, and user experience. My approach is simple: if I can imagine it, I’ll push myself to build it — from multi-dimensional chess sets to concept tunnels inspired by organic structures.
Beyond design, I enjoy writing and producing Christian rap, where storytelling and faith help shape how I think and create. I’m also active in my school community, whether that’s serving as Sixth Form Deputy Head, leading discussions through my ‘Why Christian?’ club, or helping younger students through mentoring.
My long-term goal is to study Design Engineering at a distinguished university; moving on to a career which involves building things that don’t just look good, but genuinely improve how people navigate the world.
Every project on this portfolio is a step toward that future.
        </p>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex flex-col justify-center px-8 py-24 border-t border-neutral-800/80 mb-20"
      >
        <ContactForm />
      </section>
    </main>
  );
}