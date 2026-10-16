"use client";

import { useEffect } from "react";
import { captureUtm } from "../utils/utm";

/** Невидимый компонент: при загрузке страницы сохраняет utm-метки из адреса. */
export default function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}