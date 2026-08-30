export type GateState =
  | "idle"
  | "awaiting_confirm"
  | "committed"
  | "cancelled";

export type GateEvent =
  | { type: "REQUEST_COMMIT" }
  | { type: "CONFIRM" }
  | { type: "CANCEL" }
  | { type: "RESET" };

/** Confirm-before-commit state machine: commit only after explicit CONFIRM. */
export function reduceGate(state: GateState, event: GateEvent): GateState {
  switch (state) {
    case "idle":
      return event.type === "REQUEST_COMMIT" ? "awaiting_confirm" : state;
    case "awaiting_confirm":
      if (event.type === "CONFIRM") return "committed";
      if (event.type === "CANCEL") return "cancelled";
      return state;
    case "committed":
    case "cancelled":
      return event.type === "RESET" ? "idle" : state;
    default:
      return state;
  }
}

export function canExecuteCommit(state: GateState): boolean {
  return state === "committed";
}
