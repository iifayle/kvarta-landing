"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import catalog from "@/data/catalog.json";
import styles from "./Catalog.module.css";

type Product = {
  id: string;
  name: string;
  price: number;
  weight: string;
  description: string;
  image: string;
};

const PRODUCTS: Product[] = catalog;
const SWIPE_DISTANCE = 40;

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function Catalog() {
  const [active, setActive] = useState(0);
  const count = PRODUCTS.length;

  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  function goNext() {
    setActive((index) => (index + 1) % count);
  }

  function goPrev() {
    setActive((index) => (index - 1 + count) % count);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
    didSwipe.current = false;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy)) return;

    didSwipe.current = true;
    if (dx < 0) goNext();
    else goPrev();
  }

  function handleSelect(index: number) {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setActive(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") goPrev();
    if (event.key === "ArrowRight") goNext();
  }

  return (
    <section id="zerno" className={styles.catalog} aria-labelledby="catalog-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="catalog-title" className={styles.title}>
            Наше зерно
          </h2>
          <p className={styles.intro}>
            Выберите свое начало дня
          </p>
        </div>

        <div
          className={styles.carousel}
          role="region"
          aria-roledescription="carousel"
          aria-label="Наше зерно"
          onKeyDown={handleKeyDown}
        >
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            aria-label="Предыдущая позиция"
            onClick={goPrev}
          >
            <Chevron direction="prev" />
          </button>

          <div
            className={styles.viewport}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            <ul
              className={styles.track}
              style={{ "--index": active } as CSSProperties}
            >
              {PRODUCTS.map((product, index) => {
                const isActive = index === active;

                return (
                  <li
                    key={product.id}
                    className={`${styles.card} ${isActive ? styles.active : ""}`}
                  >
                    <div
                      className={styles.photo}
                      aria-hidden="true"
                      style={{ backgroundImage: `url("${product.image}")` }}
                    />

                    <div className={styles.body}>
                      <h3 className={styles.name}>{product.name}</h3>
                      <p className={styles.description}>
                        {product.description}
                      </p>
                    </div>

                    <div className={styles.plate}>
                      <span className={styles.price}>{product.price} BYN</span>
                      <span className={styles.weight}>{product.weight}</span>
                    </div>

                    {!isActive ? (
                      <button
                        type="button"
                        className={styles.select}
                        aria-label={`Показать: ${product.name}`}
                        onClick={() => handleSelect(index)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            aria-label="Следующая позиция"
            onClick={goNext}
          >
            <Chevron direction="next" />
          </button>

          <p className={styles.srOnly} aria-live="polite">
            {`Позиция ${active + 1} из ${count}: ${PRODUCTS[active].name}`}
          </p>
        </div>
      </div>
    </section>
  );
}