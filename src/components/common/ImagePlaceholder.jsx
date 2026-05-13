export function ImagePlaceholder({ className = '', label = '', icon = '🌿' }) {
  return (
    <div
      className={`bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-2 ${className}`}
      role="img"
      aria-label={label || 'Image à venir'}
    >
      <span className="text-4xl">{icon}</span>
      {label && <p className="text-green-600 text-sm font-medium text-center px-4">{label}</p>}
    </div>
  )
}
