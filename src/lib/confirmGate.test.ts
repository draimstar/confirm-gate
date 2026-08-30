import { describe, expect, it } from "vitest";
import { canExecuteCommit, reduceGate, type GateState } from "./confirmGate";

describe("confirmGate", () => {
  it("blocks commit until CONFIRM", () => {
    let state: GateState = "idle";
    expect(canExecuteCommit(state)).toBe(false);

    state = reduceGate(state, { type: "REQUEST_COMMIT" });
    expect(state).toBe("awaiting_confirm");
    expect(canExecuteCommit(state)).toBe(false);

    state = reduceGate(state, { type: "CONFIRM" });
    expect(state).toBe("committed");
    expect(canExecuteCommit(state)).toBe(true);
  });

  it("cancel does not allow commit", () => {
    let state: GateState = "idle";
    state = reduceGate(state, { type: "REQUEST_COMMIT" });
    state = reduceGate(state, { type: "CANCEL" });
    expect(state).toBe("cancelled");
    expect(canExecuteCommit(state)).toBe(false);
  });

  it("ignores confirm while idle", () => {
    const state = reduceGate("idle", { type: "CONFIRM" });
    expect(state).toBe("idle");
    expect(canExecuteCommit(state)).toBe(false);
  });

  it("reset returns to idle", () => {
    let state: GateState = "committed";
    state = reduceGate(state, { type: "RESET" });
    expect(state).toBe("idle");
  });
});
