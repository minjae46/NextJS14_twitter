export default function Loading() {
  return (
    <div className="animate-pulse p-5 flex flex-col gap-10">
      <div className="flex gap-2 items-center">
        <div className="size-10 rounded-xl bg-neutral-700" />
        <div className="h-5 w-40 bg-neutral-700 rounded-md" />
      </div>
      <div className="h-10 w-80 bg-neutral-700 rounded-md" />
    </div>
  );
}
