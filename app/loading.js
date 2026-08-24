export default function Loading() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-9 w-40" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-3 h-28 skeleton" />
      ))}
    </div>
  );
}