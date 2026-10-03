import "server-only";
import { Receiver } from "@upstash/qstash";
import type { NextRequest } from "next/server";
import { requireEnv } from "@/shared/lib/env";
import { getBaseUrl } from "@/shared/lib/getBaseUrl";

let receiver: Receiver | undefined;

function getReceiver() {
  receiver ??= new Receiver({
    currentSigningKey: requireEnv(
      process.env.QSTASH_CURRENT_SIGNING_KEY,
      "QSTASH_CURRENT_SIGNING_KEY",
    ),
    nextSigningKey: requireEnv(
      process.env.QSTASH_NEXT_SIGNING_KEY,
      "QSTASH_NEXT_SIGNING_KEY",
    ),
  });
  return receiver;
}

export async function readVerifiedQstashBody(
  req: NextRequest,
  path: string,
): Promise<string | null> {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";
  try {
    const isValid = await getReceiver().verify({
      body,
      signature,
      url: `${getBaseUrl()}${path}`,
    });
    return isValid ? body : null;
  } catch {
    return null;
  }
}
