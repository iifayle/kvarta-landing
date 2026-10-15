import styles from "./Delivery.module.css";
import BynIcon from "./BynIcon";
const HOURS = [
  { days: "Пн–пт", time: "8:00-20:00" },
  { days: "Сб–вс", time: "10:00-18:00" },
] as const;

export default function Delivery() {
  return (
    <section
      id="dostavka"
      className={styles.delivery}
      aria-labelledby="delivery-title"
    >
      <div className={styles.inner}>
        <h2 id="delivery-title" className={styles.title}>
          Доставка и самовывоз
        </h2>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.subtitle}>Доставка по Минску</h3>
            <p className={styles.big}>Пятница</p>
            <p className={styles.small}>
              Бесплатная доставка от 50 <BynIcon className={styles.bynIcon}/>, иначе 15 <BynIcon className={styles.bynIcon}/>.
            </p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.subtitle}>Самовывоз</h3>
            <address className={`${styles.big} ${styles.address}`}>
              Минск, ул. Короля, 9
            </address>
            <dl className={styles.hours}>
              {HOURS.map((row) => (
                <div key={row.days} className={styles.hoursRow}>
                  <dt className={styles.hoursDays}>{row.days}</dt>
                  <dd className={styles.hoursTime}>{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

      </div>
    </section>
  );
}