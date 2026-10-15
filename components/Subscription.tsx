import styles from "./Subscription.module.css";

const CARDS = [
  {
    title: "54 рубля в месяц",
    text: "Две пачки по 250 гр, доставка по Минску уже включена.",
  },
  {
    title: "Свежая обжарка",
    text: "Зерно у вас на 1–3 день после обжарки.",
  },
  {
    title: "Бесплатная доставка",
    text: "По Минску, каждый месяц, без доплат.",
  },
  {
    title: "Без обязательств",
    text: "Пауза или замена пары - просто позвоните.",
  },
] as const;

export default function Subscription() {
  return (
    <section
      id="podpiska"
      className={styles.subscription}
      aria-labelledby="subscription-title"
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="subscription-title" className={styles.title}>
            Наша мини программа лояльности
          </h2>
          <p className={styles.intro}>
            Получайте каждый месяц по 2 позиции из каталога
          </p>
        </div>

        <ul className={styles.cards} role="list">
          {CARDS.map((card) => (
            <li key={card.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </li>
          ))}
        </ul>

        <div className={styles.action}>
          <a className={styles.button} href="#zayavka">
            Оформить подписку
          </a>
          <p className={styles.note}>
            Лучшее решение для занятых людей
          </p>
        </div>
      </div>
    </section>
  );
}