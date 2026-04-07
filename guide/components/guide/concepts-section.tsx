"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { insuranceConcepts } from "@/lib/insurance-data";
import { ChevronRight, ChevronLeft, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConceptsSectionProps {
  onComplete: () => void;
}

export function ConceptsSection({ onComplete }: ConceptsSectionProps) {
  const [currentConcept, setCurrentConcept] = useState(0);
  const [viewedConcepts, setViewedConcepts] = useState<Set<string>>(
    new Set([insuranceConcepts[0].id])
  );

  const handleNext = () => {
    if (currentConcept < insuranceConcepts.length - 1) {
      const nextIndex = currentConcept + 1;
      setCurrentConcept(nextIndex);
      setViewedConcepts((prev) => new Set([...prev, insuranceConcepts[nextIndex].id]));
    }
  };

  const handlePrev = () => {
    if (currentConcept > 0) {
      setCurrentConcept(currentConcept - 1);
    }
  };

  const handleSelectConcept = (index: number) => {
    setCurrentConcept(index);
    setViewedConcepts((prev) => new Set([...prev, insuranceConcepts[index].id]));
  };

  const allViewed = viewedConcepts.size === insuranceConcepts.length;
  const concept = insuranceConcepts[currentConcept];

  return (
    <section className="min-h-screen bg-muted pb-16">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Главная</a>
          <ChevronRight className="w-4 h-4" />
          <a href="#" className="hover:text-foreground transition-colors">Умный гайд</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Основы страхования</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Ключевые понятия страхования
          </h1>
          <p className="text-muted-foreground text-lg">
            Изучи базовые термины, чтобы понимать, как работает страхование
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left sidebar - concept list */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4 px-2">
                Понятия ({viewedConcepts.size}/{insuranceConcepts.length})
              </h3>
              <div className="space-y-1">
                {insuranceConcepts.map((c, index) => {
                  const isViewed = viewedConcepts.has(c.id);
                  const isCurrent = index === currentConcept;
                  
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectConcept(index)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
                        isCurrent && "bg-primary text-primary-foreground",
                        !isCurrent && isViewed && "bg-success/10 text-foreground hover:bg-success/20",
                        !isCurrent && !isViewed && "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <span className="text-xl">{c.icon}</span>
                      <span className="text-sm font-medium flex-1">{c.title}</span>
                      {isViewed && !isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Concept header */}
              <div className="bg-primary/5 p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                    {concept.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {concept.title}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      Понятие {currentConcept + 1} из {insuranceConcepts.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Concept content */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Определение
                  </h4>
                  <p className="text-lg text-foreground leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div className="bg-muted rounded-2xl p-5">
                  <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Пример из жизни
                  </h4>
                  <p className="text-foreground">{concept.example}</p>
                </div>
              </div>

              {/* Navigation footer */}
              <div className="border-t border-border p-4 flex items-center justify-between bg-muted/30">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentConcept === 0}
                  className="rounded-full h-10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Назад
                </Button>

                <div className="text-sm text-muted-foreground">
                  {allViewed ? (
                    <span className="flex items-center gap-2 text-success font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Все понятия изучены
                    </span>
                  ) : (
                    <span>{viewedConcepts.size} из {insuranceConcepts.length} изучено</span>
                  )}
                </div>

                {currentConcept < insuranceConcepts.length - 1 ? (
                  <Button 
                    onClick={handleNext} 
                    className="rounded-full bg-primary text-primary-foreground h-10"
                  >
                    Далее
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={onComplete}
                    className="rounded-full bg-primary text-primary-foreground h-10"
                  >
                    К категориям
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
