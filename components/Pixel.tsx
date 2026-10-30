// Draws pixel art from a list of rectangles on a small grid. The SVG scales to
// whatever width it's given and keeps the edges hard.

export type Rect = readonly [x: number, y: number, w: number, h: number, fill: string, className?: string];

export function Pixel({
  width,
  height,
  rects,
  label,
  className,
}: {
  width: number;
  height: number;
  rects: readonly Rect[];
  label?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      {rects.map(([x, y, w, h, fill, cls], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} className={cls} />
      ))}
    </svg>
  );
}
