export function DashboardLoadingScreen({
  title = "Chargement du tableau de bord",
  subtitle = "Préparation des données et des sections…",
}) {
  return (
    <>
      <style>{`
        @keyframes dashboardShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .dashboard-skeleton {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          background: linear-gradient(90deg, rgba(148,163,184,0.12) 25%, rgba(255,255,255,0.8) 50%, rgba(148,163,184,0.12) 75%);
          background-size: 200% 100%;
          animation: dashboardShimmer 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="space-y-6 p-4 sm:p-6 lg:p-8" style={{ background: "linear-gradient(180deg, #f8fffb 0%, #f1f9f5 100%)" }}>
        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,118,110,0.05)] md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="dashboard-skeleton h-3 w-28 rounded-full" />
            <div className="dashboard-skeleton h-8 w-56 rounded-xl" />
            <div className="dashboard-skeleton h-4 w-80 rounded-full" />
          </div>
          <div className="dashboard-skeleton h-11 w-56 rounded-xl" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="dashboard-skeleton mb-4 h-3 w-20 rounded-full" />
              <div className="dashboard-skeleton h-9 w-20 rounded-xl" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="dashboard-skeleton mb-4 h-5 w-40 rounded-full" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="dashboard-skeleton h-4 w-3/4 rounded-full" />
                      <div className="dashboard-skeleton h-3 w-1/2 rounded-full" />
                    </div>
                    <div className="dashboard-skeleton h-8 w-10 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="dashboard-skeleton mb-4 h-5 w-36 rounded-full" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="dashboard-skeleton h-4 w-4/5 rounded-full" />
                      <div className="dashboard-skeleton h-3 w-2/5 rounded-full" />
                    </div>
                    <div className="dashboard-skeleton h-12 w-20 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
