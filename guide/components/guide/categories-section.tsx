"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Smartphone,
  Plane,
  Heart,
  Car,
  Home,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CategoriesSectionProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
  imageUrl: string;
  benefits: string[];
  questions: Question[];
}

const categories: Category[] = [
  {
    id: "gadgets",
    title: "Гаджеты и техника",
    icon: Smartphone,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Защити свой смартфон, ноутбук, планшет и другие устройства от случайных повреждений, кражи и поломок",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    benefits: [
      "Защита от случайных падений и ударов",
      "Компенсация при заливе жидкостью",
      "Выплата при краже устройства",
      "Ремонт в авторизованных сервисах",
    ],
    questions: [
      {
        id: 1,
        question: "Что делать в первую очередь, если разбил застрахованный телефон?",
        options: [
          "Купить новый телефон",
          "Позвонить друзьям",
          "Связаться со страховой и сообщить о случае",
          "Попробовать починить самостоятельно",
        ],
        correctAnswer: 2,
        explanation: "Правильно! При страховом случае нужно сразу связаться со страховой компанией и следовать их инструкциям.",
      },
      {
        id: 2,
        question: "Какой случай НЕ покрывается страховкой гаджета?",
        options: [
          "Случайное падение в воду",
          "Разбитый экран от падения",
          "Самостоятельный разбор устройства",
          "Кража из кармана",
        ],
        correctAnswer: 2,
        explanation: "Самостоятельное вмешательство в устройство — это не страховой случай. Всегда обращайся к специалистам!",
      },
    ],
  },
  {
    id: "travel",
    title: "Путешествия",
    icon: Plane,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
    description: "Путешествуй без забот! Страховка покроет отмену поездки, медицинские расходы за границей и потерю багажа",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    benefits: [
      "Медицинская помощь за рубежом",
      "Компенсация отмены поездки",
      "Защита багажа от утери",
      "Экстренная эвакуация",
    ],
    questions: [
      {
        id: 1,
        question: "Когда лучше всего оформлять страховку путешественника?",
        options: [
          "В аэропорту перед вылетом",
          "После приезда в другую страну",
          "При покупке билетов или бронировании отеля",
          "Страховка не нужна",
        ],
        correctAnswer: 2,
        explanation: "Оформляй страховку заранее, при покупке билетов. Так ты будешь защищён даже при отмене поездки!",
      },
      {
        id: 2,
        question: "Что покрывает туристическая страховка Ингосстрах?",
        options: [
          "Только перелёт",
          "Только отель",
          "Медицину, отмену поездки, багаж и многое другое",
          "Только сувениры",
        ],
        correctAnswer: 2,
        explanation: "Туристическая страховка — это комплексная защита: медицина, отмена, багаж, экстренные ситуации!",
      },
    ],
  },
  {
    id: "health",
    title: "Здоровье и спорт",
    icon: Heart,
    color: "text-accent",
    bgColor: "bg-accent/10",
    description: "Занимаешься спортом или просто ведёшь активный образ жизни? Страховка поможет при травмах и болезнях",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    benefits: [
      "Покрытие спортивных травм",
      "Оплата лечения и реабилитации",
      "Компенсация при несчастных случаях",
      "Страхование соревнований",
    ],
    questions: [
      {
        id: 1,
        question: "Кому особенно нужна спортивная страховка?",
        options: [
          "Только профессиональным спортсменам",
          "Только взрослым",
          "Всем, кто занимается активным спортом",
          "Никому, спорт безопасен",
        ],
        correctAnswer: 2,
        explanation: "Спортивная страховка нужна всем активным людям: от любителей скейта до танцоров и велосипедистов!",
      },
      {
        id: 2,
        question: "Что включает спортивная страховка Ингосстрах?",
        options: [
          "Только переломы",
          "Лечение, реабилитацию и даже временную нетрудоспособность",
          "Только массаж",
          "Покупку инвентаря",
        ],
        correctAnswer: 1,
        explanation: "Спортивная страховка покрывает широкий спектр: от первой помощи до полной реабилитации!",
      },
    ],
  },
  {
    id: "transport",
    title: "Транспорт",
    icon: Car,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    description: "Велосипед, самокат, скутер или первая машина — защити свой транспорт от повреждений и угона",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    benefits: [
      "Защита от угона",
      "Ремонт при авариях",
      "Страхование электросамокатов",
      "Помощь на дороге",
    ],
    questions: [
      {
        id: 1,
        question: "Можно ли застраховать электросамокат или велосипед?",
        options: [
          "Нет, только автомобили",
          "Да, в Ингосстрах есть такие программы",
          "Только если он очень дорогой",
          "Только для взрослых",
        ],
        correctAnswer: 1,
        explanation: "Да! Ингосстрах предлагает страхование велосипедов, самокатов и другого личного транспорта!",
      },
      {
        id: 2,
        question: "Что делать, если украли застрахованный велосипед?",
        options: [
          "Забыть о нём",
          "Написать в полицию и страховую",
          "Купить новый",
          "Ничего, это не страховой случай",
        ],
        correctAnswer: 1,
        explanation: "При краже нужно обратиться в полицию и страховую компанию. Ингосстрах компенсирует убытки!",
      },
    ],
  },
  {
    id: "property",
    title: "Имущество и жильё",
    icon: Home,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    description: "Защити квартиру, дом или комнату от пожара, затопления и других неприятностей",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    benefits: [
      "Защита от пожара и затопления",
      "Страхование ремонта",
      "Защита от взлома",
      "Страхование мебели и техники",
    ],
    questions: [
      {
        id: 1,
        question: "Соседи сверху затопили квартиру. Что покрывает страховка?",
        options: [
          "Только стены",
          "Ремонт, мебель и технику, которые пострадали",
          "Только моральный ущерб",
          "Ничего, это вина соседей",
        ],
        correctAnswer: 1,
        explanation: "Страховка покрывает ремонт, испорченную мебель и технику. А соседями займётся страховая!",
      },
      {
        id: 2,
        question: "Можно ли застраховать съёмную квартиру?",
        options: [
          "Нет, только собственную",
          "Да, можно застраховать своё имущество в съёмной квартире",
          "Только если хозяин разрешит",
          "Нет, это незаконно",
        ],
        correctAnswer: 1,
        explanation: "Ты можешь застраховать своё имущество в съёмной квартире: технику, одежду, мебель!",
      },
    ],
  },
  {
    id: "digital",
    title: "Цифровые активы",
    icon: Gamepad2,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    description: "Игровые аккаунты, криптовалюта, онлайн-покупки — современные риски требуют современной защиты",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    benefits: [
      "Защита от киберугроз",
      "Страхование онлайн-покупок",
      "Помощь при взломе аккаунтов",
      "Защита от интернет-мошенничества",
    ],
    questions: [
      {
        id: 1,
        question: "Как защитить игровой аккаунт помимо страховки?",
        options: [
          "Использовать простой пароль",
          "Включить двухфакторную аутентификацию",
          "Делиться паролем с друзьями",
          "Не менять пароль никогда",
        ],
        correctAnswer: 1,
        explanation: "Двухфакторная аутентификация — лучшая защита! А страховка поможет, если что-то пойдёт не так.",
      },
      {
        id: 2,
        question: "Что делать, если стал жертвой интернет-мошенничества?",
        options: [
          "Промолчать",
          "Обратиться в банк, полицию и страховую",
          "Удалить все аккаунты",
          "Заплатить мошенникам",
        ],
        correctAnswer: 1,
        explanation: "Сразу обращайся в банк, полицию и страховую! Многие случаи мошенничества можно компенсировать.",
      },
    ],
  },
];

export function CategoriesSection({ onComplete, onBack }: CategoriesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"grid" | "detail" | "quiz">("grid");

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setMode("detail");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleStartQuiz = () => {
    setMode("quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (selectedCategory && currentQuestionIndex < selectedCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (selectedCategory) {
      setCompletedCategories((prev) => new Set([...prev, selectedCategory.id]));
      setMode("grid");
      setSelectedCategory(null);
    }
  };

  const handleBackToGrid = () => {
    setMode("grid");
    setSelectedCategory(null);
  };

  const minCategoriesRequired = 2;
  const canProceed = completedCategories.size >= minCategoriesRequired;

// Grid view
  if (mode === "grid") {
    return (
      <section className="min-h-screen bg-muted pb-16">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Главная</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-foreground transition-colors">Умный гайд</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Категории страхования</span>
          </nav>
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Категории страхования
            </h1>
            <p className="text-muted-foreground text-lg">
              Изучи разные виды страхования и пройди мини-тест по каждой категории
            </p>
          </div>

          {/* Progress */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="text-sm text-muted-foreground">
              Пройдено: {completedCategories.size} из {categories.length}
            </div>
            <div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(completedCategories.size / categories.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isCompleted = completedCategories.has(category.id);

              return (
                <Card
                  key={category.id}
                  className={cn(
                    "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                    isCompleted && "ring-2 ring-success"
                  )}
                  onClick={() => handleSelectCategory(category)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {isCompleted && (
                      <div className="absolute top-3 right-3 bg-success text-success-foreground rounded-full p-1">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    <div className={cn("absolute bottom-3 left-3 p-2 rounded-xl", category.bgColor)}>
                      <Icon className={cn("w-6 h-6", category.color)} />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card rounded-2xl p-6 border border-border">
            <Button variant="outline" onClick={onBack} className="rounded-full h-10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              К основам
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              {canProceed 
                ? `Отлично! Пройдено ${completedCategories.size} категорий` 
                : `Пройди минимум ${minCategoriesRequired} категории, чтобы продолжить`
              }
            </p>

            <Button
              size="lg"
              onClick={onComplete}
              disabled={!canProceed}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 disabled:opacity-50"
            >
              К страховым случаям
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Detail view
  if (mode === "detail" && selectedCategory) {
    const Icon = selectedCategory.icon;

    return (
      <section className="min-h-screen flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={handleBackToGrid} 
            className="mb-6 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Все категории
          </Button>

          {/* Hero Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 animate-in fade-in zoom-in-95 duration-500">
            <Image
              src={selectedCategory.imageUrl}
              alt={selectedCategory.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3", selectedCategory.bgColor)}>
                <Icon className={cn("w-4 h-4", selectedCategory.color)} />
                <span className={cn("text-sm font-medium", selectedCategory.color)}>
                  {selectedCategory.title}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {selectedCategory.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardContent className="p-6">
              <p className="text-lg text-foreground leading-relaxed">
                {selectedCategory.description}
              </p>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Что покрывает страховка:
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedCategory.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Quiz CTA */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="rounded-full px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              Пройти мини-тест
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              {selectedCategory.questions.length} вопросов
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Quiz view
  if (mode === "quiz" && selectedCategory) {
    const question = selectedCategory.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === selectedCategory.questions.length - 1;

    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={handleBackToGrid} className="rounded-full" size="sm">
              <XCircle className="w-4 h-4 mr-1" />
              Выйти
            </Button>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / selectedCategory.questions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1}/{selectedCategory.questions.length}
            </span>
          </div>

          {/* Question Card */}
          <Card className="shadow-xl animate-in fade-in zoom-in-95 duration-500">
            <CardContent className="p-8">
              {/* Category badge */}
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6", selectedCategory.bgColor)}>
                {(() => {
                  const Icon = selectedCategory.icon;
                  return <Icon className={cn("w-4 h-4", selectedCategory.color)} />;
                })()}
                <span className={cn("text-sm font-medium", selectedCategory.color)}>
                  {selectedCategory.title}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showExplanation && handleAnswer(index)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300",
                      showExplanation
                        ? index === question.correctAnswer
                          ? "bg-success/20 border-2 border-success"
                          : index === selectedAnswer
                          ? "bg-destructive/20 border-2 border-destructive"
                          : "bg-muted/50 border border-border"
                        : "bg-card border border-border hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{option}</span>
                      {showExplanation && index === question.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                      {showExplanation &&
                        index === selectedAnswer &&
                        index !== question.correctAnswer && (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-primary/10 rounded-xl p-4 border-l-4 border-primary mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-foreground">{question.explanation}</p>
                </div>
              )}

              {/* Next button */}
              {showExplanation && (
                <Button
                  onClick={handleNextQuestion}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  {isLastQuestion ? "Завершить" : "Следующий вопрос"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return null;
}
