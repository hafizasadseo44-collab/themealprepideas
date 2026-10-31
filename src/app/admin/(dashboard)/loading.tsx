export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-brand-gray" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-brand-gray" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-64 rounded-2xl bg-brand-gray" />
        <div className="h-64 rounded-2xl bg-brand-gray" />
      </div>
    </div>
  );
}
