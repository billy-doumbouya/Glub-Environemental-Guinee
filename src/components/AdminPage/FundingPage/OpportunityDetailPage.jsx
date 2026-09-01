import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { fundingRadarApi } from '../../../../api/fundingRadarApi';
import { EligibilityBadge, formatDeadline } from '../../shared';

export default function OpportunityDetailPage() {
  const { id: opportunityId } = useParams();
  const navigate = useNavigate();
  const onBack = () => navigate('/admin/veille/opportunites');

  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fundingRadarApi.getOpportunity(opportunityId).then(setOpp).finally(() => setLoading(false));
  }, [opportunityId]);

  async function handleStatusChange(status) {
    setUpdating(true);
    try {
      const updated = await fundingRadarApi.updateOpportunityStatus(opportunityId, status);
      setOpp(updated);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-slate-500">Chargement...</div>
      </DashboardLayout>
    );
  }

  if (!opp) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-slate-500">Opportunité introuvable.</div>
      </DashboardLayout>
    );
  }

  const dl = formatDeadline(opp.deadline);
  const budget = opp.budget || {};

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <button onClick={onBack} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
          ← Retour à la liste
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">Appel à projet</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">{opp.title}</h1>
              <p className="mt-2 text-sm text-slate-500">{opp.funder}</p>
              {opp.aiEligibilityAnalysis?.verdict && (
                <div className="mt-3">
                  <EligibilityBadge verdict={opp.aiEligibilityAnalysis.verdict} />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-center">
              <div className="text-2xl font-bold text-slate-900">{opp.relevanceScore ?? '—'}</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">/ 100 pertinence</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={updating || opp.status === 'favori'} onClick={() => handleStatusChange('favori')}>Ajouter aux favoris</button>
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={updating || opp.status === 'traite'} onClick={() => handleStatusChange('traite')}>Marquer comme traité</button>
          <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60" disabled={updating || opp.status === 'masque'} onClick={() => handleStatusChange('masque')}>Masquer</button>
          {opp.sourceUrl && (
            <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Voir la publication officielle ↗
            </a>
          )}
        </div>

        {opp.aiSummary && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Résumé</h2>
            <p className="text-sm leading-7 text-slate-600">{opp.aiSummary}</p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Informations clés</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Deadline', dl ? `${dl.formatted} (${dl.daysLeft >= 0 ? `${dl.daysLeft} jours restants` : 'passée'})` : 'Non précisée'],
              ['Budget', budget.min || budget.max ? `${budget.min ?? '?'} – ${budget.max ?? '?'} ${budget.currency || ''}` : 'Non précisé'],
              ['Durée', opp.duration || 'Non précisée'],
              ['Pays éligibles', opp.countryEligibility?.length ? opp.countryEligibility.join(', ') : 'Non précisé'],
              ['Thématiques', opp.themes?.length ? opp.themes.map((t) => <span key={t} className="mr-2 inline-flex rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700">{t}</span>) : 'Non précisées'],
              ['Types d’organisation', opp.organizationTypes?.length ? opp.organizationTypes.join(', ') : 'Non précisé'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
                <div className="mt-2 text-sm text-slate-700">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {opp.aiEligibilityAnalysis?.points?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Analyse d'éligibilité</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              {opp.aiEligibilityAnalysis.points.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        )}

        {opp.requirements?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Exigences</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              {opp.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {opp.documentsRequired?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Documents demandés</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              {opp.documentsRequired.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}

        {opp.description && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Contenu brut collecté</h2>
            <p className="text-sm leading-7 text-slate-600">{opp.description}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
