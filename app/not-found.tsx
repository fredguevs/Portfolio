import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="font-pixel text-[2.5rem] leading-tight">404</h1>
      <p className="mt-2">
        nothing here. <Link href="/">back home</Link>.
      </p>
    </>
  );
}
