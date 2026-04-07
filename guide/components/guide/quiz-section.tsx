"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { quizQuestions } from "@/lib/insurance-data";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSectionProps {
  onComplete: (score: number, total: number) => void;
  onRestart: () => void;
}

export function QuizSection({ onComplete }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = score + (selectedAnswer === question.correctAnswer ? 1 : 0);
      onComplete(finalScore, quizQuestions.length);
    }
  };

  return (
    <section className="min-h-screen bg-muted pb-16">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Главная</a>
          <ChevronRight className="w-4 h-4" />
          <a href="#" className="hover:text-foreground transition-colors">Умный гайд</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Финальный тест</span>
        </nav>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Проверь свои знания
          </h1>
          <p className="text-muted-foreground text-lg">
            Ответь на вопросы, чтобы закрепить изученный материал
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left - Progress sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-4 sticky top-[180px]">
              <h3 className="font-semibold text-foreground mb-4">Прогресс</h3>
              <div className="space-y-2">
                {quizQuestions.map((_, index) => {
                  const isCurrent = index === currentQuestion;
                  const isPast = index < currentQuestion;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                        isCurrent && "bg-primary/10 text-primary font-medium",
                        isPast && "text-success",
                        !isCurrent && !isPast && "text-muted-foreground"
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        isCurrent && "bg-primary text-primary-foreground",
                        isPast && "bg-success text-success-foreground",
                        !isCurrent && !isPast && "bg-muted text-muted-foreground"
                      )}>
                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </span>
                      <span>Вопрос {index + 1}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">Правильных ответов</div>
                <div className="text-2xl font-bold text-success">{score}</div>
              </div>
            </div>
          </div>

          {/* Main - Question */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Question header */}
              <div className="bg-primary/5 p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {currentQuestion + 1}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Вопрос {currentQuestion + 1} из {quizQuestions.length}
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      {question.question}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300 border-2",
                      showExplanation
                        ? index === question.correctAnswer
                          ? "bg-success/10 border-success"
                          : index === selectedAnswer
                          ? "bg-destructive/10 border-destructive"
                          : "bg-card border-border"
                        : selectedAnswer === index
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            showExplanation
                              ? index === question.correctAnswer
                                ? "bg-success text-success-foreground"
                                : index === selectedAnswer
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-muted text-muted-foreground"
                              : selectedAnswer === index
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-foreground">{option}</span>
                      </div>
                      {showExplanation && index === question.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      )}
                      {showExplanation &&
                        index === selectedAnswer &&
                        index !== question.correctAnswer && (
                          <XCircle className="w-5 h-5 text-destructive shrink-0" />
                        )}
                    </div>
                  </button>
                ))}

                {showExplanation && (
                  <div className="mt-6 p-5 bg-muted rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="font-semibold text-primary mb-2">Объяснение</h4>
                    <p className="text-foreground">{question.explanation}</p>
                  </div>
                )}
              </div>

              {/* Navigation footer */}
              <div className="border-t border-border p-4 flex justify-end bg-muted/30">
                <Button
                  onClick={handleNext}
                  disabled={!showExplanation}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
