"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Fades + slides a block up into place once it scrolls into view.
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

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// Wrap a grid/list; give each direct motion child `variants={staggerItem}`
// and they'll cascade in one after another as the group enters the viewport.
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
