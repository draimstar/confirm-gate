import { NextResponse } from "next/server";

type Body = {
  message?: string;
  confirmed?: boolean;
};

/** Server refuses unconfirmed commits — mirrors confirm-before-commit policy. */
export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const message = body.message?.trim() ?? "";

  if (!body.confirmed) {
    return NextResponse.json(
      { ok: false, error: "Commit requires confirmed: true" },
      { status: 403 },
    );
  }

  if (!message) {
    return NextResponse.json(
      { ok: false, error: "Empty commit message" },
      { status: 400 },
    );
  }

  const commitId = `c_${Date.now().toString(36)}`;
  return NextResponse.json({ ok: true, commitId, message });
}
