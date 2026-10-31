export default function UsersLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-4">
      <div className="h-8 w-24 rounded-lg bg-brand-gray" />
      <div className="mt-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-brand-gray" />
        ))}
      </div>
    </div>
  );
}
