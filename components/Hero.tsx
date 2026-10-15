import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        <Image
          src="/images/first.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Мастерская на Короля, 9</p>
          <h1 id="hero-title" className={styles.title}>
            Обжариваем по четвергам. Зерно у вас на 1–3 день.
          </h1>
          <p className={styles.text}>
            Партия — 5 кг, не склад на месяцы. По пятницам развозим по Минску.
          </p>
        </div>
      </div>
    </section>
  );
}