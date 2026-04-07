"use client";

import { HeroSection } from "@/components/hero-section";
import { TransitionSection } from "@/components/transition-section";
import { MotivationSection } from "@/components/motivation-section";
import { SmokeCursor } from "@/components/custom-cursor";

export default function Home() {
  const handleStartGuide = () => {
    const pixelGameUrl = process.env.NEXT_PUBLIC_PIXEL_GAME_URL ?? "/pixel_game";
    window.location.href = pixelGameUrl;
  };

  return (
    <main className="relative cursor-none">
      <SmokeCursor />
      {/* Экран 1: Hero с подростком */}
      <HeroSection />
      
      {/* Экран 2: Переходный экран */}
      <TransitionSection />
      
      {/* Экран 3: Мотивация */}
      <MotivationSection onStartGuide={handleStartGuide} />
    </main>
  );
}
