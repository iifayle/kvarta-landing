"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import styles from "./LeadForm.module.css";

const TOPICS = [
  { value: "subscription", label: "Подписка" },
  { value: "order", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
] as const;

export default function LeadForm() {
  // Пока отправки нет: не даём браузеру перезагрузить страницу
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      id="zayavka"
      className={styles.lead}
      aria-labelledby="lead-title"
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.head}>
            <h2 id="lead-title" className={styles.title}>
              Заполните заявку, что бы мы с вами связались
            </h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.control}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ваше имя"
              aria-label="Имя"
              required
            />

            <input
              className={styles.control}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+375 (__) ___-__-__"
              aria-label="Телефон (белорусский номер)"
              required
            />

            <fieldset className={styles.topics}>
              <legend className={styles.srOnly}>Что интересует</legend>
              {TOPICS.map((item, index) => (
                <label key={item.value} className={styles.choice}>
                  <input
                    className={styles.radio}
                    type="radio"
                    name="topic"
                    value={item.value}
                    defaultChecked={index === 0}
                  />
                  <span className={styles.choiceText}>{item.label}</span>
                </label>
              ))}
            </fieldset>

            <textarea
              className={`${styles.control} ${styles.textarea}`}
              name="comment"
              rows={4}
              placeholder="Все, что вас интересует"
              aria-label="Комментарий (необязательно)"
            />

            <button className={styles.button} type="submit">
              Отправить заявку
            </button>

            <p className={styles.note}>
              Смотрим заявки в рабочие часы и перезваниваем
            </p>
          </form>
        </div>

        <div className={styles.media}>
          <Image
            src="/images/form.jpg"
            alt=""
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}