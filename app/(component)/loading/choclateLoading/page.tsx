// app/loading.tsx
// Next.js (App Router) + TypeScript + Tailwind.
// Next.js shows this automatically while a route segment is loading.

const SQUARE_COLORS = [
  "#B4531E", "#B4531E", "#B4531E", "#B4531E",
  "#C9692F", "#C9692F", "#C9692F", "#C9692F",
  "#E8A66B", "#E8A66B", "#E8A66B", "#E8A66B",
];

export default function ChoclateLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-10  px-6 py-12 text-[#FAF3EA]"
    >
      <style>{`
        @keyframes cacaoFill {
          0%, 8%    { opacity: 0.12; transform: scale(0.86); }
          22%, 78%  { opacity: 1;    transform: scale(1); }
          92%, 100% { opacity: 0.12; transform: scale(0.86); }
        }
        @keyframes cacaoPulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        .cacao-sq  { animation: cacaoFill 2.4s ease-in-out infinite; }
        .cacao-msg { animation: cacaoPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cacao-sq, .cacao-msg { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <div className="font-serif text-4xl font-semibold tracking-tight">
        Cacao &amp; Co.
      </div>

      <div
        aria-hidden="true"
        className="grid w-60 grid-cols-4 gap-1.5 rounded-2xl  p-2.5 ring-1 ring-inset "
      >
        {SQUARE_COLORS.map((color, i) => (
          <div
            key={i}
            className="cacao-sq h-12 rounded-md"
            style={{ backgroundColor: color, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <p className="cacao-msg text-base text-[#E6D6C3]">Melting the chocolate…</p>
    </div>
  );
}