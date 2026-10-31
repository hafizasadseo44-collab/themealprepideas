export default function PostEditLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-8 w-56 rounded-lg bg-brand-gray" />
      <div className="h-12 w-full rounded-xl bg-brand-gray" />
      <div className="h-64 w-full rounded-xl bg-brand-gray" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 rounded-lg bg-brand-gray" />
        <div className="h-10 rounded-lg bg-brand-gray" />
      </div>
    </div>
  );
}
