import { Redis } from "@upstash/redis";

// Vercel's current Upstash integration exposes KV_REST_API_* variables.
// Direct Upstash integrations may still use UPSTASH_REDIS_REST_*.
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
