import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { normalizeBelarusPhone } from "@/utils/phone";
import { Ratelimit } from "@upstash/ratelimit";

const TOPICS = ["subscription", "order", "question"] as const;
type Topic = (typeof TOPICS)[number];

const NAME_MAX = 100;
const COMMENT_MAX = 500;
const UTM_MAX_ENTRIES = 20;
const UTM_KEY_MAX = 50;
const UTM_VALUE_MAX = 200;

// Ключ дедупликации живёт 10 минут
const DEDUP_TTL_SECONDS = 600;
// Постоянное хранилище заявок: список без срока жизни
const LEADS_LIST_KEY = "leads";

interface Lead {
  name: string;
  phone: string;
  topic: Topic;
  comment: string;
  utm: Record<string, string>;
  createdAt: string;
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 запросов в минуту с одного IP
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanTopic(value: unknown): Topic {
  return TOPICS.find((topic) => topic === value) ?? "question";
}

// Из utm берём только строки и числа, количество и длину ограничиваем
function cleanUtm(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};

  const result: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value).slice(0, UTM_MAX_ENTRIES)) {
    if (typeof raw !== "string" && typeof raw !== "number") continue;
    result[key.slice(0, UTM_KEY_MAX)] = String(raw).trim().slice(0, UTM_VALUE_MAX);
  }
  return result;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

const TOPIC_LABELS: Record<Topic, string> = {
  subscription: "Подписка",
  order: "Разовый заказ",
  question: "Вопрос",
};

// Дублирует заявку в Telegram. Не бросает исключений: если что-то не так, только лог.
async function sendToTelegram(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    "Новая заявка",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Интересует: ${TOPIC_LABELS[lead.topic]}`,
  ];
  if (lead.comment) lines.push(`Комментарий: ${lead.comment}`);
  if (lead.utm.utm_source) lines.push(`Источник: ${lead.utm.utm_source}`);

  try {
    const response = await fetch(
      new Request(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          link_preview_options: { is_disabled: true },
        }),
        // Telegram не должен надолго задерживать ответ клиенту
        signal: AbortSignal.timeout(5000),
      }),
    );

    if (!response.ok) {
      console.error("[telegram] bad response", response.status, await response.text());
    }
  } catch (error) {
    console.error(
      "[telegram] send failed",
      error instanceof Error ? error.message : error,
    );
  }
}

export async function POST(request: Request) {

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }
  if (!isRecord(body)) return jsonError("invalid_json", 400);

    if (body.YamilYamal) {
      return NextResponse.json({ ok: true });
    }

  const name = cleanText(body.name);
  if (name.length < 1 || name.length > NAME_MAX) {
    return jsonError("invalid_name", 400);
  }

  const phone =
    typeof body.phone === "string" ? normalizeBelarusPhone(body.phone) : "";
  if (phone === "") return jsonError("invalid_phone", 400);

  const lead: Lead = {
    name,
    phone,
    topic: cleanTopic(body.topic),
    comment: cleanText(body.comment).slice(0, COMMENT_MAX),
    utm: cleanUtm(body.utm),
    createdAt: new Date().toISOString(),
  };

  try {
    const redis = Redis.fromEnv();
    const dedupKey = `lead:${phone}`;

    // Записывает, только если ключа ещё нет; "OK" — первая заявка, null — повтор
    const saved = await redis.set(dedupKey, lead, {
      nx: true,
      ex: DEDUP_TTL_SECONDS,
    });
    if (saved === null) {
      return NextResponse.json({ ok: true, deduplicated: true });
    }

    try {
      await redis.lpush(LEADS_LIST_KEY, lead);
    } catch (error) {
      // Заявка не сохранилась: снимаем ключ, иначе повторная отправка
      // в ближайшие 10 минут сошла бы за дубль, и заявка потерялась бы
      await redis.del(dedupKey).catch(() => undefined);
      throw error;
    }

    console.log("[lead]", JSON.stringify(lead));
    await sendToTelegram(lead);   // ← добавить
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead] error", error);
    return jsonError("server_error", 500);
  }
}

function methodNotAllowed() {
  return NextResponse.json(
    { error: "method_not_allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;