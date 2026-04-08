"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export type GuideStep = "home" | "about" | "concepts" | "categories" | "cases" | "quiz" | "completion";

interface NavigationProps {
  currentStep: GuideStep;
  onNavigate: (step: GuideStep) => void;
}

const steps = [
  { id: "home" as GuideStep, label: "Главная", num: 0 },
  { id: "about" as GuideStep, label: "О компании", num: 1 },
  { id: "concepts" as GuideStep, label: "Основы", num: 2 },
  { id: "categories" as GuideStep, label: "Категории", num: 3 },
  { id: "cases" as GuideStep, label: "Страховые случаи", num: 4 },
  { id: "quiz" as GuideStep, label: "Тест", num: 5 },
  { id: "completion" as GuideStep, label: "Результат", num: 6 },
];

export function Navigation({ currentStep, onNavigate }: NavigationProps) {
  const pathname = usePathname();
  const stickyTop =
    pathname === "/guide-app" || pathname?.startsWith("/guide-app/")
      ? "top-0"
      : "top-[108px]";
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div
      className={cn(
        "bg-white/75 backdrop-blur-md border-b border-[#e8e4f5]/90 sticky z-30 shadow-[0_4px_24px_rgba(139,92,246,0.06)]",
        stickyTop
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Breadcrumb style navigation */}
        <div className="flex items-center gap-2 h-14 overflow-x-auto scrollbar-hide">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPast = index < currentIndex;
            const isFuture = index > currentIndex;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => !isFuture && onNavigate(step.id)}
                  disabled={isFuture}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    isActive &&
                      "bg-gradient-to-r from-[#ddd6fe] to-[#c7d2fe] text-[#312e81] shadow-sm",
                    isPast && "text-[#4c1d95] hover:bg-[#ede9fe]/80",
                    isFuture && "text-muted-foreground/45 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300",
                    isActive && "bg-white/90 text-[#4c1d95] shadow-sm",
                    isPast && "bg-[#ede9fe] text-[#5b21b6]",
                    isFuture && "bg-muted text-muted-foreground"
                  )}>
                    {step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className={cn(
                    "w-4 h-4 mx-1 flex-shrink-0",
                    index < currentIndex ? "text-[#a78bfa]" : "text-muted-foreground/25"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[#f3e8ff]/90 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c4b5fd] via-[#a78bfa] to-[#818cf8] transition-all duration-500 ease-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
