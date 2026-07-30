export function GallerySkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[11rem] sm:auto-rows-[13rem]">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative w-full h-full rounded-2xl bg-gray-200 animate-pulse overflow-hidden flex flex-col justify-end p-3 sm:p-4"
        >
          {/* Skeleton pour le texte/titre en bas du composant */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded-md w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
