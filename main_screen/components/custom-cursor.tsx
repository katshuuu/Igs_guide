"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  size: number;
  lifetime: number;
}

export function SmokeCursor() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hasPointerPosition, setHasPointerPosition] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringAction, setIsHoveringAction] = useState(false);
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const particleIdRef = useRef(0);

  const smoothX = useSpring(cursor.x, { stiffness: 240, damping: 28, mass: 0.5 });
  const smoothY = useSpring(cursor.y, { stiffness: 240, damping: 28, mass: 0.5 });
  const ringX = useSpring(cursor.x, { stiffness: 140, damping: 24, mass: 1 });
  const ringY = useSpring(cursor.y, { stiffness: 140, damping: 24, mass: 1 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    let lastEmit = 0;

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setHasPointerPosition(true);
      setCursor({ x, y });
      setIsVisible(true);

      const now = performance.now();
      if (now - lastEmit < 8) return;
      lastEmit = now;

      const particle: SmokeParticle = {
        id: particleIdRef.current++,
        x,
        y,
        driftX: (Math.random() - 0.5) * 52,
        driftY: -18 - Math.random() * 38,
        size: 28 + Math.random() * 22,
        lifetime: 620 + Math.random() * 340,
      };

      setParticles((prev) => {
        const next = [...prev, particle];
        const maxParticles = 44;
        return next.length > maxParticles ? next.slice(next.length - maxParticles) : next;
      });

      window.setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      }, particle.lifetime);
    };

    const handleLeave = () => setIsVisible(false);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      setIsHoveringAction(Boolean(target.closest("a, button, [role='button'], input, textarea, select, label")));
    };

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseover", handleOver);
      document.body.style.cursor = prevCursor || "auto";
    };
  }, []);

  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-screen"
          initial={{ x: particle.x, y: particle.y, opacity: 0.48, scale: 0.85 }}
          animate={{
            x: particle.x + particle.driftX,
            y: particle.y + particle.driftY,
            opacity: 0,
            scale: 2.9,
          }}
          transition={{ duration: particle.lifetime / 1000, ease: "easeOut" }}
          style={{ translateX: "-50%", translateY: "-50%" }}
        >
          <div
            className="rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background:
                "radial-gradient(circle, rgba(160, 220, 255, 0.95) 0%, rgba(90, 180, 255, 0.55) 32%, rgba(60, 140, 255, 0.22) 58%, rgba(40, 100, 200, 0.06) 78%, transparent 100%)",
              filter: "blur(8px)",
            }}
          />
        </motion.div>
      ))}

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: isVisible && hasPointerPosition ? 1 : 0,
          scale: isHoveringAction ? 1.35 : 1,
        }}
        transition={{ duration: 0.18 }}
      >
        <div
          className="rounded-full"
          style={{
            width: 38,
            height: 38,
            border: "1.5px solid rgba(182,225,255,0.55)",
            boxShadow:
              "0 0 22px rgba(249, 249, 249, 0.42), 0 0 56px rgba(88, 155, 228, 0.25), inset 0 0 14px rgba(196, 235, 255, 0.2)",
            background:
              "radial-gradient(circle, rgba(173, 224, 255, 0.72) 0%, rgba(103,170,235,0.06) 48%, rgba(0,0,0,0) 72%)",
          }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: isVisible && hasPointerPosition ? 1 : 0,
          scale: isHoveringAction ? 0.78 : 1,
        }}
        transition={{ duration: 0.14 }}
      >
        <div
          className="rounded-full"
          style={{
            width: 5,
            height: 5,
            background: "#38b6ff",
            boxShadow:
              "0 0 6px rgba(56, 182, 255, 1), 0 0 14px rgba(0, 180, 255, 0.95), 0 0 24px rgba(0, 140, 255, 0.65), inset 0 0 4px rgba(200, 240, 255, 0.9)",
          }}
        />
      </motion.div>
    </>
  );
}