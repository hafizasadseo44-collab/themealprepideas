export default function PostsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4">
      <div className="h-8 w-24 rounded-lg bg-brand-gray" />
      <div className="h-4 w-48 rounded bg-brand-gray" />
      <div className="mt-6 space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
