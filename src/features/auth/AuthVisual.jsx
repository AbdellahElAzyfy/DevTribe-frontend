export default function AuthVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden h-130 w-full max-w-135 lg:block"
    >
      <div className="auth-orb auth-orb-a" />
      <div className="auth-orb auth-orb-b" />
      <div className="auth-orb auth-orb-c" />

      <div className="auth-brand auth-float-slow auth-delay-1">
        <span className="auth-brand-dot" />
        <span className="auth-brand-text">devTribe</span>
      </div>

      <div className="auth-panel auth-float-slow auth-delay-0 absolute left-14 top-20 z-20 h-80 w-87.5 -rotate-3">
        <div className="auth-grid absolute inset-0 opacity-70" />

        <div className="absolute left-5 top-5 h-8 w-28 rounded-md border border-slate-600/70 bg-slate-900/70" />
        <div className="absolute left-5 top-17 h-2 w-48 rounded-full bg-slate-600/70" />
        <div className="absolute left-5 top-22 h-2 w-36 rounded-full bg-slate-700/90" />

        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
          <div className="mb-3 h-2 w-24 rounded-full bg-blue-300/70" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-slate-700/90" />
            <div className="h-2 w-[90%] rounded-full bg-slate-700/80" />
            <div className="h-2 w-[68%] rounded-full bg-slate-700/70" />
          </div>
        </div>
      </div>

      <div className="auth-panel auth-float-fast auth-delay-2 absolute left-52 top-40 z-30 h-52 w-56 rotate-6">
        <div className="absolute left-4 top-4 h-9 w-9 rounded-lg border border-blue-300/50 bg-blue-400/10" />
        <div className="absolute left-16 top-7 h-2 w-20 rounded-full bg-slate-600/80" />
        <div className="absolute left-16 top-12 h-2 w-14 rounded-full bg-slate-700/90" />
        <div className="absolute bottom-5 left-4 right-4 h-16 rounded-lg border border-slate-700/80 bg-slate-900/75" />
      </div>

      <div className="auth-panel auth-float-mid auth-delay-1 absolute left-8 top-64 z-10 h-36 w-48 -rotate-8">
        <div className="absolute left-4 top-4 h-2 w-14 rounded-full bg-slate-600/80" />
        <div className="absolute left-4 top-8 h-2 w-10 rounded-full bg-slate-700/90" />
        <div className="absolute bottom-4 left-4 right-4 h-18 rounded-lg border border-slate-700/75 bg-slate-900/80" />
      </div>

      <div className="auth-node-core auth-pulse-node auth-delay-1" />

      <div className="auth-node auth-node-a auth-float-node auth-delay-0" />
      <div className="auth-node auth-node-b auth-float-node auth-delay-2" />
      <div className="auth-node auth-node-c auth-float-node auth-delay-1" />
      <div className="auth-node auth-node-d auth-float-node auth-delay-3" />
      <div className="auth-node auth-node-e auth-float-node auth-delay-4" />
      <div className="auth-node auth-node-f auth-float-node auth-delay-2" />

      <div className="auth-link auth-link-a" />
      <div className="auth-link auth-link-b" />
      <div className="auth-link auth-link-c" />
      <div className="auth-link auth-link-d" />
      <div className="auth-link auth-link-e" />
    </div>
  );
}
