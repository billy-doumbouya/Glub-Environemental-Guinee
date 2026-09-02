import { Leaf } from 'lucide-react'

export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-green-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="font-poppins font-semibold text-gray-700">Chargement de la page...</p>
        <p className="text-gray-400 text-sm mt-1">C.E.G — Club Environnemental de Guinée</p>
      </div>
    </div>
  )
}
