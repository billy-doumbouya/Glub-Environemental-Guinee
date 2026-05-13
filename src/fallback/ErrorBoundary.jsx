import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="font-poppins font-bold text-2xl text-gray-900 mb-3">
              Une erreur est survenue
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Nous nous excusons pour ce désagrément. Veuillez rafraîchir la page ou revenir à l'accueil.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraîchir
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
