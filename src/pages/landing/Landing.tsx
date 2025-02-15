import { useState } from "react";
import "../../styles/LandingLayout.css";

// Импорт изображений из папки src/assets/imgLanding
import logo from "../../assets/imgLanding/logo.svg";
import screenshot from "../../assets/imgLanding/screenshot.png";

// Изображения для секции marketplaces
import ozon from "../../assets/imgLanding/marketplaces/ozon.svg";
import wildberries from "../../assets/imgLanding/marketplaces/wildberries.svg";
import yaMarket from "../../assets/imgLanding/marketplaces/ya_market.svg";
import megaMarket from "../../assets/imgLanding/marketplaces/mega_market.svg";
import lamoda from "../../assets/imgLanding/marketplaces/lamoda.svg";
import kazanexpress from "../../assets/imgLanding/marketplaces/kazanexpress.svg";
import aliexpress from "../../assets/imgLanding/marketplaces/aliexpress.svg";

// Изображения для секции composition
import pic1 from "../../assets/imgLanding/pic1.svg";
import pic2 from "../../assets/imgLanding/pic2.svg";
import pic3 from "../../assets/imgLanding/pic3.svg";
import pic4 from "../../assets/imgLanding/pic4.svg";
import pic5 from "../../assets/imgLanding/pic5.svg";
import pic6 from "../../assets/imgLanding/pic6.svg";

const Landing = () => {
  // Состояние для интерактивных табов секции "any-level"
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <div className="lines">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <header className="header">
        <div className="container">
          <div className="header__content">
            <img src={logo} alt="logo" />
          </div>
        </div>
      </header>

      <main className="main">
        <div className="main__content">
          {/* Секция Welcome */}
          <section className="welcome">
            <div className="container">
              <div className="content">
                <h2>
                  Повышаем эффективность вашего бизнеса на маркетплейсах
                </h2>
                <p>
                  <span className="highlighted">Добро пожаловать в будущее</span> управления продажами на маркетплейсах. Мы представляем вам мощный инструмент, который сделает управление вашим бизнесом на платформах электронной торговли{" "}
                  <span className="highlighted">эффективным</span> и{" "}
                  <span className="highlighted">легким</span>.
                </p>
                <a
                  href="/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Попробовать бесплатно
                </a>
                <div className="screenshot">
                  <svg
                    width="32"
                    height="8"
                    viewBox="0 0 32 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="4" cy="4" r="4" fill="#444444" />
                    <circle cx="16" cy="4" r="4" fill="white" />
                    <circle cx="28" cy="4" r="4" fill="#8FFF00" />
                  </svg>
                  <img src={screenshot} alt="screenshot" />
                </div>
              </div>
            </div>
          </section>

          {/* Секция Marketplaces */}
          <section className="marketplaces">
            <div className="container">
              <div className="content">
                <div className="item">
                  <img src={ozon} alt="ozon" />
                </div>
                <div className="item">
                  <img src={wildberries} alt="wildberries" />
                </div>
                <div className="item">
                  <img src={yaMarket} alt="ya_market" />
                </div>
                <div className="item">
                  <img src={megaMarket} alt="mega_market" />
                </div>
                <div className="item">
                  <img src={lamoda} alt="lamoda" />
                </div>
                <div className="item">
                  <img src={kazanexpress} alt="kazanexpress" />
                </div>
                <div className="item">
                  <img src={aliexpress} alt="aliexpress" />
                </div>
              </div>
            </div>
          </section>

          {/* Секция Advantages */}
          <section className="advantages">
            <div className="container">
              <div className="content">
                <h2>Наши преимущества</h2>
                <div className="cards">
                  <div className="card">
                    <h4>Легкий старт</h4>
                    <p>
                      Простая система авторизации и синхронизации ваших личных кабинетов на маркетплейсах
                    </p>
                  </div>
                  <div className="card">
                    <h4>Многоканальность</h4>
                    <p>
                      Управляйте продажами на нескольких маркетплейсах с одной платформы. Экономьте время и ресурсы.
                    </p>
                  </div>
                  <div className="card">
                    <h4>
                      Автоматизация<br />продаж
                    </h4>
                    <p>
                      Cократим рутинные задачи и поможем сосредоточиться на стратегическом росте вашего бизнеса.
                    </p>
                  </div>
                  <div className="card">
                    <h4>
                      Аналитика<br />в реальном времени
                    </h4>
                    <p>
                      Получайте актуальные данные и аналитику для принятия информированных решений и оптимизации вашей стратегии продаж.
                    </p>
                  </div>
                  <div className="card">
                    <h4>
                      Удобство<br />использования
                    </h4>
                    <p>
                      Сервис создан людьми, которые каждый день пользуются системами продаж на маркетплейсах и понимают как облегчить и улучшить этот опыт.
                    </p>
                  </div>
                  <div className="card">
                    <h4>
                      Поддержка<br />и обучение
                    </h4>
                    <p>
                      Предоставляем профессиональную поддержку и обучение работы в сервисе.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Секция Are-You-Ready */}
          <section className="are-you-ready">
            <div className="container">
              <div className="content">
                <h2>Готовы начать?</h2>
                <p>
                  <span className="highlighted">Повышайте эффективность</span>
                  <br />
                  вашего бизнеса на маркетплейсах.
                  <br />
                  Присоединяйтесь к нам прямо сейчас!
                </p>
                <a href="/auth" className="button">
                  Попробовать бесплатно
                </a>
              </div>
            </div>
          </section>

          {/* Секция Be-The-Best */}
          <section className="be-the-best">
            <div className="container">
              <div className="content">
                <h2>
                  <span className="highlighted">Снова</span> — быть лучшим
                </h2>
                <p>
                  Автоматизированная системы управления заказами, товарами и остатками поможет улучшить качество обслуживания клиентов. С нашим сервисом легко оптимизировать складские запасы, улучшить управление цепочками поставок и повысить эффективность работы сотрудников, предоставляя возможность сосредоточиться на стратегических задачах.
                </p>
              </div>
            </div>
          </section>

          {/* Секция Composition */}
          <section className="composition">
            <div className="container">
              <div className="content">
                <h2>Из чего состоит платформа</h2>
                <div className="cards">
                  <div className="card">
                    <div>
                      <img src={pic1} alt="pic" />
                      <h4>
                        Единый личный
                        <br />
                        кабинет
                      </h4>
                    </div>
                    <p>
                      управление всеми магазинами, различных маркетплейсов и любых форматов в едином окне (заказы, возвраты, брак, отзывы (автоответы), вопросы о товаре, поставки), управление рекламными компаниями внешними и внутренними.
                    </p>
                  </div>
                  <div className="card">
                    <div>
                      <img src={pic2} alt="pic" />
                      <h4>Дашборды</h4>
                    </div>
                    <p>
                      все ключевые показатели (кол-во заказов в деньгах, шт., остатки, оборачиваемость, комиссия площадок, маржинальность, товары категорий ABC, конкурентность цен) ваших магазинов, в одном месте.
                    </p>
                  </div>
                  <div className="card">
                    <div>
                      <img src={pic3} alt="pic" />
                      <h4>Aналитики</h4>
                    </div>
                    <p>
                      поиск прибыльной ниши и товаров, конкурентный анализ, внутренняя и внешняя аналитика, поиск трендов, анализ по размерам, складам и цветам.
                    </p>
                  </div>
                  <div className="card">
                    <div>
                      <img src={pic4} alt="pic" />
                      <h4>
                        Управление
                        <br />
                        товарами
                      </h4>
                    </div>
                    <p>
                      интеграция с любой системой учета, массовая загрузка и редактирование, улучшения карточек товаров (инфографика, описание, ключевые слова) на основе рекомендаций искусственного интеллекта.
                    </p>
                  </div>
                  <div className="card">
                    <div>
                      <img src={pic5} alt="pic" />
                      <h4>
                        Интеллектуальный
                        <br />
                        помощник
                      </h4>
                    </div>
                    <p>
                      искусственный интеллект рекомендующий делать улучшения карточек товаров, пополнение поставок, управления ценой, основанный на технологии GPT.
                    </p>
                  </div>
                  <div className="card">
                    <div>
                      <img src={pic6} alt="pic" />
                      <h4>
                        Обучение
                        <br />
                        и поддержка
                      </h4>
                    </div>
                    <p>
                      бесплатный обучающий курс, личный менеджер на старте, тех поддержка онлайн 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Секция Any-Level – интерактивные табы */}
          <section className="any-level">
            <div className="container">
              <div className="content">
                <h2>
                  <span className="highlighted">Снова</span> поможет
                  <br />
                  любому уровню бизнеса
                </h2>
                <div className="level-control">
                  <div className="selector" onClick={() => setActiveTab(1)}>
                    <span className={activeTab === 1 ? "selected" : ""}>1</span>
                    <p>Новичок</p>
                  </div>
                  <div className="selector" onClick={() => setActiveTab(2)}>
                    <span className={activeTab === 2 ? "selected" : ""}>2</span>
                    <p>Продвинутый</p>
                  </div>
                  <div className="selector" onClick={() => setActiveTab(3)}>
                    <span className={activeTab === 3 ? "selected" : ""}>3</span>
                    <p>Эксперт</p>
                  </div>
                </div>
                <div className="levels">
                  <div
                    className={`level level-1 ${activeTab === 1 ? "" : "hidden"}`}
                    data-num="1"
                  >
                    <div className="level-content">
                      <h3>Малый бизнес</h3>
                      <div className="cards">
                        <div className="card">
                          <p>
                            Легкий выход
                            <br />
                            на новые площадки
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Улучшение позиции
                            <br />
                            в выдаче товаров
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Аналитика
                            <br />
                            продаж
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Определение
                            <br />
                            вектора развития
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`level level-2 ${activeTab === 2 ? "" : "hidden"}`}
                    data-num="2"
                  >
                    <div className="level-content">
                      <h3>Средний бизнес</h3>
                      <div className="cards">
                        <div className="card">
                          <p>
                            Масштабирование
                            <br />
                            бизнеса
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Расширение
                            <br />
                            ассортимента
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Глубокий анализ
                            <br />
                            конкурентов
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Оптимизация
                            <br />
                            рекламных компаний
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`level level-3 ${activeTab === 3 ? "" : "hidden"}`}
                    data-num="3"
                  >
                    <div className="level-content">
                      <h3>Крупный бизнес</h3>
                      <div className="cards">
                        <div className="card">
                          <p>
                            Полная автоматизация
                            <br />
                            продаж
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Вся аналитика и
                            <br />
                            дашборды в одном окне
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Стать лидером рынке
                            <br />
                            в своей нише
                          </p>
                        </div>
                        <div className="card">
                          <p>
                            Сокращение
                            <br />
                            издержек
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Секция Learn-More */}
          <section className="learn-more">
            <div className="container">
              <div className="content">
                <h2>Интересно?</h2>
                <p>
                  Готовы узнать больше о том,
                  <br />
                  как наша система может улучшить бизнес?
                  <br />
                  Свяжитесь с нами для консультации
                </p>
                <a href="/auth" className="button">
                  Попробовать бесплатно
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="popup-wrapper">
        <div className="popup">
          <span className="heading">Как с вами связаться?</span>
          <form id="tg">
            <input type="email" name="email" placeholder="Почта" />
            <input type="tel" name="phone" placeholder="Телефон" />
            <input type="text" name="name" placeholder="Ваше имя" />
            <button type="submit">Попробовать бесплатно</button>
          </form>
          <div className="close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
            >
              <path d="M0.500001 1L16.5 17M16.5 1L0.5 17" stroke="black" />
            </svg>
          </div>
          <span className="success">Сообщение отправлено</span>
        </div>
      </div>
    </>
  );
};

export default Landing;
