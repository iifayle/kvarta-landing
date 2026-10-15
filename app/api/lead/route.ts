import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { normalizeBelarusPhone } from "@/utils/phone";

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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }
  if (!isRecord(body)) return jsonError("invalid_json", 400);

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