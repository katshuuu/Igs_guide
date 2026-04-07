"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MOTIVATION_SECTION_BG } from "@/lib/section-colors";
import { MoneyRain } from "./money-rain";

interface TransitionSectionProps {
  onStart?: () => void;
}

export function TransitionSection({ onStart }: TransitionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const [isClicked, setIsClicked] = useState(false);
  const [showMoneyRain, setShowMoneyRain] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setShowMoneyRain(true);
    
    // Останавливаем дождь из денег через 4 секунды
    setTimeout(() => {
      setShowMoneyRain(false);
    }, 4000);
    
    setTimeout(() => {
      onStart?.();
    }, 800);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* После клика плавно переходим к цвету следующего экрана (не чёрный) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{ backgroundColor: MOTIVATION_SECTION_BG }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isClicked ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Честно: страховка для тебя пока просто слово?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="flex flex-wrap justify-center text-xl md:text-2xl lg:text-3xl text-white/70 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Часто гораздо проще думать, что это чужие истории из ленты — не твоя жизнь.
        </motion.p>

        {/* Description text */}
        <motion.p
          className="flex flex-wrap justify-center text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Тебе объясняют сложными словами, а выбираешь все-таки по ощущениям — и это нормально.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={handleClick}
          className="relative px-10 py-4 text-lg font-semibold text-[#0a1628] bg-white rounded-full overflow-hidden group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Button glow effect */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-white to-cyan-400/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">Я что-то теряю?</span>
        </motion.button>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Money Rain Effect */}
      <MoneyRain isActive={showMoneyRain} duration={4000} />
    </section>
  );
}
