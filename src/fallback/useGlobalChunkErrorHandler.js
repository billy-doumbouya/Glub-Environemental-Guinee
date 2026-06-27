// useGlobalChunkErrorHandler.js
//
// React `ErrorBoundary` ne capte que les erreurs levées PENDANT le rendu,
// les hooks de cycle de vie, et les constructeurs. Il NE capte PAS :
//   - les erreurs dans des callbacks async (setTimeout, fetch, promesses)
//   - les rejets de Promise non gérés
//   - certains échecs d'import dynamique selon le bundler et le navigateur
//
// `React.lazy()` retourne une Promise ; si elle est rejetée en dehors d'un
// rendu synchrone (ex: préchargement en arrière-plan), le rejet peut finir
// en tant que `unhandledrejection` global plutôt que d'être attrapé par
// l'ErrorBoundary. Ce hook complète l'ErrorBoundary en écoutant ces cas.
//
// Usage : appeler useGlobalChunkErrorHandler() une seule fois, en haut de
// l'app (ex: dans App.jsx, avant ou dans le même composant que l'ErrorBoundary).

import { useEffect } from 'react'

const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /loading chunk [\d\w]+ failed/i,
  /failed to import/i,
  /importing a module script failed/i,
  /dynamically imported module/i,
]

function isChunkLoadError(message) {
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message))
}

export function useGlobalChunkErrorHandler() {
  useEffect(() => {
    // Cas 1 — Promise rejetée (import dynamique async)
    const handleRejection = (event) => {
      const message = String(event.reason?.message || event.reason || "");
      if (isChunkLoadError(message)) {
        event.preventDefault();
        reloadOnce();
      }
    };

    // Cas 2 — Erreur synchrone globale (ex: chunk manquant au parse)
    const handleError = (event) => {
      const message = String(event.message || event.error?.message || "");
      if (isChunkLoadError(message)) {
        reloadOnce();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);
}

function reloadOnce() {
  const flagKey = "app:chunk-reload-attempted";
  if (!sessionStorage.getItem(flagKey)) {
    sessionStorage.setItem(flagKey, "1");
    window.location.reload();
  }
}