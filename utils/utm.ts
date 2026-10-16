/** Метки и данные о заходе: плоский объект из строк, его можно отправлять в API как есть. */
export type UtmData = Record<string, string>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

// Служебные поля, которые мы добавляем сами
const META_KEYS = ["landing_page", "referrer", "saved_at"] as const;

const STORAGE_KEY = "kvarta:utm";

// Как и в API-роуте: длиннее 200 символов значение всё равно обрежется
const MAX_VALUE_LENGTH = 200;

function clip(value: string): string {
  return value.slice(0, MAX_VALUE_LENGTH);
}

/**
 * URLSearchParams уже раскодирует %D0%BA... в кириллицу. Эта функция
 * нужна для «двойного» кодирования (%25D0%25BA), которое иногда
 * делают рекламные системы и редиректы.
 */
function readable(value: string): string {
  if (!/%[0-9a-f]{2}/i.test(value)) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readUtmFromUrl(search: string): UtmData {
  const result: UtmData = {};

  new URLSearchParams(search).forEach((value, key) => {
    const name = key.toLowerCase();
    if (!UTM_KEYS.some((utmKey) => utmKey === name)) return;

    const clean = readable(value).trim();
    if (clean) result[name] = clip(clean);
  });

  return result;
}

/**
 * 1. Сохраняет utm-метки из адреса страницы в localStorage вместе со страницей
 * входа, источником перехода и временем. Если в адресе нет ни одной метки,
 * ничего не сохраняет и не меняет. Новые метки заменяют прежние.
 */
export function captureUtm(): void {
  if (typeof window === "undefined") return;

  const fromUrl = readUtmFromUrl(window.location.search);
  if (Object.keys(fromUrl).length === 0) return;

  // Те же метки уже сохранены (например, перезагрузка страницы): время первого захода не трогаем
  const stored = getStoredUtm();
  const unchanged = UTM_KEYS.every(
    (key) => (fromUrl[key] ?? "") === (stored[key] ?? ""),
  );
  if (unchanged) return;

  const data: UtmData = {
    ...fromUrl,
    landing_page: clip(window.location.origin + window.location.pathname),
    saved_at: new Date().toISOString(),
  };
  if (document.referrer) data.referrer = clip(document.referrer);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // хранилище недоступно (приватный режим, запрет в настройках): просто без атрибуции
  }
}

/** 2. Возвращает сохранённые данные или пустой объект. */
export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    const record = parsed as Record<string, unknown>;
    const result: UtmData = {};
    for (const key of [...UTM_KEYS, ...META_KEYS]) {
      const value = record[key];
      if (typeof value === "string" && value !== "") result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}