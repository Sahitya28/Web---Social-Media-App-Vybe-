export default function Spinner({ size = "w-8 h-8" }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${size} rounded-full border-4 border-vybe-border border-t-vybe-purple animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}