"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Stable key for the fallback so a dish always falls back to the same picture. */
  seed?: string;
  /** First-screen hero only — makes the LCP image eager instead of lazy. */
  priority?: boolean;
}

// Every photo in the app funnels through here. Hotlinked Unsplash IDs rot
// (we've already replaced 15 dead ones), so on error we swap to a
// deterministic picsum fallback instead of rendering a broken-image icon.
// Nothing photo-shaped should use next/image directly.
export default function SafeImage({ src, alt, className, sizes, seed, priority }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed ?? alt)}/800/600`;

  return (
    <Image
      src={failed ? fallback : src}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
