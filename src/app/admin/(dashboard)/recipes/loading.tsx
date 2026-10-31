export default function RecipesLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4">
      <div className="h-8 w-32 rounded-lg bg-brand-gray" />
      <div className="h-4 w-64 rounded bg-brand-gray" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
