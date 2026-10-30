import { art, type ArtName } from "./art";
import { Pixel } from "./Pixel";

// One place an illustration goes. Shows the drawn-in-code version unless the art
// entry has a `src`, in which case it shows that picture instead (see components/art).
export function ArtSlot({
  name,
  decorative = false,
  className,
}: {
  name: ArtName;
  decorative?: boolean;
  className?: string;
}) {
  const piece = art[name];
  const label = decorative ? undefined : piece.alt;

  if ("src" in piece && typeof piece.src === "string") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={piece.src}
        alt={label ?? ""}
        className={`[image-rendering:pixelated] ${className ?? ""}`}
      />
    );
  }

  return (
    <Pixel
      width={piece.width}
      height={piece.height}
      rects={piece.rects}
      label={label}
      className={className}
    />
  );
}
