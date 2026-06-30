export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-gray-200"
          style={{ height: i % 3 === 0 ? "24rem" : "12rem" }}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      ))}
    </div>
  );
};