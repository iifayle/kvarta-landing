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
          <h1 id="hero-title" className={styles.title}>
            Кофе, что станет прекрасным началом дня
          </h1>
          <p className={styles.text}>
            свежая обжарка в вашему столу
          </p>
        </div>
      </div>
    </section>
  );
}