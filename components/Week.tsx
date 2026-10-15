import styles from "./Week.module.css";

const DAYS = [
  {
    day: "Четверг",
    text: "Обжариваем около 5 кг на барабанном ростере",
  },
  {
    day: "Пятница",
    text: "Развозим заказы по Минску",
  },
  {
    day: "В любой день",
    text: "Навестите нашу мастерскую и заберите свое свежайшее зерно",
  },
] as const;

export default function Week() {
  return (
    <section className={styles.week} aria-labelledby="week-title">
      <div className={styles.inner}>
        <h2 id="week-title" className={styles.title}>
          Как мы работаем
        </h2>

        <ol className={styles.days}>
          {DAYS.map((item) => (
            <li key={item.day} className={styles.day}>
              <h3 className={styles.dayName}>{item.day}</h3>
              <p className={styles.dayText}>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}