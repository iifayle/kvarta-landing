"use client";

import Image from "next/image";
import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import {
  PHONE_PREFIX,
  formatPhoneInput,
  isValidBelarusPhone,
} from "../utils/phone";
import styles from "./LeadForm.module.css";


const TOPICS = [
  { value: "subscription", label: "Подписка" },
  { value: "order", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
] as const;

export default function LeadForm() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const phoneHintId = useId();
  // Пока отправки нет: не даём браузеру перезагрузить страницу
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }
function handlePhoneFocus() {
    // +375 стоит в поле всегда, пользователь вводит только остальные цифры
    if (phone === "") setPhone(PHONE_PREFIX);
  }
  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const next = formatPhoneInput(event.target.value, phone);
    setPhone(next);
    // как только номер стал верным, подсказка пропадает сразу, не дожидаясь blur
    if (phoneError && isValidBelarusPhone(next)) setPhoneError(false);
  }

  function handlePhoneBlur() {
    // ничего не ввели: возвращаем placeholder, подсказку не показываем
    if (phone === "" || phone === PHONE_PREFIX) {
      setPhone("");
      setPhoneError(false);
      return;
    }
    setPhoneError(!isValidBelarusPhone(phone));
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

            <div>
              <input
                className={styles.control}
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="+375 (29) 123-45-67"
                aria-label="Телефон (белорусский номер)"
                aria-invalid={phoneError}
                aria-describedby={phoneError ? phoneHintId : undefined}
                value={phone}
                onChange={handlePhoneChange}
                onFocus={handlePhoneFocus}
                onBlur={handlePhoneBlur}
                required
              />
              <div aria-live="polite">
                {phoneError ? (
                  <p className={styles.hint} id={phoneHintId}>
                    Нужен белорусский номер, например +375 29 123-45-67
                  </p>
                ) : null}
              </div>
            </div>

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