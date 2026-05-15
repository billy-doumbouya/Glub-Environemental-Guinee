export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-gray-200 animate-pulse"
          style={{ height: i % 3 === 0 ? "24rem" : "12rem" }}
        />
      ))}
    </div>
  );
}
