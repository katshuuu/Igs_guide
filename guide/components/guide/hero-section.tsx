"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, BookOpen, Award, Clock } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="min-h-[calc(100vh-108px)] bg-muted">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Главная</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Умный гайд по страхованию</span>
        </nav>
      </div>

      {/* Hero content */}
      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d1fae5] dark:bg-emerald-900/30 text-[#10b981] rounded-full text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Обучающий курс
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.1] tracking-tight">
              Умный гайд
              <br />
              <span className="text-primary">по страхованию</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Интерактивный курс для тех, кто хочет разобраться в страховании. 
              Простым языком, с примерами из жизни и практическими заданиями.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onStart}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-medium"
              >
                Начать обучение
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-14 px-8 text-base font-medium"
              >
                Узнать подробнее
              </Button>
            </div>

            {/* Info note */}
            <p className="text-xs text-muted-foreground">
              Бесплатно. Без регистрации. При поддержке Ингосстрах.
            </p>
          </div>

          {/* Right - Stats cards */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">6</div>
                <div className="text-sm text-muted-foreground">категорий страхования</div>
              </div>

              {/* Card 2 */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">12+</div>
                <div className="text-sm text-muted-foreground">интерактивных заданий</div>
              </div>

              {/* Card 3 */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">10 мин</div>
                <div className="text-sm text-muted-foreground">на прохождение</div>
              </div>

              {/* Card 4 */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-sm text-muted-foreground">практической пользы</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links - like on original site */}
      <div className="border-t border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
            {[
              { label: "ОСАГО", badge: "Популярно" },
              { label: "Путешествия" },
              { label: "Каско" },
              { label: "Ипотека" },
              { label: "Квартира" },
              { label: "Все полисы" },
            ].map((item, index) => (
              <a 
                key={index}
                href="#"
                className="flex flex-col items-center justify-center py-6 hover:bg-muted transition-colors relative"
              >
                {item.badge && (
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
