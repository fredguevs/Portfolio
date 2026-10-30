// Little pixel icons for the links list and the theme toggle, on a 16×16 grid.

const icons = {
  globe: (
    <>
      <circle cx="8" cy="8" r="6.5" fill="#3a78d6" stroke="#001a57" />
      <path d="M4 5h3v2H5v2H3.5V6zM9 9h3v3h-2v-1H9zM9 3.5h2V5H9z" fill="#2f9e44" />
    </>
  ),
  resume: (
    <>
      <path d="M3.5 1.5h6l3 3v10h-9z" fill="#fff" stroke="#000" />
      <path d="M9.5 1.5v3h3" fill="none" stroke="#000" />
      <rect x="5" y="6" width="6" height="2" fill="#c00000" />
      <rect x="5" y="9.5" width="6" height="1" fill="#808080" />
      <rect x="5" y="11.5" width="4" height="1" fill="#808080" />
    </>
  ),
  envelope: (
    <>
      <rect x="1.5" y="3.5" width="13" height="9" fill="#fff" stroke="#000" />
      <path d="M1.5 3.5l6.5 5 6.5-5" fill="none" stroke="#000" />
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
