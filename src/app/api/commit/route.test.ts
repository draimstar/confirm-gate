import { describe, expect, it } from "vitest";
import { POST } from "./route";

function post(body: string) {
  return POST(
    new Request("http://localhost/api/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }),
  );
}

describe("POST /api/commit", () => {
  it("commits when confirmed is exactly true", async () => {
    const res = await post(JSON.stringify({ message: "ship", confirmed: true }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it.each([false, "false", "true", 1, "yes", null])(
    "refuses confirmed: %j",
    async (confirmed) => {
      const res = await post(JSON.stringify({ message: "ship", confirmed }));
      expect(res.status).toBe(403);
    },
  );

  it("refuses a missing confirmed flag", async () => {
    const res = await post(JSON.stringify({ message: "ship" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 for a body that is not JSON", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it.each(["null", "[]", '"text"'])("returns 400 for body %s", async (body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is not a string", async () => {
    const res = await post(JSON.stringify({ message: 42, confirmed: true }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a blank message", async () => {
    const res = await post(JSON.stringify({ message: "   ", confirmed: true }));
    expect(res.status).toBe(400);
  });
});
