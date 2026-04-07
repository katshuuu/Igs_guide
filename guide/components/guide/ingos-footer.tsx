"use client";

export function IngosFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <a href="https://www.ingos.ru" target="_blank" rel="noopener noreferrer" className="text-lg font-bold tracking-[0.12em]">
              ИНГОССТРАХ
            </a>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <a href="https://www.ingos.ru/company" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                О компании
              </a>
              <a href="https://www.ingos.ru/company/contacts" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Контакты
              </a>
              <a href="https://www.ingos.ru/offices" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Офисы
              </a>
              <a href="tel:88002000300" className="hover:text-foreground transition-colors">
                8 800 200-03-00
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <a href="https://vk.com/ingos9565555" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              VK
            </a>
            <a href="https://ok.ru/group/52461394526409" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              OK
            </a>
            <a href="https://max.ru/ingos_bot" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              MAX
            </a>
            <a href="https://www.dzen.ru/ingos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Дзен
            </a>
            <a href="https://t.me/ingosofficial" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Telegram
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-2">
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

          <div className="pt-6 border-t border-border text-xs text-muted-foreground space-y-3 leading-relaxed">
            <p>
              СПАО «Ингосстрах»{" "}
              <a
                href="https://www.ingos.ru/docs/politika-cookie.pdf"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
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
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                Политике СПАО «Ингосстрах»
              </a>
              .
              <br />
              <a
                href="https://www.ingos.ru/company/disclosure-info/licenses"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                Лицензии ЦБ РФ на осуществление страхования
              </a>
              : СИ №0928, СЛ №0928, ОС №0928-03, ОС №0928-04, ОС №0928-05 и на осуществление перестрахования ПС №0928,
              выданные 23.09.2015 и ОС №0928-02 от 29.03.2021, все лицензии без ограничения срока действия.
            </p>
            <p>
              © 2026 СПАО «Ингосстрах». По вопросам сопровождения сайта обращайтесь{" "}
              <a href="mailto:www@ingos.ru" className="hover:text-foreground transition-colors">
                www@ingos.ru
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
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
      <div className="text-sm font-semibold mb-3">{title}</div>
      <div className="grid gap-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
