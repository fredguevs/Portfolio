import type { Rect } from "./Pixel";
import {
  conveyorArch,
  conveyorBase,
  conveyorHeight,
  conveyorItems,
  conveyorWidth,
} from "./art/conveyor";

// The conveyor under the KNAPP entry. The boxes (and the marks on the belt) slide
// along one pixel at a time and loop; they're clipped to the belt so they appear
// and disappear at its ends, and pass behind the scanner arch. The motion is the
// .conveyor-move rule in globals.css, and stops with reduced motion. Put the cat on
// the belt or on a box and it rides along to the end (lib/surfaces.ts reads how far
// the data-belt layer has moved).

const rects = (list: readonly Rect[], dx = 0) =>
  list.map(([x, y, w, h, fill, cls], i) => (
    <rect key={`${dx}-${i}`} x={x + dx} y={y} width={w} height={h} fill={fill} className={cls} />
  ));

export function Conveyor({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${conveyorWidth} ${conveyorHeight}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel art of a conveyor belt moving cardboard boxes and a blue tote through a scanner."
      className={className}
    >
      <defs>
        <clipPath id="conveyor-belt">
          <rect x="4" y="0" width="88" height={conveyorHeight} />
        </clipPath>
      </defs>
      {rects(conveyorBase)}
      <g clipPath="url(#conveyor-belt)">
        <g className="conveyor-move" data-belt="">
          {rects(conveyorItems)}
          {rects(conveyorItems, -conveyorWidth)}
        </g>
      </g>
      {rects(conveyorArch)}
    </svg>
  );
}
