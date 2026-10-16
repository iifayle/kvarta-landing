"use client";

import Image from "next/image";
import { getStoredUtm } from "../utils/utm";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  PHONE_PREFIX,
  formatPhoneInput,
  isValidBelarusPhone,
  normalizeBelarusPhone,
} from "../utils/phone";
import styles from "./LeadForm.module.css";

const TOPICS = [
  { value: "subscription", label: "Подписка" },
  { value: "order", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
] as const;

type Status = "idle" | "sending" | "success" | "error";

interface LeadPayload {
  name: string;
  phone: string;
  topic: string;
  comment: string;
  utm: Record<string, string>;
}

const SEND_ERROR_TEXT =
  "Не отправилось. Проверьте связь и попробуйте ещё раз через минуту.";

// Если сервер молчит дольше, считаем отправку неудачной, а не держим форму заблокированной
const REQUEST_TIMEOUT_MS = 15000;

export default function LeadForm() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const phoneHintId = useId();
  const phoneRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  // setState асинхронный: два быстрых submit подряд оба увидят status "idle".
  // Ref меняется сразу, поэтому он закрывает этот зазор.
  const sendingRef = useRef(false);

  const isSending = status === "sending";

  // После успеха переводим фокус на сообщение, чтобы его услышали скринридеры
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

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

  function handleReset() {
    setStatus("idle");
    setErrorMessage("");
    setPhone("");
    setPhoneError(false);
    // имя и комментарий очищаются сами: при возврате к idle форма монтируется заново
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || sendingRef.current) return;

    const normalizedPhone = normalizeBelarusPhone(phone);
    if (normalizedPhone === "") {
      setPhoneError(true);
      phoneRef.current?.focus();
      return;
    }

    // читаем поля до await: после него event.currentTarget уже пустой
    const formData = new FormData(event.currentTarget);
    const payload: LeadPayload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: normalizedPhone,
      topic: String(formData.get("topic") ?? ""),
      comment: String(formData.get("comment") ?? "").trim(),
      utm: getStoredUtm(),
    };

    sendingRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus("success");
      setPhone("");
      setPhoneError(false);
    } catch {
      setStatus("error");
      setErrorMessage(SEND_ERROR_TEXT);
    } finally {
      window.clearTimeout(timer);
      sendingRef.current = false;
    }
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
              Заполните заявку, чтобы мы с вами связались
            </h2>
          </div>

          {status === "success" ? (
            <div
              ref={successRef}
              className={styles.success}
              role="status"
              tabIndex={-1}
            >
              <p className={styles.successText}>
                Заявка ушла. Перезвоним в рабочие часы мастерской.
              </p>
              <button
                className={styles.again}
                type="button"
                onClick={handleReset}
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={handleSubmit}
              aria-busy={isSending}
            >
              <div style={{ display: "none" }} aria-hidden="true">
                <input
                  type="text"
                  name="YamilYamal"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input
                className={styles.control}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Ваше имя"
                aria-label="Имя"
                disabled={isSending}
                required
              />

              <div>
                <input
                  ref={phoneRef}
                  className={styles.control}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="+375 (__) ___-__-__"
                  aria-label="Телефон (белорусский номер)"
                  aria-invalid={phoneError}
                  aria-describedby={phoneError ? phoneHintId : undefined}
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={handlePhoneFocus}
                  onBlur={handlePhoneBlur}
                  disabled={isSending}
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
                      disabled={isSending}
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
                disabled={isSending}
              />

              <button
                className={styles.button}
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Отправляем..." : "Отправить заявку"}
              </button>

              {status === "error" ? (
                <p className={styles.error} role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <p className={styles.note}>
                Смотрим заявки в рабочие часы и перезваниваем.
              </p>
            </form>
          )}
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