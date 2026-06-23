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
    const handleRejection = (event) => {
      const message = String(event.reason?.message || event.reason || '')

      if (isChunkLoadError(message)) {
        console.error('Chunk load error (unhandled rejection):', event.reason)

        const flagKey = 'app:chunk-reload-attempted'
        const alreadyTried = sessionStorage.getItem(flagKey)

        if (!alreadyTried) {
          // Empêche l'affichage du message d'erreur natif du navigateur
          event.preventDefault()
          sessionStorage.setItem(flagKey, '1')
          window.location.reload()
        }
        // Si déjà essayé une fois dans cette session, on laisse l'erreur
        // remonter normalement (évite une boucle infinie de rechargement
        // en cas de vraie panne réseau / serveur down).
      }
    }

    window.addEventListener('unhandledrejection', handleRejection)
    return () => window.removeEventListener('unhandledrejection', handleRejection)
  }, [])
}