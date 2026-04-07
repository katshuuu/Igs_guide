"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Shield,
  Plane,
  Home,
  Key,
  Heart,
  Stethoscope,
  Bug,
  AlertTriangle,
  Bus,
  ChevronRight,
  FileText,
  Smartphone,
  Gamepad2,
  GraduationCap,
  Bike,
} from "lucide-react";

interface InsuranceCasesSectionProps {
  onComplete: () => void;
}

// Main insurance cases (OSAGO and KASKO)
const mainCases = [
  {
    id: "osago",
    title: "ОСАГО",
    description: "Ремонт ТС потерпевшей стороны в случае ДТП по вине застрахованного",
    simpleDescription: "Если ты случайно повредил чужую машину - страховка оплатит ремонт пострадавшему",
    icon: Car,
    color: "bg-blue-500",
    hasOnlineForm: true,
    image: "car-blue",
  },
  {
    id: "kasko",
    title: "КАСКО",
    description: "Ремонт вашего автомобиля или компенсация его стоимости",
    simpleDescription: "Если твою машину поцарапали, угнали или она пострадала в ДТП - страховка покроет ремонт",
    icon: Shield,
    color: "bg-amber-500",
    hasOnlineForm: true,
    image: "car-yellow",
  },
];

// Other insurance cases
const otherCases = [
  {
    id: "travel",
    title: "Путешествие",
    description: "Медпомощь, компенсация стоимости тура или багажа",
    simpleDescription: "Заболел в отпуске или потеряли чемодан? Страховка оплатит лечение и возместит потери",
    icon: Plane,
    color: "bg-teal-500",
    hasOnlineForm: true,
  },
  {
    id: "property",
    title: "Имущество",
    description: "Пожар, затопление и иной ущерб квартире или дому",
    simpleDescription: "Соседи затопили или случился пожар - страховка поможет восстановить жильё",
    icon: Home,
    color: "bg-indigo-500",
    hasOnlineForm: true,
  },
  {
    id: "mortgage",
    title: "Ипотека",
    description: "Действия при ущербе имуществу и жизни или потере права собственности",
    simpleDescription: "Защита квартиры и твоей жизни при ипотечном кредите",
    icon: Key,
    color: "bg-orange-500",
    hasOnlineForm: true,
  },
  {
    id: "health",
    title: "Здоровье и жизнь",
    description: "Выплата на лечение или реабилитацию застрахованного",
    simpleDescription: "Получил травму или заболел - страховка оплатит лечение и восстановление",
    icon: Heart,
    color: "bg-rose-500",
    hasOnlineForm: true,
  },
  {
    id: "dms",
    title: "ДМС",
    description: "Консультация, приём у врача и другие медицинские услуги",
    simpleDescription: "Добровольное медицинское страхование - лечись в хороших клиниках без очередей",
    icon: Stethoscope,
    color: "bg-cyan-500",
    hasOnlineForm: false,
  },
  {
    id: "tick",
    title: "Укус клеща",
    description: "Расходы на удаление, проверку клеща и препараты",
    simpleDescription: "Укусил клещ в походе? Страховка покроет удаление, анализы и лекарства",
    icon: Bug,
    color: "bg-lime-600",
    hasOnlineForm: false,
  },
  {
    id: "hazard",
    title: "Авария на опасном объекте",
    description: "Компенсация ущерба потерпевшим",
    simpleDescription: "Если пострадал от аварии на заводе или другом опасном объекте",
    icon: AlertTriangle,
    color: "bg-red-500",
    hasOnlineForm: false,
  },
  {
    id: "transport",
    title: "Событие в общественном транспорте",
    description: "Ущерб жизни, здоровью или имуществу пассажиров",
    simpleDescription: "Пострадал в автобусе или метро - страховка компенсирует ущерб",
    icon: Bus,
    color: "bg-violet-500",
    hasOnlineForm: false,
  },
];

// Youth-specific cases
const youthCases = [
  {
    id: "gadget",
    title: "Гаджеты и техника",
    description: "Защита смартфона, ноутбука и другой техники",
    simpleDescription: "Разбил телефон или залил ноутбук? Страховка покроет ремонт или замену",
    icon: Smartphone,
    color: "bg-primary",
    hasOnlineForm: true,
  },
  {
    id: "gaming",
    title: "Игровые аккаунты",
    description: "Защита от взлома и кражи игровых аккаунтов",
    simpleDescription: "Взломали аккаунт в Steam или PlayStation? Страховка поможет восстановить потери",
    icon: Gamepad2,
    color: "bg-purple-500",
    hasOnlineForm: false,
  },
  {
    id: "sports",
    title: "Спорт и активный отдых",
    description: "Страхование от травм при занятиях спортом",
    simpleDescription: "Катаешься на скейте или занимаешься единоборствами? Защити себя от травм",
    icon: Bike,
    color: "bg-green-500",
    hasOnlineForm: true,
  },
  {
    id: "student",
    title: "Страхование студентов",
    description: "Комплексная защита для учащихся",
    simpleDescription: "Несчастный случай в школе или университете - страховка поможет",
    icon: GraduationCap,
    color: "bg-amber-600",
    hasOnlineForm: false,
  },
];

type TabType = "clients" | "youth";

export function InsuranceCasesSection({ onComplete }: InsuranceCasesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("youth");
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCase(expandedCase === id ? null : id);
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
          <span className="text-foreground">Страховые случаи</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Страховой случай
            </h1>
            <p className="text-muted-foreground text-lg">
              Узнай, что делать, если произошёл страховой случай
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setActiveTab("youth")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "youth"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Для молодёжи
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "clients"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Все случаи
            </button>
          </div>
        </div>

        {activeTab === "youth" ? (
          <>
            {/* Youth Cases */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Актуально для тебя
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {youthCases.map((item) => (
                  <Card
                    key={item.id}
                    className={`group cursor-pointer transition-all hover:shadow-lg border-2 ${
                      expandedCase === item.id ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => toggleExpand(item.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        {item.hasOnlineForm && (
                          <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full whitespace-nowrap">
                            Онлайн
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.simpleDescription}
                      </p>
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center ml-auto`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Что делать при страховом случае?
                    </h4>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <span>Сохраняй спокойствие и зафиксируй произошедшее (фото, видео)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <span>Позвони на горячую линию Ингосстрах: 8-800-100-77-55 (бесплатно)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <span>Подай заявление онлайн или в офисе в течение 30 дней</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">4.</span>
                        <span>Предоставь необходимые документы и получи выплату</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Main Cases (OSAGO & KASKO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {mainCases.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden bg-gradient-to-br from-card to-muted/30 border-2 hover:border-primary/30 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          {item.description}
                        </p>
                        <p className="text-foreground text-sm bg-primary/5 p-3 rounded-lg">
                          {item.simpleDescription}
                        </p>
                      </div>
                      {item.hasOnlineForm && (
                        <span className="text-xs px-3 py-1 bg-success/20 text-success rounded-full whitespace-nowrap">
                          Онлайн-заявление
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between mt-6">
                      <Button
                        variant="outline"
                        className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Заявить о происшествии
                      </Button>
                      <div className={`w-24 h-24 rounded-2xl ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Other Cases */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Другие виды страховых случаев
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherCases.map((item) => (
                  <Card
                    key={item.id}
                    className="group hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        {item.hasOnlineForm && (
                          <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full whitespace-nowrap">
                            Онлайн-заявление
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      {expandedCase === item.id && (
                        <p className="text-sm text-foreground bg-primary/5 p-3 rounded-lg mb-3 animate-in fade-in slide-in-from-top-2">
                          {item.simpleDescription}
                        </p>
                      )}
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center ml-auto`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Теперь ты знаешь, как действовать при страховом случае
          </p>
          <Button
            onClick={onComplete}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            К финальному тесту
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
