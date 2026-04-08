"use client";

export function IngosFooter() {
  return (
    <footer className="bg-[#f6f6f6] border-t border-[#e3e6ed]">
      <div className="container mx-auto px-4 lg:px-6 py-10 lg:py-12">
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <a href="https://www.ingos.ru" target="_blank" rel="noopener noreferrer" className="text-lg font-bold tracking-[0.12em] text-[#0d0d0e]">
              ИНГОССТРАХ
            </a>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6c7080]">
              <a href="https://www.ingos.ru/company" target="_blank" rel="noopener noreferrer" className="hover:text-[#0d0d0e] transition-colors">
                О компании
              </a>
              <a href="https://www.ingos.ru/company/contacts" target="_blank" rel="noopener noreferrer" className="hover:text-[#0d0d0e] transition-colors">
                Контакты
              </a>
              <a href="https://www.ingos.ru/offices" target="_blank" rel="noopener noreferrer" className="hover:text-[#0d0d0e] transition-colors">
                Офисы
              </a>
              <a href="tel:88002000300" className="hover:text-[#0d0d0e] transition-colors">
                8 800 200-03-00
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SocialLink href="https://vk.com/ingos9565555" label="Вконтакте" iconSrc="https://cdn.ingos.ru/icons/ingos__vk-logo.svg" />
            <SocialLink href="https://ok.ru/group/52461394526409" label="Одноклассники" iconSrc="https://cdn.ingos.ru/icons/ingos__ok-logo.svg" />
            <SocialLink href="https://max.ru/ingos_bot" label="MAX" iconSrc="https://cdn.ingos.ru/icons/ingos__max-logo.svg" />
            <SocialLink href="https://www.dzen.ru/ingos" label="Дзен" iconSrc="https://cdn.ingos.ru/icons/ingos__dzen-logo.svg" />
            <SocialLink href="https://t.me/ingosofficial" label="Telegram" iconSrc="https://cdn.ingos.ru/icons/ingos__telegram-logo.svg" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FooterGroup
              title="Компания"
              links={[
                ["О компании", "https://www.ingos.ru/company"],
                ["Карьера в Ингосстрахе", "https://www.ingos.ru/career"],
                ["Новости компании", "https://www.ingos.ru/company/news"],
                ["Раскрытие информации", "https://www.ingos.ru/company/disclosure-info"],
                ["Карта сайта", "https://www.ingos.ru/map"],
                ["FAQ", "https://www.ingos.ru/faq"],
              ]}
            />
            <FooterGroup
              title="Дополнительно"
              links={[
                ["Корпоративным клиентам", "https://www.ingos.ru/corporate"],
                ["Оставить обращение", "https://www.ingos.ru/feedback"],
                ["Партнерам", "https://www.ingos.ru/partners"],
                ["Агентам", "https://www.ingos.ru/partners/agents"],
                ["Офисы", "https://www.ingos.ru/offices"],
                ["Обработка персональных данных", "https://www.ingos.ru/personal-data-processing"],
              ]}
            />
          </div>

          <div className="pt-6 border-t border-[#d2d2d2] text-xs text-[#6c7080] space-y-3 leading-relaxed">
            <p>
              СПАО «Ингосстрах»{" "}
              <a
                href="https://www.ingos.ru/docs/politika-cookie.pdf"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0d0d0e] transition-colors underline underline-offset-2"
              >
                использует файлы cookie
              </a>{" "}
              с целью персонализации сервисов и повышения удобства пользования веб-сайтом. Если вы не хотите использовать
              файлы cookie, измените настройки браузера. Порядок обработки Ваших персональных данных и меры по их защите
              описаны в{" "}
              <a
                href="https://www.ingos.ru/api/user/v1/consent/XPACKDOC_CONSENTPROCPD_PD_POL"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0d0d0e] transition-colors underline underline-offset-2"
              >
                Политике СПАО «Ингосстрах»
              </a>
              .
              <br />
              <a
                href="https://www.ingos.ru/company/disclosure-info/licenses"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0d0d0e] transition-colors underline underline-offset-2"
              >
                Лицензии ЦБ РФ на осуществление страхования
              </a>
              : СИ №0928, СЛ №0928, ОС №0928-03, ОС №0928-04, ОС №0928-05 и на осуществление перестрахования ПС №0928,
              выданные 23.09.2015 и ОС №0928-02 от 29.03.2021, все лицензии без ограничения срока действия.
            </p>
            <p>
              © 2026 СПАО «Ингосстрах». По вопросам сопровождения сайта обращайтесь{" "}
              <a href="mailto:www@ingos.ru" className="hover:text-[#0d0d0e] transition-colors">
                www@ingos.ru
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, iconSrc }: { href: string; label: string; iconSrc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
      className="h-10 w-10 rounded-xl border border-[#e3e6ed] bg-white hover:bg-[#f0f4fd] flex items-center justify-center transition-colors"
    >
      <img src={iconSrc} alt={label} className="h-5 w-5" loading="lazy" />
    </a>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="text-sm font-semibold mb-3 text-[#0d0d0e]">{title}</div>
      <div className="grid gap-2 text-sm text-[#6c7080]">
        {links.map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[#0d0d0e] transition-colors">
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
