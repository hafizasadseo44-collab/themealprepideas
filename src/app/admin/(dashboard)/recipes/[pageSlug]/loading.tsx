export default function RecipeListLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-4">
      <div className="h-4 w-24 rounded bg-brand-gray" />
      <div className="h-8 w-48 rounded-lg bg-brand-gray" />
      <div className="space-y-3 pt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
