import Image from 'next/image';

/** The white and orange NairobiX mark, cropped from the transparent brand asset. */
export function NairobiXLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden ${className}`} aria-hidden="true">
      <Image
        src="/images/NairobiX-logo.png"
        alt=""
        fill
        sizes="64px"
        className="object-cover object-center"
        priority
      />
    </span>
  );
}
