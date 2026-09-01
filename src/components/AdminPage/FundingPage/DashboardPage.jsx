import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { fundingRadarApi } from '../../../../api/fundingRadarApi';
import { formatDeadline } from '../../shared';

export default function DashboardPage() {
  const navigate = useNavigate();
  const openOpportunity = (id) => navigate(`/admin/veille/opportunites/${id}`);

  const [summary, setSummary] = useState(null);
  const [topOpportunities, setTopOpportunities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningPipeline, setRunningPipeline] = useState(false);
  const [error, setError] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [s, top, deadlines] = await Promise.all([
        fundingRadarApi.getDashboardSummary(),
        fundingRadarApi.listOpportunities({ minScore: 60, sort: '-relevanceScore' }),
        fundingRadarApi.listOpportunities({ sort: 'deadline' }),
      ]);
      setSummary(s);
      setTopOpportunities(top.slice(0, 6));
      setUpcomingDeadlines(
        deadlines
          .filter((o) => o.deadline && new Date(o.deadline) >= new Date())
          .slice(0, 5),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function handleRunNow() {
    setRunningPipeline(true);
    try {
      await fundingRadarApi.runPipelineNow();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setRunningPipeline(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-slate-500">Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-green-100 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,118,110,0.05)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">Veille financement</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Vue synthétique</h1>
            <p className="mt-1 text-sm text-slate-500">Les opportunités qui comptent, sans parcourir les sites un par un.</p>
          </div>

          <button
            onClick={handleRunNow}
            disabled={runningPipeline}
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {runningPipeline ? 'Veille en cours...' : 'Lancer la veille maintenant'}
          </button>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {summary && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Nouveaux', value: summary.nouveaux, tone: 'green' },
              { label: 'À examiner', value: summary.aExaminer, tone: 'amber' },
              { label: 'Favoris', value: summary.favoris, tone: 'green' },
              { label: 'Deadlines < 14 jours', value: summary.deadlinesProches, tone: 'amber' },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl border p-4 ${item.tone === 'green' ? 'border-green-100 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Les plus pertinents</h2>
          {topOpportunities.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune opportunité au-dessus de 60/100 pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {topOpportunities.map((opp) => {
                const tone = opp.relevanceScore >= 70 ? 'border-l-green-600 bg-green-50' : opp.relevanceScore >= 40 ? 'border-l-amber-500 bg-amber-50' : 'border-l-slate-300 bg-slate-50';
                return (
                  <div key={opp._id} onClick={() => openOpportunity(opp._id)} className={`cursor-pointer rounded-xl border border-slate-200 border-l-4 p-3 transition hover:border-slate-300 hover:bg-slate-50 ${tone}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-lg font-semibold text-slate-900">{opp.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{opp.funder}</span>
                          {opp.themes?.slice(0, 2).map((t) => <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">{t}</span>)}
                        </div>
                      </div>
                      <div className="min-w-[48px] text-right text-lg font-bold text-slate-800">{opp.relevanceScore}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Deadlines à venir</h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune deadline connue prochainement.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((opp) => {
                const dl = formatDeadline(opp.deadline);
                const tone = opp.relevanceScore >= 70 ? 'border-l-green-600 bg-green-50' : opp.relevanceScore >= 40 ? 'border-l-amber-500 bg-amber-50' : 'border-l-slate-300 bg-slate-50';
                return (
                  <div key={opp._id} onClick={() => openOpportunity(opp._id)} className={`cursor-pointer rounded-xl border border-slate-200 border-l-4 p-3 transition hover:border-slate-300 hover:bg-slate-50 ${tone}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-semibold text-slate-900">{opp.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{opp.funder}</div>
                      </div>
                      <div className={`shrink-0 rounded-lg border px-2 py-1 text-xs font-medium ${dl?.soon ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                        {dl?.formatted}<br />{dl?.daysLeft} j restants
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
