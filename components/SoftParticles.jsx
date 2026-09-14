"use client"
// A second background effect, this one behind the whole page rather than just
// the hero — glowing dots on a canvas that drift around and bounce off the edges.
import { useEffect, useRef } from "react";

export default function SoftParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d"); // the drawing API for canvas
    let particles = [];
    const colors = ["#8c1c2e", "#f7d488", "#8c1c2e", "#0b0b0f", "#f5f5f5"];

    // Keeps the canvas matching the window size so the dots don't get stretched after a resize.
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Start with 25 particles, each at a random spot with a random size, colour and speed.
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 1, // radius
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    // Every frame: clear the canvas, draw each dot with a glow, then move it —
    // bouncing off the edge instead of wrapping around.
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "40"; // "40" = roughly 25% opacity
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
