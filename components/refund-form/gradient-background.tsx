export function GradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f4f2fb]">
      <div className="animate-blob-1 absolute -left-1/4 -top-1/4 h-[70vmax] w-[70vmax] rounded-full bg-indigo-200/60 blur-3xl" />
      <div className="animate-blob-2 absolute -right-1/4 top-0 h-[65vmax] w-[65vmax] rounded-full bg-yellow-100/70 blur-3xl" />
      <div className="animate-blob-3 absolute -bottom-1/3 left-1/4 h-[75vmax] w-[75vmax] rounded-full bg-pink-100/60 blur-3xl" />
      <div className="animate-blob-1 absolute bottom-0 right-0 h-[60vmax] w-[60vmax] rounded-full bg-emerald-100/50 blur-3xl [animation-delay:-6s]" />
    </div>
  );
}
