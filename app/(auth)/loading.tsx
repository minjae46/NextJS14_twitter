export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="animate-pulse h-24 w-60 bg-neutral-700 rounded-md"></div>
      <div className="py-10 animate-pulse flex flex-col gap-5">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="*:rounded-md flex gap-5 ">
            <div className="flex flex-col gap-1 *:rounded-md">
              <div className="bg-neutral-700 h-5 w-10" />
              <div className="bg-neutral-700 h-5 w-20" />
              <div className="bg-neutral-700 h-5 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
