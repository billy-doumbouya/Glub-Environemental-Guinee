import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'

// Messages typiques renvoyés par les bundlers (Vite, Webpack, Rollup) quand
// un chunk JS référencé n'existe plus sur le serveur (généralement après un
// nouveau déploiement qui a supprimé les anciens fichiers hashés).
const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /loading chunk [\d\w]+ failed/i,
  /failed to import/i,
  /importing a module script failed/i,
  /dynamically imported module/i,
  /unable to preload css/i,
]

function isChunkLoadError(error) {
  if (!error) return false
  const message = String(error.message || error)
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message))
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isChunkError: false,
      showDetails: false,
    }
    this._reloadAttempted = false
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      isChunkError: isChunkLoadError(error),
    }
  }

  componentDidCatch(error, info) {
    // Log structuré pour vos outils de monitoring (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught:', error, info)

    // Cas particulier : un chunk obsolète après un déploiement.
    // On tente UNE fois un rechargement automatique et silencieux avant
    // d'afficher quoi que ce soit à l'utilisateur, en gardant une trace
    // dans sessionStorage pour éviter une boucle infinie si le problème
    // persiste (ex: vraie panne réseau).
    if (this.state.isChunkError && !this._reloadAttempted) {
      const flagKey = 'app:chunk-reload-attempted'
      const alreadyTried = sessionStorage.getItem(flagKey)

      if (!alreadyTried) {
        sessionStorage.setItem(flagKey, '1')
        this._reloadAttempted = true
        window.location.reload()
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('app:chunk-reload-attempted')
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { error, isChunkError, showDetails } = this.state

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  isChunkError ? 'bg-amber-50' : 'bg-red-50'
                }`}
              >
                <AlertTriangle
                  className={`w-8 h-8 ${
                    isChunkError ? 'text-amber-500' : 'text-red-500'
                  }`}
                />
              </div>

              <h1 className="font-bold text-xl text-slate-900 mb-2">
                {isChunkError
                  ? 'Nouvelle version disponible'
                  : 'Une erreur est survenue'}
              </h1>

              <p className="text-slate-500 mb-7 leading-relaxed text-sm">
                {isChunkError
                  ? "L'application a été mise à jour. Rechargez la page pour continuer."
                  : "Nous nous excusons pour ce désagrément. Vous pouvez réessayer ou revenir à l'accueil."}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Rafraîchir
                </button>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Accueil
                </a>
              </div>

              {/* Détails techniques repliés : utiles en dev / support,
                  jamais affichés bruts par défaut à l'utilisateur final */}
              {error && (
                <div className="mt-6 pt-5 border-t border-slate-100 text-left">
                  <button
                    onClick={() =>
                      this.setState((s) => ({ showDetails: !s.showDetails }))
                    }
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mx-auto transition-colors"
                  >
                    Détails techniques
                    {showDetails ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {showDetails && (
                    <pre className="mt-3 text-[11px] text-slate-500 bg-slate-50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words max-h-40">
                      {String(error.message || error)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}