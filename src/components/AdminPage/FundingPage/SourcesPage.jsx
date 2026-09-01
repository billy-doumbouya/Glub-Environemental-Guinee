import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { fundingRadarApi } from '../../../../api/fundingRadarApi';

const EMPTY_FORM = { name: '', type: 'rss', url: '', isActive: true, selectors: { itemSelector: '', titleSelector: '', linkSelector: '', dateSelector: '' } };

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadSources() {
    setLoading(true);
    try {
      const data = await fundingRadarApi.listSources();
      setSources(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSources(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = form.type === 'html' ? form : { ...form, selectors: undefined };
      await fundingRadarApi.createSource(payload);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await loadSources();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(source) {
    await fundingRadarApi.updateSource(source._id, { isActive: !source.isActive });
    await loadSources();
  }

  async function handleDelete(source) {
    if (!confirm(`Supprimer la source "${source.name}" ? Les opportunités déjà collectées ne seront pas supprimées.`)) return;
    await fundingRadarApi.deleteSource(source._id);
    await loadSources();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-green-100 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,118,110,0.05)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">Veille financement</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Sources de veille</h1>
            <p className="mt-1 text-sm text-slate-500">Sites, flux RSS et APIs suivis automatiquement.</p>
          </div>

          <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700">
            {showForm ? 'Annuler' : '+ Ajouter une source'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Nom du bailleur / de la source</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Type de source</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white">
                  <option value="rss">Flux RSS (recommandé)</option>
                  <option value="api">API officielle</option>
                  <option value="html">Page web (scraping HTML)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">URL {form.type === 'rss' ? 'du flux' : form.type === 'api' ? 'de l’endpoint' : 'de la page liste'}</label>
                <input type="url" required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
              </div>

              {form.type === 'html' && (
                <>
                  <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-800">
                    ⚠ Le scraping HTML ne fonctionne que si ces sélecteurs CSS correspondent réellement à la structure du site. Vérifiez la page avant de la valider.
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sélecteur d'un item de la liste</label>
                    <input type="text" value={form.selectors.itemSelector} onChange={(e) => setForm({ ...form, selectors: { ...form.selectors, itemSelector: e.target.value } })} placeholder=".call-item" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sélecteur du titre</label>
                    <input type="text" value={form.selectors.titleSelector} onChange={(e) => setForm({ ...form, selectors: { ...form.selectors, titleSelector: e.target.value } })} placeholder=".call-title" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sélecteur du lien</label>
                    <input type="text" value={form.selectors.linkSelector} onChange={(e) => setForm({ ...form, selectors: { ...form.selectors, linkSelector: e.target.value } })} placeholder="a.call-link" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sélecteur de la date</label>
                    <input type="text" value={form.selectors.dateSelector} onChange={(e) => setForm({ ...form, selectors: { ...form.selectors, dateSelector: e.target.value } })} placeholder=".call-date" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white" />
                  </div>
                </>
              )}
            </div>

            <div className="mt-5">
              <button type="submit" disabled={saving} className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Ajout...' : 'Ajouter la source'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Chargement...</div>
        ) : sources.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Aucune source configurée. Ajoutez-en une pour démarrer la veille.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Dernière collecte</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s) => (
                    <tr key={s._id} className="border-t border-slate-200">
                      <td className="px-4 py-3">
                        <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${s.lastStatus === 'ok' ? 'bg-green-500' : s.lastStatus === 'error' ? 'bg-red-500' : 'bg-slate-300'}`} />
                        {s.lastStatus === 'ok' ? 'OK' : s.lastStatus === 'error' ? 'Erreur' : 'Jamais lancée'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                      <td className="px-4 py-3 uppercase tracking-[0.12em] text-slate-500">{s.type}</td>
                      <td className="px-4 py-3">{s.lastFetchedAt ? new Date(s.lastFetchedAt).toLocaleString('fr-FR') : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => toggleActive(s)}>{s.isActive ? 'Désactiver' : 'Activer'}</button>
                          <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100" onClick={() => handleDelete(s)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
