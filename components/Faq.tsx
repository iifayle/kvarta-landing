import styles from "./Faq.module.css";
import BynIcon from "./BynIcon";

const QUESTIONS = [
  {
    question: "Когда зерно будет у меня?",
    answer:
      "Доставкой в пятницу, забрать можно в любой день после четверга",
  },
  {
  question: "Доставка платная?",
  answer: (
    <>
      Если сумма покупки меньше 50 <BynIcon className={styles.bynIcon} />, то доставка обойдётся в 15{" "}
      <BynIcon className={styles.bynIcon} />
    </>
  ),
},
  {
    question: "Зерно правда свежее?",
    answer:
      "Мы заботимся о свежести зерна. Оно жарится небольшими партиями по 5 кг. Нам важен ваши ощущения от свежего утреннего кофе",
  },
] as const;

export default function Faq() {
  return (
    <section id="voprosy" className={styles.faq} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <h2 id="faq-title" className={styles.title}>
          Частые вопросы
        </h2>

        <ul className={styles.cards} role="list">
          {QUESTIONS.map((item) => (
            <li key={item.question} className={styles.card}>
              <h3 className={styles.question}>{item.question}</h3>
              <p className={styles.answer}>{item.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}