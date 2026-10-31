export default function CommentsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4">
      <div className="h-8 w-32 rounded-lg bg-brand-gray" />
      <div className="mt-4 space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
