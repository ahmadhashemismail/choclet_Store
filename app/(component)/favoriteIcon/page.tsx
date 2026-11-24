"use client";

// components/FavoriteButton.tsx
// Next.js (App Router) + TypeScript + Tailwind.
// Animated favorite (heart) button: pop, ring, and a burst of dots.
// Usage: <FavoriteButton onChange={(isFav) => console.log(isFav)} />

import { useState } from "react";

type Anim = "" | "fav-on" | "fav-off";

type Props = {
  defaultFavorite?: boolean;
  onChange?: (isFavorite: boolean) => void;
};

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function FavoriteButton({ defaultFavorite = false, onChange }: Props) {
  const [fav, setFav] = useState(defaultFavorite);
  const [anim, setAnim] = useState<Anim>("");

  function toggle() {
    const next = !fav;
    setFav(next);
    setAnim(next ? "fav-on" : "fav-off");
    onChange?.(next);
  }

  return (
    <>
      {/* Keyframes and the parts Tailwind can't express */}
      <style>{`
        .fav-heart path { fill: transparent; stroke: #B4531E; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: fill .2s ease; }
        .fav-is-on .fav-heart path { fill: #B4531E; }
        @keyframes favPop    { 0% { transform: scale(0.55); } 45% { transform: scale(1.35); } 70% { transform: scale(0.92); } 100% { transform: scale(1); } }
        @keyframes favRing   { 0% { transform: scale(0.4); opacity: 0.7; } 100% { transform: scale(1.7); opacity: 0; } }
        @keyframes favBurst  { 0% { transform: rotate(var(--a)) translateY(-30px) scale(0.3); opacity: 1; } 100% { transform: rotate(var(--a)) translateY(-70px) scale(1); opacity: 0; } }
        @keyframes favShrink { 0% { transform: scale(1); } 50% { transform: scale(0.78); } 100% { transform: scale(1); } }
        .fav-on .fav-heart  { animation: favPop .6s cubic-bezier(.3, 1.4, .5, 1); }
        .fav-on .fav-ring   { animation: favRing .55s ease-out; }
        .fav-on .fav-p      { animation: favBurst .6s ease-out; }
        .fav-off .fav-heart { animation: favShrink .3s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .fav-heart, .fav-ring, .fav-p { animation: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={fav}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        className={`relative flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[rgb(209, 139, 17)] ring-1 ring-inset ring-[#E6D6C3] transition-colors hover:bg-[#F6E9DA] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#E8A66B] ${
          fav ? "fav-is-on" : ""
        } ${anim}`}
      >
        {/* Expanding ring */}
        <span className="fav-ring pointer-events-none absolute left-1/2 top-1/2 -ml-42px] -mt-42px h-[10px] w-[10px] rounded-full border-[3px] border-[#B4531E] opacity-0" />

        {/* Burst dots */}
        {ANGLES.map((angle, i) => {
          const big = i % 2 === 0;
          return (
            <span
              key={angle}
              className="fav-p pointer-events-none absolute left-1/2 top-1/2 rounded-full opacity-0"
              style={
                {
                  "--a": `${angle}deg`,
                  width: big ? 10 : 7,
                  height: big ? 10 : 7,
                  marginLeft: big ? -5 : -3.5,
                  marginTop: big ? -5 : -3.5,
                  backgroundColor: big ? "#B4531E" : "#E8A66B",
                } as React.CSSProperties
              }
            />
          );
        })}

        {/* Heart */}
        <svg
          className="fav-heart relative z-[2] h-[20px] w-[20px] overflow-visible"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.4 5 6.6 5c2 0 3.5 1.1 5.4 3.2C13.9 6.1 15.4 5 17.4 5c3.2 0 5.1 3 3.9 6.3-1.8 4.6-9.3 9.2-9.3 9.2z" />
        </svg>
      </button>
    </>
  );
}