"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, BookOpen, Award, Clock } from "lucide-react";

const GUIDE_APP = "/guide-app";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  const pathname = usePathname();
  const isGuideApp =
    pathname === GUIDE_APP || pathname?.startsWith(`${GUIDE_APP}/`);

  return (
    <section className="min-h-[calc(100vh-108px)] bg-transparent">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e0e7ff] to-[#dbeafe] text-[#4338ca] rounded-full text-sm font-medium border border-[#c7d2fe]/60 shadow-sm">
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
                className="rounded-full h-14 px-8 text-base font-medium border border-indigo-200/80 bg-gradient-to-r from-[#c7d2fe] via-[#a5b4fc] to-[#93c5fd] text-[#1e1b4b] shadow-md shadow-indigo-200/50 transition-shadow duration-300 hover:shadow-lg hover:shadow-indigo-300/40"
              >
                Начать обучение
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-[#c4b5fd]/90 bg-white/60 text-[#5b21b6] backdrop-blur-sm h-14 px-8 text-base font-medium transition-colors duration-300 hover:bg-[#f5f3ff] hover:border-[#a78bfa]"
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
              <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 border border-violet-100/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-violet-200/90">
                <div className="w-12 h-12 bg-[#ede9fe] rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#6d28d9]" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">6</div>
                <div className="text-sm text-muted-foreground">категорий страхования</div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 border border-sky-100/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-sky-200/90">
                <div className="w-12 h-12 bg-[#e0f2fe] rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-[#0369a1]" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">12+</div>
                <div className="text-sm text-muted-foreground">интерактивных заданий</div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-200/90">
                <div className="w-12 h-12 bg-[#d1fae5] rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[#047857]" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">10 мин</div>
                <div className="text-sm text-muted-foreground">на прохождение</div>
              </div>

              {/* Card 4 */}
              <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 border border-amber-100/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-200/90">
                <div className="w-12 h-12 bg-[#fef3c7] rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-[#b45309]" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-sm text-muted-foreground">практической пользы</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые ссылки как на ingos.ru — не показываем в отдельном guide-app */}
      {!isGuideApp && (
        <div className="border-t border-[#e9d5ff]/50 bg-white/50 backdrop-blur-sm">
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
                  className="flex flex-col items-center justify-center py-6 hover:bg-[#faf5ff]/80 transition-all duration-300 relative"
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
      )}
    </section>
  );
}
