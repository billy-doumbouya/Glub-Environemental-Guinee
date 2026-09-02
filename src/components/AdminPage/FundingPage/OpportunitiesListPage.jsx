import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { fundingRadarApi } from '../../../../api/fundingRadarApi';
import { formatDeadline } from '../../shared';
import { DashboardLoadingScreen } from '../../ui';

const STATUS_LABELS = {
  nouveau: 'Nouveau',
  a_examiner: 'À examiner',
  favori: 'Favori',
  traite: 'Traité',
  masque: 'Masqué',
};

export default function OpportunitiesListPage() {
  const navigate = useNavigate();
  const openOpportunity = (id) => navigate(`/admin/veille/opportunites/${id}`);

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', theme: '', country: '', status: '', minScore: '' });
  const [themes, setThemes] = useState([]);
  const [countries, setCountries] = useState([]);

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fundingRadarApi.listOpportunities(filters);
      setOpportunities(data);
      setThemes((prev) => (prev.length ? prev : [...new Set(data.flatMap((o) => o.themes || []))].sort()));
      setCountries((prev) => (prev.length ? prev : [...new Set(data.flatMap((o) => o.countryEligibility || []))].sort()));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(loadOpportunities, 300);
    return () => clearTimeout(timeout);
  }, [loadOpportunities]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,118,110,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">Veille financement</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Appels à projets</h1>
          <p className="mt-1 text-sm text-slate-500">{opportunities.length} résultat{opportunities.length > 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Rechercher un titre..."
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white"
            />
            <select value={filters.theme} onChange={(e) => updateFilter('theme', e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white">
              <option value="">Toutes thématiques</option>
              {themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filters.country} onChange={(e) => updateFilter('country', e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white">
              <option value="">Tous pays</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white">
              <option value="">Tous statuts</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filters.minScore} onChange={(e) => updateFilter('minScore', e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white">
              <option value="">Tous scores</option>
              <option value="80">80+ — Très pertinent</option>
              <option value="60">60+ — À examiner</option>
              <option value="40">40+ — Faible pertinence</option>
            </select>
          </div>
        </div>

        {loading ? (
          <DashboardLoadingScreen />
        ) : opportunities.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Aucun appel à projets ne correspond à ces filtres.</div>
        ) : (
          <div className="space-y-3">
            {opportunities.map((opp) => {
              const dl = formatDeadline(opp.deadline);
              const tone = opp.relevanceScore >= 70 ? 'border-l-green-600 bg-green-50' : opp.relevanceScore >= 40 ? 'border-l-amber-500 bg-amber-50' : 'border-l-slate-300 bg-slate-50';
              return (
                <div key={opp._id} onClick={() => openOpportunity(opp._id)} className={`cursor-pointer rounded-xl border border-slate-200 border-l-4 p-3 transition hover:border-slate-300 hover:bg-slate-50 ${tone}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">{opp.relevanceScore ?? '—'}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-semibold text-slate-900">{opp.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{opp.funder}</span>
                          <span>•</span>
                          <span>{STATUS_LABELS[opp.status] || opp.status}</span>
                          {opp.themes?.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">{t}</span>)}
                        </div>
                      </div>
                    </div>

                    {dl && (
                      <div className={`shrink-0 rounded-lg border px-2 py-1 text-xs font-medium ${dl.soon ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                        {dl.formatted}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
