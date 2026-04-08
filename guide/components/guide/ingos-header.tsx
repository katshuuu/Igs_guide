"use client";

import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

export function IngosHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-white border-b border-[#e3e6ed]">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="h-[52px] flex items-center justify-between">
            <a
              href="https://www.ingos.ru"
              target="_blank"
              rel="noreferrer"
              className="text-[22px] leading-none font-bold tracking-[0.12em] text-[#0d0d0e]"
            >
              ИНГОССТРАХ
            </a>

            <div className="hidden lg:flex items-center gap-6 text-[14px] text-[#6c7080]">
              <button className="flex items-center gap-2 hover:text-[#0d0d0e] transition-colors">
                <img src="https://cdn.ingos.ru/icons/lang/ru.svg" alt="Русский" className="w-[22px] h-[15px]" />
                Русский
              </button>
              <a href="https://www.ingos.ru/offices" className="hover:text-[#0d0d0e] transition-colors">
                Офисы
              </a>
              <a href="https://www.ingos.ru/company/contacts" className="hover:text-[#0d0d0e] transition-colors">
                Контакты
              </a>
              <a href="https://www.ingos.ru/search" className="hover:text-[#0d0d0e] transition-colors">
                Поиск
              </a>
            </div>

            <button
              className="lg:hidden p-2 -mr-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Открыть меню"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-[#f6f6f6] border-b border-[#e3e6ed]">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="h-[56px] flex items-center justify-between">
            <nav className="flex items-center gap-1">
              <a
                href="https://www.ingos.ru"
                className="h-[56px] px-4 inline-flex items-center text-[14px] font-medium text-[#004de5] border-b-2 border-[#004de5]"
              >
                Частным лицам
                <ChevronDown className="ml-1 w-4 h-4" />
              </a>
              <HeaderLink href="https://www.ingos.ru/corporate">Бизнесу</HeaderLink>
              <HeaderLink href="https://www.ingos.ru/partners">Агентам и партнерам</HeaderLink>
              <HeaderLink href="https://www.ingos.ru/vip">ВИП</HeaderLink>
              <HeaderLink href="https://ingo.ru">Инго Экосистема</HeaderLink>
            </nav>

            <div className="flex items-center gap-5">
              <a href="https://www.ingos.ru/company/contacts" className="text-[14px] text-[#0d0d0e] hover:text-[#004de5] transition-colors">
                Контакты
              </a>
              <a href="https://www.ingos.ru/incident" className="text-[14px] text-[#ff3b30] hover:text-[#e13228] transition-colors">
                Страховой случай
              </a>
              <a
                href="https://sso.ingos.ru"
                className="h-10 px-5 rounded-full bg-[#004de5] hover:bg-[#003cb2] text-white inline-flex items-center text-[14px] font-medium transition-colors"
              >
                Войти
                <ChevronRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#e3e6ed]">
          <div className="px-4 py-4 space-y-2">
            <MobileItem href="https://www.ingos.ru">Частным лицам</MobileItem>
            <MobileItem href="https://www.ingos.ru/corporate">Бизнесу</MobileItem>
            <MobileItem href="https://www.ingos.ru/partners">Агентам и партнерам</MobileItem>
            <MobileItem href="https://www.ingos.ru/vip">ВИП</MobileItem>
            <MobileItem href="https://ingo.ru">Инго Экосистема</MobileItem>
            <MobileItem href="https://www.ingos.ru/incident">Страховой случай</MobileItem>
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="h-[56px] px-4 inline-flex items-center text-[14px] text-[#6c7080] hover:text-[#0d0d0e] transition-colors">
      {children}
    </a>
  );
}

function MobileItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="block py-3 text-[16px] text-[#0d0d0e]">
      {children}
    </a>
  );
}
