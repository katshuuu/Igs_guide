"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Star,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Target,
  Lightbulb,
  Heart,
  ExternalLink,
  RotateCcw,
  Share2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionSectionProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function CompletionSection({ score, totalQuestions, onRestart }: CompletionSectionProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getResultData = () => {
    if (percentage >= 80) {
      return {
        title: "Ты - настоящий эксперт!",
        subtitle: "Превосходный результат! Ты отлично разобрался в теме страхования.",
        badge: "Эксперт",
        badgeColor: "bg-gradient-to-r from-amber-400 to-orange-500",
        icon: Trophy,
      };
    } else if (percentage >= 60) {
      return {
        title: "Отличный результат!",
        subtitle: "Ты хорошо усвоил основы страхования. Продолжай в том же духе!",
        badge: "Знаток",
        badgeColor: "bg-gradient-to-r from-primary to-blue-600",
        icon: Star,
      };
    } else {
      return {
        title: "Хорошее начало!",
        subtitle: "Ты сделал первый шаг к финансовой грамотности. Это уже много значит!",
        badge: "Ученик",
        badgeColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
        icon: GraduationCap,
      };
    }
  };

  const result = getResultData();
  const ResultIcon = result.icon;

  const achievements = [
    {
      icon: Shield,
      title: "Защита имущества",
      description: "Ты знаешь, как защитить свои гаджеты и вещи",
    },
    {
      icon: Target,
      title: "Понимание рисков",
      description: "Ты умеешь оценивать и минимизировать риски",
    },
    {
      icon: Lightbulb,
      title: "Финансовая грамотность",
      description: "Ты понимаешь базовые принципы страхования",
    },
    {
      icon: Heart,
      title: "Забота о себе",
      description: "Ты готов защитить своё здоровье и будущее",
    },
  ];

  const tips = [
    "Храни страховой полис в надёжном месте и сделай его фото на телефон",
    "Перед покупкой страховки всегда читай условия договора",
    "При страховом случае сразу звони в страховую компанию",
    "Регулярно проверяй срок действия своих страховок",
    "Сравнивай предложения разных страховых компаний",
  ];

  const ingosProducts = [
    {
      name: "Страхование гаджетов",
      description: "Защити свой смартфон, ноутбук и другую технику",
      link: "https://www.ingos.ru",
    },
    {
      name: "Страхование путешественников",
      description: "Безопасные поездки по России и за рубежом",
      link: "https://www.ingos.ru",
    },
    {
      name: "Страхование от несчастных случаев",
      description: "Защита при занятиях спортом и активном отдыхе",
      link: "https://www.ingos.ru",
    },
  ];

  return (
    <section className="min-h-screen bg-muted pb-16 relative overflow-hidden">
      {/* Animated background elements */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className={cn(
                  "w-4 h-4",
                  i % 3 === 0 ? "text-primary" : i % 3 === 1 ? "text-accent" : "text-amber-400"
                )}
              />
            </div>
          ))}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Главная</a>
          <span className="mx-1">{'>'}</span>
          <a href="#" className="hover:text-foreground transition-colors">Умный гайд</a>
          <span className="mx-1">{'>'}</span>
          <span className="text-foreground">Результат</span>
        </nav>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-success mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Обучение завершено</span>
          </div>

          <div className="mb-8">
            <div className={cn(
              "w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center shadow-2xl",
              result.badgeColor
            )}>
              <ResultIcon className="w-14 h-14 text-white" />
            </div>
            
            <div className={cn(
              "inline-block px-4 py-1.5 rounded-full text-white text-sm font-semibold mb-4",
              result.badgeColor
            )}>
              {result.badge}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {result.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {result.subtitle}
            </p>
          </div>

          {/* Score Display */}
          <Card className="inline-block bg-card border-2 border-primary/20 shadow-xl mb-8">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-1">
                  {score}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">правильных ответов</div>
              </div>
              <div className="w-px h-16 bg-border" />
              <div className="text-center">
                <div className="text-5xl font-bold text-foreground mb-1">
                  {percentage}%
                </div>
                <div className="text-sm text-muted-foreground">успешность</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            Твои достижения
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-card border hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <achievement.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Motivation Block */}
        <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2 border-primary/20 mb-12 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ты не зря потратил время!
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Теперь ты понимаешь, как работает страхование и зачем оно нужно</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Ты знаешь, как защитить свои вещи и здоровье от неприятностей</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Ты сделал важный шаг к финансовой грамотности</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Эти знания помогут тебе принимать правильные решения во взрослой жизни</span>
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tip of the Day */}
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 mb-12">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-900" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Полезный совет
                </h3>
                <p className="text-amber-800 dark:text-amber-200 transition-all duration-500">
                  {tips[currentTip]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingosstrakh Products */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">И</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Ингосстрах</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Готов применить знания на практике? Ингосстрах предлагает специальные 
              продукты для молодёжи с понятными условиями и выгодными ценами.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {ingosProducts.map((product, index) => (
              <Card key={index} className="bg-card border hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Подробнее
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8 py-6 text-lg"
              asChild
            >
              <a href="https://www.ingos.ru" target="_blank" rel="noopener noreferrer">
                Перейти на сайт Ингосстрах
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Более 75 лет надёжной защиты
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-8 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={onRestart}
            className="rounded-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Пройти гайд заново
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Умный гайд по страхованию",
                  text: `Я прошёл обучающий гайд по страхованию от Ингосстрах и набрал ${score}/${totalQuestions}!`,
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться
          </Button>
        </div>

        {/* Footer message */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-muted-foreground">
            Спасибо, что прошёл наш гайд! Теперь ты знаешь больше о страховании, 
            чем многие взрослые. Используй эти знания с умом!
          </p>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </section>
  );
}
