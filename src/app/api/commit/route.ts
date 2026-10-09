import { NextResponse } from "next/server";

function reject(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Server refuses unconfirmed commits — mirrors confirm-before-commit policy. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reject("Body must be valid JSON", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return reject("Body must be a JSON object", 400);
  }

  const { message, confirmed } = body as Record<string, unknown>;

  // Only the boolean true counts: "false", 1 and "yes" are truthy in JS.
  if (confirmed !== true) {
    return reject("Commit requires confirmed: true", 403);
  }

  if (typeof message !== "string" || !message.trim()) {
    return reject("Commit message must be a non-empty string", 400);
  }

  const commitId = `c_${Date.now().toString(36)}`;
  return NextResponse.json({ ok: true, commitId, message: message.trim() });
}
