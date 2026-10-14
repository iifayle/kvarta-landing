import styles from "./Hero.module.css";

const BEANS_IMAGE = "/images/beans.jpg"; // файл: public/images/beans.jpg

const FACTS = [
  { value: "Четверг", label: "день обжарки" },
  { value: "5 кг", label: "одна партия" },
  { value: "1–3 день", label: "после обжарки у вас" },
] as const;

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Минская обжарка с 2019</p>

          <h1 id="hero-title" className={styles.title}>
            Свежее зерно к вашему столу.{" "}
            <span className={styles.accent}>Зерно с ростера сразу к вам.</span>
          </h1>

          <p className={styles.lead}>
            Небольшие партии - мы заботимся о качестве и не собираем склады. 
          </p>
          <p className={styles.about}>
            Заглядывайте в нашу мастерскую за зерном:)
          </p>

          <ul className={styles.facts}>
            {FACTS.map((fact) => (
              <li key={fact.value} className={styles.fact}>
                <span className={styles.factValue}>{fact.value}</span>
                <span className={styles.factLabel}>{fact.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          <div
            className={styles.photo}
            role="img"
            aria-label="Свежеобжаренные кофейные зёрна"
            style={{ backgroundImage: `url("${BEANS_IMAGE}")` }}
          />
        </div>
      </div>
    </section>
  );
}