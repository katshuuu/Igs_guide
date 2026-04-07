"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Search, MapPin, Building2, User, Phone, Zap, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const policyGroups = [
  {
    title: "Авто",
    items: ["ОСАГО", "ОСГОП такси", "Каско", "Мини-каско", "Защита от ДТП по чужой вине", "Каско на автомобиль в кредите"],
  },
  {
    title: "Путешествия",
    items: ["Выезд за границу", "Поездки по России", "Отмена поездки (невыезд)", "Калькулятор ВЗР"],
  },
  {
    title: "Имущество",
    items: ["Страхование квартиры", "Страхование дома", "Ответственность перед соседями", "Страхование питомцев"],
  },
  {
    title: "Здоровье и жизнь",
    items: ["ДМС", "Страхование спортсменов", "Страхование детей", "Телемедицина", "Онкострахование"],
  },
];

const quickServices = ["Продлить", "Оплатить", "Активировать", "Проверить"];

export function IngosHeader() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar - White/Dark background */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-[52px]">
            {/* Logo */}
            <a href="https://www.ingos.ru" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <span className="text-[22px] font-bold tracking-[0.12em] text-foreground">
                ИНГОССТРАХ
              </span>
            </a>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center gap-5">
              {/* Russian flag + language */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-[22px] h-[15px] rounded-[2px] overflow-hidden flex flex-col border border-border">
                  <div className="flex-1 bg-white"></div>
                  <div className="flex-1 bg-[#0039A6]"></div>
                  <div className="flex-1 bg-[#D52B1E]"></div>
                </div>
                <span>Русский</span>
              </div>
              
              <a href="#" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Москва</span>
              </a>
              
              <a href="#" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Building2 className="w-4 h-4" />
                <span>Офисы</span>
              </a>
              
              <a href="#" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-4 h-4" />
                <span>Персональный менеджер</span>
              </a>
              
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Search className="w-4 h-4" />
                <span>Поиск</span>
              </button>

              {/* Theme Toggle - like on original site */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-[52px] h-[28px] bg-muted rounded-full p-[2px] transition-colors"
                aria-label="Переключить тему"
              >
                <div
                  className={`absolute top-[2px] w-[24px] h-[24px] rounded-full bg-card shadow-sm flex items-center justify-center transition-transform duration-200 ${
                    theme === "dark" ? "translate-x-[24px]" : "translate-x-[2px]"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Gray background like original */}
      <div className="hidden lg:block bg-muted border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-[56px]">
            {/* Main Nav */}
            <nav className="flex items-center">
              {/* Частным лицам with dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">
                  Частным лицам
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute top-full left-0 w-[1100px] bg-card border border-border rounded-2xl shadow-xl p-8 mt-0 z-50">
                    <div className="flex items-center gap-3 pb-5 border-b border-border">
                      {quickServices.map((service) => (
                        <a key={service} href="https://www.ingos.ru/services/pay" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {service}
                        </a>
                      ))}
                      <a href="https://www.ingos.ru/ishop" className="ml-auto text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                        Все продукты
                      </a>
                    </div>
                    <div className="grid grid-cols-4 gap-8 pt-6">
                      {policyGroups.map((group) => (
                        <MenuColumn key={group.title} title={group.title} items={group.items} />
                      ))}
                    </div>
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                      <a href="https://www.ingos.ru/incident/osago" className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                        <Zap className="w-4 h-4" />
                        Страховой случай
                      </a>
                      <a href="https://www.ingos.ru/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Вопросы и ответы
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <NavLink href="https://www.ingos.ru/corporate">Бизнесу</NavLink>
              <NavLink href="https://www.ingos.ru/partners">Агентам и партнерам</NavLink>
              <NavLink href="https://www.ingos.ru/vip">ВИП</NavLink>
              <NavLink href="https://ingo.ru/">Инго Экосистема</NavLink>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-5">
              {/* Contacts dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowContacts(true)}
                onMouseLeave={() => setShowContacts(false)}
              >
                <button className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors py-2">
                  <Phone className="w-4 h-4" />
                  <span>Контакты</span>
                </button>
                
                {showContacts && (
                  <ContactsPanel />
                )}
              </div>
              
              <a href="https://www.ingos.ru/incident/osago" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors font-medium">
                <Zap className="w-4 h-4" />
                <span>Страховой случай</span>
              </a>
              
              <Button 
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 gap-1 text-sm font-medium"
              >
                Войти
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 py-4 space-y-4">
            {/* Theme Toggle Mobile */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-foreground">Тема оформления</span>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-[52px] h-[28px] bg-muted rounded-full p-[2px] transition-colors"
              >
                <div
                  className={`absolute top-[2px] w-[24px] h-[24px] rounded-full bg-card shadow-sm flex items-center justify-center transition-transform duration-200 ${
                    theme === "dark" ? "translate-x-[24px]" : "translate-x-[2px]"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
              </button>
            </div>
            
            <div className="border-t border-border pt-4 space-y-1">
              <MobileNavLink href="https://www.ingos.ru/" active>Частным лицам</MobileNavLink>
              <MobileNavLink href="https://www.ingos.ru/corporate">Бизнесу</MobileNavLink>
              <MobileNavLink href="https://www.ingos.ru/partners">Агентам и партнерам</MobileNavLink>
              <MobileNavLink href="https://www.ingos.ru/vip">ВИП</MobileNavLink>
              <MobileNavLink href="https://ingo.ru/">Инго Экосистема</MobileNavLink>
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">Горячая линия</div>
                <a href="tel:88002000300" className="text-lg font-bold text-primary">
                  8 800 200-03-00
                </a>
              </div>
              <MobileNavLink href="https://www.ingos.ru/incident/osago" className="text-accent">
                <Zap className="w-4 h-4" />
                Страховой случай
              </MobileNavLink>
            </div>
            
            <Button className="w-full rounded-full bg-primary text-primary-foreground h-12 text-base">
              Войти
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
}

function MenuColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-primary mb-4 text-base">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactsPanel() {
  return (
    <div className="absolute top-full right-0 mt-0 w-[400px] bg-card border border-border rounded-2xl shadow-xl p-6 z-50">
      <div className="space-y-5">
        {/* Main phone */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Горячая линия</div>
          <a 
            href="tel:88002000300" 
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            8 800 200-03-00
          </a>
          <div className="text-xs text-muted-foreground mt-1">Бесплатно по России, круглосуточно</div>
        </div>
        
        <div className="h-px bg-border"></div>
        
        {/* Contact grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Для Москвы</div>
            <a href="tel:+74959560022" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              +7 (495) 956-00-22
            </a>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Страховой случай</div>
            <a href="tel:88002000900" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              8 800 200-09-00
            </a>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Для юридических лиц</div>
            <a href="tel:+74959252001" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              +7 (495) 925-20-01
            </a>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Поддержка клиентов</div>
            <a href="mailto:info@ingos.ru" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              info@ingos.ru
            </a>
          </div>
        </div>
        
        <div className="h-px bg-border"></div>
        
        {/* Links */}
        <div className="flex items-center justify-between">
          <a 
            href="https://www.ingos.ru/company/contacts" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Все контакты
          </a>
          <a 
            href="https://www.ingos.ru/company/offices" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Найти офис
          </a>
        </div>
      </div>
    </div>
  );
}

function MobileNavLink({
  href,
  children,
  className = "",
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 py-3 text-base transition-colors ${active ? "text-primary font-medium" : "text-foreground hover:text-primary"} ${className}`}
    >
      {children}
    </a>
  );
}
