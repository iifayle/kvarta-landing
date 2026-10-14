"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "#zerno", label: "Зерно" },
  { href: "#podpiska", label: "Подписка" },
  { href: "#dostavka", label: "Доставка" },
  { href: "#voprosy", label: "Вопросы" },
] as const;

const ORDER_HREF = "#zayavka";
const ORDER_LABEL = "Заказать сейчас";
const HERO_PHOTO = "/images/hero.jpg"; // файл: public/images/hero.jpg

export default function Header() {
  const [open, setOpen] = useState(false);
  // true, пока шапка находится над фото первого экрана
  const [overPhoto, setOverPhoto] = useState(true);

  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setOpen(false);
  }

  function closeMenuAndReturnFocus() {
    setOpen(false);
    burgerRef.current?.focus();
  }

  // Шапка прозрачная, пока под ней фото; после фото — сплошной фон
  useEffect(() => {
    function update() {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      setOverPhoto(window.scrollY < window.innerHeight - headerHeight);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Если окно расширили до десктопа — закрываем мобильное меню
  useEffect(() => {
    function closeOnDesktop() {
      if (window.matchMedia("(min-width: 48rem)").matches) {
        setOpen(false);
      }
    }

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  // Пока меню открыто: Escape закрывает, прокрутка страницы заблокирована
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
        data-over-photo={overPhoto}
      >
        <div className={styles.inner}>
          <a className={styles.logo} href="/" onClick={closeMenu}>
            Кварта
          </a>

          <nav className={styles.desktopNav} aria-label="Разделы страницы">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a className={styles.order} href={ORDER_HREF}>
              {ORDER_LABEL}
            </a>
          </nav>

          <button
            ref={burgerRef}
            className={styles.burger}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>

        <div
          className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
          onClick={closeMenu}
          aria-hidden={!open}
        />
        <div
          className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
          id={menuId}
          role="dialog"
          aria-modal={open}
          aria-label="Меню"
          aria-hidden={!open}
        >
          <div className={styles.panelTop}>
            <button
              ref={closeRef}
              className={styles.close}
              type="button"
              aria-label="Закрыть меню"
              onClick={closeMenuAndReturnFocus}
            >
              <span className={styles.closeIcon} aria-hidden="true" />
            </button>
          </div>
          <nav className={styles.mobileNav} aria-label="Разделы страницы">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a className={styles.order} href={ORDER_HREF} onClick={closeMenu}>
              {ORDER_LABEL}
            </a>
          </nav>
        </div>
      </header>

      {/* Только мобильный: фото на первый экран + кнопка внизу */}
      <div className={styles.cover}>
        <div className={styles.photo}>
          <Image
            className={styles.photoImg}
            src={HERO_PHOTO}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <a className={styles.cta} href={ORDER_HREF}>
          {ORDER_LABEL}
        </a>
      </div>
    </>
  );
}