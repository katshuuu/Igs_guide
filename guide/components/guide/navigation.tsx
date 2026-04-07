"use client";

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
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-card border-b border-border sticky top-[108px] z-30">
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
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive && "bg-primary text-primary-foreground",
                    isPast && "text-primary hover:bg-primary/10",
                    isFuture && "text-muted-foreground/50 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isActive && "bg-primary-foreground text-primary",
                    isPast && "bg-primary/10 text-primary",
                    isFuture && "bg-muted text-muted-foreground"
                  )}>
                    {step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className={cn(
                    "w-4 h-4 mx-1 flex-shrink-0",
                    index < currentIndex ? "text-primary" : "text-muted-foreground/30"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
