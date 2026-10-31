export default function CategoriesLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-4">
      <div className="h-8 w-32 rounded-lg bg-brand-gray" />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
