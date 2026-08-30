"use client";

import { useReducer, useState } from "react";
import {
  canExecuteCommit,
  reduceGate,
  type GateState,
} from "@/lib/confirmGate";

function gateReducer(state: GateState, event: Parameters<typeof reduceGate>[1]) {
  return reduceGate(state, event);
}

export function ConfirmCommitPanel() {
  const [gate, dispatch] = useReducer(gateReducer, "idle" as GateState);
  const [message, setMessage] = useState("Draft: update pricing copy");
  const [log, setLog] = useState<string>("No commit yet.");
  const [busy, setBusy] = useState(false);

  async function confirmAndCommit() {
    const next = reduceGate(gate, { type: "CONFIRM" });
    dispatch({ type: "CONFIRM" });
    if (!canExecuteCommit(next)) return;

    setBusy(true);
    try {
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, confirmed: true }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        commitId?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setLog(`Blocked: ${data.error ?? res.statusText}`);
        dispatch({ type: "RESET" });
        return;
      }
      setLog(`Committed ${data.commitId}: "${message}"`);
      dispatch({ type: "RESET" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-zinc-300">Commit message</span>
        <input
          data-testid="commit-message"
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={gate === "awaiting_confirm" || busy}
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {gate !== "awaiting_confirm" ? (
          <button
            type="button"
            data-testid="request-commit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            onClick={() => {
              setLog("Awaiting confirm…");
              dispatch({ type: "REQUEST_COMMIT" });
            }}
            disabled={busy || !message.trim()}
          >
            Request commit
          </button>
        ) : (
          <>
            <button
              type="button"
              data-testid="confirm-commit"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
              onClick={confirmAndCommit}
              disabled={busy}
            >
              {busy ? "Committing…" : "Confirm & commit"}
            </button>
            <button
              type="button"
              data-testid="cancel-commit"
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              onClick={() => {
                dispatch({ type: "CANCEL" });
                setLog("Cancelled — nothing was committed.");
              }}
              disabled={busy}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <p className="text-xs uppercase tracking-wide text-zinc-500">
        Gate: <span data-testid="gate-state">{gate}</span>
      </p>
      <p
        data-testid="commit-log"
        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-300"
      >
        {log}
      </p>
    </div>
  );
}
