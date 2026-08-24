export default function Loading() {
  return (
    <div>
      <div className="card p-4 mb-4 h-28 skeleton" />
      <div className="skeleton h-9 w-32 mb-3" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-3 h-28 skeleton mb-3" />
      ))}
    </div>
  );
}