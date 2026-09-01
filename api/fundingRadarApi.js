// src/api/fundingRadarApi.js
// Client du module de veille, construit sur l'instance Axios centralisée (src/api/axios.js).
// Les erreurs HTTP (401/404/500...) sont déjà gérées (toast + redirection) par les
// intercepteurs d'axios.js — ici on se contente de relayer l'erreur pour un traitement
// local optionnel (ex: message inline dans un formulaire) via error.response?.data?.message.

import api from "./axios";

// axios.js définit baseURL="http://localhost:5000/" (sans /api), alors que le backend
// expose ses routes sous /api/... (cf. app.use('/api', opportunitiesRoutes)).
// On préfixe donc ici pour rester cohérent sans toucher à la config Axios globale.
const PREFIX = "/api";

async function request(path, config = {}) {
  const { data } = await api(`${PREFIX}${path}`, config);
  return data;
}

export const fundingRadarApi = {
  // Opportunités
  listOpportunities: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null),
    );
    return request("/opportunities", { method: "GET", params: cleanParams });
  },
  getOpportunity: (id) => request(`/opportunities/${id}`, { method: "GET" }),
  updateOpportunityStatus: (id, status) =>
    request(`/opportunities/${id}/status`, {
      method: "PATCH",
      data: { status },
    }),
  getDashboardSummary: () =>
    request("/opportunities/dashboard/summary", { method: "GET" }),
  runPipelineNow: () => request("/opportunities/run-now", { method: "POST" }),

  // Profil ONG
  getNgoProfile: () => request("/ngo-profile", { method: "GET" }),
  updateNgoProfile: (data) => request("/ngo-profile", { method: "PUT", data }),

  // Sources
  listSources: () => request("/sources", { method: "GET" }),
  createSource: (data) => request("/sources", { method: "POST", data }),
  updateSource: (id, data) =>
    request(`/sources/${id}`, { method: "PATCH", data }),
  deleteSource: (id) => request(`/sources/${id}`, { method: "DELETE" }),
};
