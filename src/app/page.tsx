import { ConfirmCommitPanel } from "@/components/ConfirmCommitPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-lg space-y-3 pb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          confirm-gate
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Confirm before commit
        </h1>
        <p className="text-zinc-400">
          Destructive action stays blocked until an explicit confirm step. Vitest
          covers the gate; Playwright covers the UI path.
        </p>
      </div>
      <ConfirmCommitPanel />
    </main>
  );
}
