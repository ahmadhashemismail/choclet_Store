// app/cart/loading.tsx
// Next.js (App Router) + TypeScript.
// Styles are inline plus one <style> block, so it looks the same
// with or without Tailwind. No external fonts or libraries.

const DROPS = [
  { left: 14, color: "#4A2A1C", delay: "0s" },
  { left: 49, color: "#B4531E", delay: "0.6s" },
  { left: 84, color: "#7A4A2B", delay: "1.2s" },
];

export default function Mainpageloading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "48px 24px",
        color: " #a36649",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}
    >
      <style>{`
        @keyframes cacaoBar   { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
        @keyframes cacaoDots  { 0%, 20% { opacity: 0.2; } 40% { opacity: 1; } 100% { opacity: 0.2; } }
        @keyframes cacaoDrop  {
          0%   { transform: translateY(-14px) rotate(-12deg); opacity: 0; }
          15%  { opacity: 1; }
          70%  { transform: translateY(62px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(70px) rotate(8deg); opacity: 0; }
        }
        @keyframes cacaoCatch { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.06, 0.94); } }
        @keyframes cacaoFade  { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
        .cacao-run   { animation: cacaoBar 1.4s ease-in-out infinite; }
        .cacao-dot   { animation: cacaoDots 1.4s ease-in-out infinite; }
        .cacao-drop  { animation: cacaoDrop 1.8s ease-in infinite; }
        .cacao-catch { animation: cacaoCatch 0.6s ease-in-out infinite; transform-origin: 50% 100%; }
        .cacao-brand { animation: cacaoFade 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cacao-run, .cacao-dot, .cacao-drop, .cacao-catch, .cacao-brand { animation: none; }
          .cacao-drop { opacity: 0; }
          .cacao-run { transform: none; width: 100%; }
        }
      `}</style>

      {/* Store name */}
      <div
        className="cacao-brand"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: "-0.01em",
         color: "#fff2df",
        }}
      >
        Cacao &amp; Co.
      </div>

      {/* Falling chocolate squares + cart */}
      <div
        aria-hidden="true"
        style={{ position: "relative", width: 120, height: 160 }}
      >
        {DROPS.map((d, i) => (
          <div
            key={i}
            className="cacao-drop"
            style={{
              position: "absolute",
              left: d.left,
              top: 0,
              width: 22,
              height: 22,
              borderRadius: 5,
              background: d.color,
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18)",
              animationDelay: d.delay,
            }}
          />
        ))}
        <div
          className="cacao-catch"
          style={{
            position: "absolute",
            left: 12,
            bottom: 0,
            width: 96,
            height: 96,
            borderRadius: 28,
            background: "#2A1710",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E8A66B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 8h14l-1.2 11H6.2L5 8z" />
            <path d="M9 8V6a3 3 0 016 0v2" />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div
        aria-hidden="true"
        style={{
          width: 260,
          height: 8,
          borderRadius: 999,
          background: "#E6D6C3",
          overflow: "hidden",
        }}
      >
        <div
          className="cacao-run"
          style={{
            width: "40%",
            height: "100%",
            borderRadius: 999,
            background: "#B4531E",
          }}
        />
      </div>

      {/* Message */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontSize: 16,
          color: "#fff2df",
        }}
      >
        <span>Loading your cart</span>
        <span className="cacao-dot" style={{ animationDelay: "0s" }}>.</span>
        <span className="cacao-dot" style={{ animationDelay: "0.2s" }}>.</span>
        <span className="cacao-dot" style={{ animationDelay: "0.4s" }}>.</span>
      </div>
    </div>
  );
}