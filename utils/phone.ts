/** Коды мобильных операторов Беларуси: life:), A1, MTS. */
const MOBILE_CODES: readonly string[] = ["25", "29", "33", "44"];

/** Длина номера без кода страны: код оператора (2) + абонентский номер (7). */
const NATIONAL_LENGTH = 9;

/** Постоянная часть маски. Пользователь вводит только остальное. */
export const PHONE_PREFIX = "+375 (";

/**
 * Достаёт из любой строки цифры номера без кода страны.
 * Понимает: +375 29 123-45-67, 375291234567, 8 029 123-45-67, 029 123-45-67, 29 123 45 67.
 * Также переживает вставку номера в уже заполненное «+375 (».
 */
function toNationalDigits(input: string): string {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("375")) {
    digits = digits.slice(3);
  }

  // Лишний префикс остаётся только при вставке: 375 второй раз, 80 или 0 перед кодом оператора
  if (digits.length > NATIONAL_LENGTH) {
    if (digits.startsWith("375")) {
      digits = digits.slice(3);
    } else if (digits.startsWith("80")) {
      digits = digits.slice(2);
    } else if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
  }

  return digits;
}

/**
 * 1. Приводит номер к виду +375XXXXXXXXX.
 * Возвращает пустую строку, если номер невалидный.
 */
export function normalizeBelarusPhone(input: string): string {
  // буквы и прочий мусор не принимаем, только цифры, пробелы, скобки, плюс, дефисы и точки
  if (/[^\d\s()+\-.]/.test(input)) return "";

  const national = toNationalDigits(input);

  if (national.length !== NATIONAL_LENGTH) return "";
  if (!MOBILE_CODES.includes(national.slice(0, 2))) return "";

  return `+375${national}`;
}

/** 2. Обёртка над normalizeBelarusPhone: номер верный или нет. */
export function isValidBelarusPhone(input: string): boolean {
  return normalizeBelarusPhone(input) !== "";
}

function buildMask(national: string): string {
  if (national === "") return PHONE_PREFIX;

  let result = PHONE_PREFIX + national.slice(0, 2);
  if (national.length >= 2) result += ")";
  if (national.length > 2) result += ` ${national.slice(2, 5)}`;
  if (national.length > 5) result += `-${national.slice(5, 7)}`;
  if (national.length > 7) result += `-${national.slice(7, 9)}`;

  return result;
}

/**
 * Маска ввода: +375 (29) 123-45-67.
 * `raw` — то, что сейчас в поле, `previous` — прежнее значение поля.
 * Предыдущее значение нужно, чтобы Backspace мог стереть цифру, а не упираться в скобку или дефис.
 */
export function formatPhoneInput(raw: string, previous = ""): string {
  if (raw === "") return "";

  let national = toNationalDigits(raw).slice(0, NATIONAL_LENGTH);

  // Стёрт только служебный символ маски: убираем последнюю цифру
  const previousNational = toNationalDigits(previous).slice(0, NATIONAL_LENGTH);
  if (raw.length < previous.length && national === previousNational) {
    national = national.slice(0, -1);
  }

  return buildMask(national);
}