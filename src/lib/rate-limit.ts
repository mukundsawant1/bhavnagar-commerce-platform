import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const isUpstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN &&
  !!process.env.UPSTASH_REDIS_REST_PASSWORD;

let rateLimiter: Ratelimit | null = null;

if (isUpstashConfigured) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
  });
}

const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

export async function enforceRateLimit(key: string) {
  if (rateLimiter) {
    const { success, pending, limit, reset } = await rateLimiter.limit(key);
    if (!success) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: reset ? new Date(reset * 1000).toISOString() : null,
        reason: "Rate limit exceeded",
      };
    }

    return {
      allowed: true,
      remaining: Number(limit) - Number(pending),
      resetAt: reset ? new Date(reset * 1000).toISOString() : null,
    };
  }

  const now = Date.now();
  const bucket = inMemoryStore.get(key) ?? { count: 0, resetAt: now + 60 * 1000 };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + 60 * 1000;
  }

  bucket.count += 1;
  inMemoryStore.set(key, bucket);

  if (bucket.count > 20) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(bucket.resetAt).toISOString(),
      reason: "Rate limit exceeded",
    };
  }

  return {
    allowed: true,
    remaining: 20 - bucket.count,
    resetAt: new Date(bucket.resetAt).toISOString(),
  };
}
