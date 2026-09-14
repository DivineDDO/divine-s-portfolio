"use client";
// Small reusable scroll animations used across app/page.js, so every section reuses the same effects instead of repeating the setup each time.

import { motion, useScroll, useTransform } from "framer-motion";

// Controls the acceleration/deceleration feel of the simpler animations below.
const EASE = [0.22, 1, 0.36, 1];

// The "Apple-style" scroll effect used on every section: it scales up and fades in
// as it scrolls into view, stays put while centred on screen, then scales down and
// fades out as it scrolls away. It's tied directly to scroll position, so scrolling
// back up plays it in reverse.
// Give the section a ref, then wrap its content: <AppleScrollSection sectionRef={ref}>
export function AppleScrollSection({ sectionRef, children, className = "" }) {
  // A number from 0 to 1 for how far the section has scrolled through the screen —
  // 0 means it's just entering at the bottom, 1 means it's just leaving off the top.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Turns that 0-1 number into opacity/scale/position values: invisible and small
  // at 0, fully visible by 0.25, stays that way until 0.75, then fades back out by 1.
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.82, 1, 1, 0.82]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [120, 0, 0, -120]);

  return (
    <motion.div style={{ opacity, scale, y }} className={className}>
      {children}
    </motion.div>
  );
}

// A simpler one-time animation: fades in and slides up the first time it scrolls
// into view, then stays put. Doesn't reverse if you scroll back up.
export function FadeUp({ children, delay = 0, className = "", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Two states for StaggerGroup's children: hidden is how they start, show is where they end up.
// staggerChildren gives each child a slightly longer delay than the one before it.
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// Wraps a grid or list so its children animate in one after another instead of all
// at once. Each child that should join in needs variants={staggerItem}.
export function StaggerGroup({ children, className = "", ...props }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
