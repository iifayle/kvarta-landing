import styles from "./Delivery.module.css";

const HOURS = [
  { days: "Пн–пт", time: "8:00–20:00" },
  { days: "Сб–вс", time: "10:00–18:00" },
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
          Как получить заказ
        </h2>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.subtitle}>Доставка по Минску</h3>
            <p className={styles.big}>По пятницам.</p>
            <p className={styles.big}>От 50 BYN — бесплатно.</p>
            <p className={styles.small}>
              Если заказ меньше 50 BYN — скажем стоимость доставки по телефону,
              без сюрпризов в заявке.
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