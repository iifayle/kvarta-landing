import styles from "./Faq.module.css";

const QUESTIONS = [
  {
    question: "Если написать сегодня - когда зерно будет у меня?",
    answer:
      "Жарим по четвергам, по Минску везём по пятницам. Забрать можно самим на Короля, 9 - в часы мастерской.",
  },
  {
    question: "Доставка платная?",
    answer:
      "По пятницам по Минску. От 50 BYN - бесплатно. В подписке доставка уже входит.",
  },
  {
    question: "Что в подписке и можно ли выбрать зерно?",
    answer:
      "54 BYN в месяц, две пачки по 250 г, доставка бесплатно. Какие лоты - напишите в заявке, на звонке подтвердим.",
  },
  {
    question: "Можно не ждать пятницу и забрать самим?",
    answer: "Да. Короля, 9: пн-пт 8:00-20:00, сб-вс 10:00-18:00.",
  },
  {
    question: "Зерно правда свежее?",
    answer:
      "У вас оно на 1-3 день после обжарки. Партия 5 кг в четверг, к пятнице уже разъезжается. В магазине тот же пакет может лежать месяцами.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <h2 id="faq-title" className={styles.title}>
          Ваши вопросы и наши ответы
        </h2>

        <div className={styles.list}>
          {QUESTIONS.map((item) => (
            <details key={item.question} className={styles.item}>
              <summary className={styles.summary}>
                <span className={styles.question}>{item.question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}