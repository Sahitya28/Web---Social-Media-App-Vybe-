export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-7 w-40" />
        <div className="skeleton h-8 w-32 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 h-24 skeleton" />
        ))}
      </div>
    </div>
  );
}