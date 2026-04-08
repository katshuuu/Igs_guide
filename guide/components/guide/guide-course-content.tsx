"use client";

import { useState } from "react";
import { Navigation, type GuideStep } from "@/components/guide/navigation";
import { HeroSection } from "@/components/guide/hero-section";
import { AboutIngosstrakh } from "@/components/guide/about-ingosstrakh";
import { ConceptsSection } from "@/components/guide/concepts-section";
import { CategoriesSection } from "@/components/guide/categories-section";
import { InsuranceCasesSection } from "@/components/guide/insurance-cases-section";
import { QuizSection } from "@/components/guide/quiz-section";
import { CompletionSection } from "@/components/guide/completion-section";

export function GuideCourseContent() {
  const [currentStep, setCurrentStep] = useState<GuideStep>("home");
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

  const handleNavigate = (step: GuideStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizResult({ score, total });
    setCurrentStep("completion");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setCurrentStep("home");
    setQuizResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="guide-course-root min-h-screen">
      {currentStep !== "home" && (
        <Navigation currentStep={currentStep} onNavigate={handleNavigate} />
      )}

      <main>
        {currentStep === "home" && (
          <HeroSection onStart={() => handleNavigate("about")} />
        )}

        {currentStep === "about" && (
          <AboutIngosstrakh onContinue={() => handleNavigate("concepts")} />
        )}

        {currentStep === "concepts" && (
          <ConceptsSection onComplete={() => handleNavigate("categories")} />
        )}

        {currentStep === "categories" && (
          <CategoriesSection
            onComplete={() => handleNavigate("cases")}
            onBack={() => handleNavigate("concepts")}
          />
        )}

        {currentStep === "cases" && (
          <InsuranceCasesSection onComplete={() => handleNavigate("quiz")} />
        )}

        {currentStep === "quiz" && (
          <QuizSection onComplete={handleQuizComplete} onRestart={handleRestart} />
        )}

        {currentStep === "completion" && quizResult && (
          <CompletionSection
            score={quizResult.score}
            totalQuestions={quizResult.total}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
