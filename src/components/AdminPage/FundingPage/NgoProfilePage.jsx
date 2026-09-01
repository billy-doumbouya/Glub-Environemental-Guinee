import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { fundingRadarApi } from '../../../../api/fundingRadarApi';

function listToText(list) { return (list || []).join(', '); }
function textToList(text) { return text.split(',').map((s) => s.trim()).filter(Boolean); }

export default function NgoProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fundingRadarApi.getNgoProfile().then(setProfile).finally(() => setLoading(false));
  }, []);

  function updateField(path, value) {
    setSaved(false);
    setProfile((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cursor = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cursor[keys[i]] = { ...cursor[keys[i]] };
        cursor = cursor[keys[i]];
      }
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await fundingRadarApi.updateNgoProfile(profile);
      setProfile(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-slate-500">Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,118,110,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">Veille financement</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Profil de l’ONG</h1>
          <p className="mt-1 text-sm text-slate-500">Ce profil détermine le score de pertinence de chaque appel à projet.</p>
        </div>

        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Type d'organisation</label>
              <input type="text" value={profile.organizationType || ''} onChange={(e) => updateField('organizationType', e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Thématiques d'intervention</label>
              <input type="text" value={listToText(profile.interventionThemes)} onChange={(e) => updateField('interventionThemes', textToList(e.target.value))} placeholder="éducation, jeunesse, santé" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
              <p className="mt-1 text-xs text-slate-500">Séparées par des virgules.</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Groupes cibles</label>
              <input type="text" value={listToText(profile.targetGroups)} onChange={(e) => updateField('targetGroups', textToList(e.target.value))} placeholder="jeunes, femmes, réfugiés" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Pays d'intervention</label>
              <input type="text" value={listToText(profile.eligibleCountries)} onChange={(e) => updateField('eligibleCountries', textToList(e.target.value))} placeholder="Guinée, Sénégal, Mali" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Régions</label>
              <input type="text" value={listToText(profile.regions)} onChange={(e) => updateField('regions', textToList(e.target.value))} placeholder="Afrique de l'Ouest" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Années d'expérience</label>
              <input type="number" value={profile.yearsOfExperience || ''} onChange={(e) => updateField('yearsOfExperience', Number(e.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Langues de travail</label>
              <input type="text" value={listToText(profile.languages)} onChange={(e) => updateField('languages', textToList(e.target.value))} placeholder="français, anglais" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Budget de projet habituel</label>
              <div className="grid gap-3 md:grid-cols-2">
                <input type="number" placeholder="Min" value={profile.typicalProjectBudget?.min || ''} onChange={(e) => updateField('typicalProjectBudget.min', Number(e.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
                <input type="number" placeholder="Max" value={profile.typicalProjectBudget?.max || ''} onChange={(e) => updateField('typicalProjectBudget.max', Number(e.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Partenaires habituels</label>
              <input type="text" value={listToText(profile.partners)} onChange={(e) => updateField('partners', textToList(e.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Contraintes d'éligibilité connues</label>
              <textarea value={listToText(profile.legalConstraints)} onChange={(e) => updateField('legalConstraints', textToList(e.target.value))} placeholder="ex: pas de sous-traitance, statut local requis" className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Pondération du score (doit totaliser 100)</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {['geo', 'theme', 'orgType', 'targetGroup', 'budget', 'experience', 'other'].map((key) => (
                <div key={key}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{{
                    geo: 'Pays / zone',
                    theme: 'Thématique',
                    orgType: 'Type d’org.',
                    targetGroup: 'Public cible',
                    budget: 'Budget',
                    experience: 'Expérience',
                    other: 'Autres',
                  }[key]}</label>
                  <input type="number" value={profile.scoringWeights?.[key] ?? ''} onChange={(e) => updateField(`scoringWeights.${key}`, Number(e.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {saved && <span className="text-sm text-green-700">Profil mis à jour.</span>}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
