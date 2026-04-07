"use client";

import { Button } from "@/components/ui/button";
import {
  Shield,
  Award,
  Users,
  Building2,
  Globe,
  CheckCircle2,
  ChevronRight,
  Star,
  Clock,
  Smartphone,
} from "lucide-react";

interface AboutIngosstrakhProps {
  onContinue: () => void;
}

const stats = [
  { icon: Building2, value: "1947", label: "Год основания" },
  { icon: Users, value: "75+", label: "Лет на рынке" },
  { icon: Globe, value: "400+", label: "Офисов" },
  { icon: Star, value: "ТОП-3", label: "В России" },
];

const advantages = [
  {
    icon: Shield,
    title: "Надёжность",
    description: "Одна из крупнейших страховых компаний России с безупречной репутацией",
  },
  {
    icon: Clock,
    title: "Быстрые выплаты",
    description: "Страховые выплаты производятся быстро и без лишней бюрократии",
  },
  {
    icon: Smartphone,
    title: "Удобное приложение",
    description: "Мобильное приложение для оформления полисов и подачи заявок",
  },
  {
    icon: Users,
    title: "Поддержка 24/7",
    description: "Круглосуточная служба поддержки всегда готова помочь",
  },
];

export function AboutIngosstrakh({ onContinue }: AboutIngosstrakhProps) {
  return (
    <section className="min-h-screen bg-muted pb-16">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Главная</a>
          <ChevronRight className="w-4 h-4" />
          <a href="#" className="hover:text-foreground transition-colors">Умный гайд</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">О компании</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            О компании Ингосстрах
          </h1>
          <p className="text-muted-foreground text-lg">
            Узнай больше о надёжном партнёре в сфере страхования
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <stat.icon className="w-8 h-8 text-primary mb-4" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Left - Brand card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-8 border border-border h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <span className="text-primary-foreground text-4xl font-bold">И</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">ИНГОССТРАХ</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Страховая компания №1 в России
              </p>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Advantages */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Почему выбирают Ингосстрах
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <advantage.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{advantage.title}</h4>
                      <p className="text-sm text-muted-foreground">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Teen-friendly CTA card */}
        <div className="bg-card rounded-2xl p-8 border border-border mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Страхование — это просто!
              </h3>
              <p className="text-muted-foreground">
                Ингосстрах делает страхование понятным даже для тех, кто только начинает разбираться в финансах. 
                Защити свой смартфон, путешествия и спортивные увлечения.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Гаджеты", "Путешествия", "Спорт", "Транспорт"].map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-2xl p-6 border border-border">
          <p className="text-muted-foreground">
            Готов узнать основы страхования?
          </p>
          <Button
            size="lg"
            onClick={onContinue}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-medium"
          >
            Продолжить обучение
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
