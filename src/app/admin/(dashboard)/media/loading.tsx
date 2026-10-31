export default function MediaLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4">
      <div className="h-8 w-32 rounded-lg bg-brand-gray" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
