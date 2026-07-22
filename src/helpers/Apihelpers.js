// src/utils/apiHelpers.js
// Helpers pour lire en toute sécurité les réponses de l'API backend.
//
// Le backend renvoie systématiquement des réponses de la forme :
//   { success: true, data: [...] }
//   { success: true, data: [...], pagination: { total, page, limit, pages } }
//   { success: true, data: {...}, message: "..." }
//
// Ces helpers évitent de recoder cette logique (et ses pièges) dans chaque
// composant/hook, et protègent contre les crashs type "x.map is not a function"
// si le backend change de forme un jour ou renvoie une erreur inattendue.

/**
 * Extrait un tableau depuis une réponse Axios, quelle que soit sa forme.
 * Ne lève jamais — retourne toujours un tableau (vide si rien de valide trouvé).
 *
 * @param {import('axios').AxiosResponse | any} res - réponse Axios complète (res.data sera lu) ou un objet déjà "unwrap"
 * @returns {any[]}
 */
export function extractArray(res) {
  const payload = res?.data !== undefined ? res.data : res;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.images)) return payload.images;

  return [];
}

/**
 * Extrait un objet unique (ex: GET /projects/:slug) depuis une réponse Axios.
 * Retourne null si rien de valide n'est trouvé (au lieu de undefined,
 * pour forcer un check explicite `if (!item)` côté appelant).
 *
 * @param {import('axios').AxiosResponse | any} res
 * @returns {object | null}
 */
export function extractItem(res) {
  const payload = res?.data !== undefined ? res.data : res;

  if (!payload) return null;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data;
  }
  if (typeof payload === "object" && !Array.isArray(payload)) return payload;

  return null;
}

/**
 * Extrait les infos de pagination d'une réponse Axios.
 * Retourne des valeurs par défaut sûres si absentes (évite les NaN dans l'UI).
 *
 * @param {import('axios').AxiosResponse | any} res
 * @returns {{ total: number, page: number, limit: number, pages: number }}
 */
export function extractPagination(res) {
  const payload = res?.data !== undefined ? res.data : res;
  const pagination = payload?.pagination;

  return {
    total: Number(pagination?.total ?? payload?.total ?? 0),
    page: Number(pagination?.page ?? 1),
    limit: Number(pagination?.limit ?? 0),
    pages: Number(pagination?.pages ?? 1),
  };
}