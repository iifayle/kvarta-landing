import styles from "./Footer.module.css";
import BynIcon from "./BynIcon";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.logo}>Кварта</p>
          </div>

          <address className={styles.contacts}>
            <dl className={styles.list}>
              <div className={styles.row}>
                <dt className={styles.term}>Адрес</dt>
                <dd className={styles.desc}>Минск, ул. Короля, 9</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.term}>Часы</dt>
                <dd className={styles.desc}>
                  Пн-пт: 8:00–20:00. Сб-вс: 10:00-18:00.
                </dd>
              </div>
            </dl>
            <p className={styles.delivery}>
              Доставка по Минску - по пятницам, от 50 <BynIcon className={styles.bynIcon}/> бесплатно.
            </p>
          </address>

          <a className={styles.link} href="#zayavka">
            Оставить заявку
          </a>
        </div>

        <p className={styles.note}>
          Заявку смотрим в рабочие часы и перезваниваем.
        </p>
      </div>
    </footer>
  );
}