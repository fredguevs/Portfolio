// Little pixel icons for the links list and the theme toggle, on a 16×16 grid.

const icons = {
  globe: (
    <>
      <circle cx="8" cy="8" r="6.5" fill="#3a78d6" stroke="#001a57" />
      <path d="M4 5h3v2H5v2H3.5V6zM9 9h3v3h-2v-1H9zM9 3.5h2V5H9z" fill="#2f9e44" />
    </>
  ),
  envelope: (
    <>
      <rect x="1.5" y="3.5" width="13" height="9" fill="#fff" stroke="#000" />
      <path d="M1.5 3.5l6.5 5 6.5-5" fill="none" stroke="#000" />
    </>
  ),
  // GitHub's cat in its circle, in the page's own colors so it flips with the theme.
  github: (
    <>
      <path
        d="M5 1h6v1h-6zM3 2h10v1h-10zM2 3h12v1h-12zM1 4h14v8h-14zM2 12h12v1h-12zM3 13h10v1h-10zM5 14h6v1h-6z"
        fill="var(--ink)"
      />
      <path
        d="M4 3h1v1h-1zM11 3h1v1h-1zM3 4h3v1h-3zM10 4h3v1h-3zM3 5h10v4h-10zM4 9h8v1h-8zM6 10h4v5h-4zM2 10h1v1h-1zM3 11h1v1h-1zM4 12h2v1h-2z"
        fill="var(--bg)"
      />
    </>
  ),
  // The LinkedIn "in" on its blue square.
  linkedin: (
    <>
      <path d="M2 1h12v1h1v12h-1v1H2v-1H1V2h1z" fill="#0a66c2" />
      <path d="M4 4h2v2H4zM4 7h2v5H4zM7 7h4v1h1v4h-2V9H9v3H7z" fill="#fff" />
    </>
  ),
  sun: (
    <>
      <circle cx="8" cy="8" r="3.5" fill="#f2c200" stroke="#7a5c00" strokeWidth="0.75" />
      <path d="M7.5 0.5h1v2.5h-1zM7.5 13h1v2.5h-1zM0.5 7.5h2.5v1H0.5zM13 7.5h2.5v1H13z" fill="#f2c200" />
    </>
  ),
  moon: <path d="M10 1.5a6.5 6.5 0 1 0 4.5 11 5 5 0 0 1-4.5-11z" fill="#f2e08a" stroke="#000" strokeWidth="0.75" />,
};

export type IconName = keyof typeof icons;

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ""}`}
    >
      {icons[name]}
    </svg>
  );
}
