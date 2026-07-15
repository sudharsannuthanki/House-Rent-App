// Generic loading placeholders shown while data is being fetched,
// so lists don't jump from blank to populated with no in-between state.

export function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function PropertyCardSkeleton() {
  return (
    <div className="card property-card">
      <Skeleton className="property-card-media-placeholder" />
      <Skeleton style={{ height: 18, width: "80%", margin: "12px 0 8px", borderRadius: 6 }} />
      <Skeleton style={{ height: 13, width: "50%", marginBottom: 8, borderRadius: 6 }} />
      <Skeleton style={{ height: 13, width: "65%", marginBottom: 10, borderRadius: 6 }} />
      <Skeleton style={{ height: 20, width: "40%", borderRadius: 6 }} />
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
