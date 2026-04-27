import { Resend } from "resend";

let _client: Resend | null = null;

export function resend(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _client = new Resend(key);
  }
  return _client;
}

export const FROM_ADDRESS =
  process.env.RESEND_FROM ?? "PATCH <onboarding@resend.dev>";
