import styles from "./Subscription.module.css";

export default function Subscription() {
  return (
    <section
      id="podpiska"
      className={styles.subscription}
      aria-labelledby="subscription-title"
    >
      <div className={styles.inner}>
        <h2 id="subscription-title" className={styles.title}>
          Подписка: две пачки в месяц
        </h2>

        <div className={styles.grid}>
          <div className={styles.offerWrap}>
            <div className={styles.offer}>
              <p className={styles.priceRow}>
                <span className={styles.price}>54 BYN</span>
                <span className={styles.period}>в месяц</span>
              </p>
              <p className={styles.offerLine}>Две пачки по 250 г.</p>
              <p className={styles.offerLine}>Доставка по Минску бесплатно.</p>
            </div>
          </div>

          <div className={styles.content}>
            <p className={styles.text}>
              Каждый месяц привозим вам свежее зерно — сами решаете, какое.
              Напишите в заявке, что хочется, или скажите на звонке: подберём
              под ваш способ варки.
            </p>
            <p className={styles.text}>
              Если в какой-то месяц нужно пропустить или взять другую пару —
              просто позвоните.
            </p>
            <p className={styles.kicker}>
              Никаких личных кабинетов, подписок на сайте и автосписаний. Всё
              по-человечески, по телефону.
            </p>

            <a className={styles.button} href="#zayavka">
              Оформить подписку
            </a>
            <p className={styles.note}>
              На сайте платить не нужно. Оставляете заявку — перезваниваем и
              договариваемся.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}