"use client";

import { useState } from "react";

export function ListingGallery({
  photos,
  alt,
}: {
  photos: { id: number; url: string }[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) return null;

  const active = photos[Math.min(activeIndex, photos.length - 1)];

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={alt}
          className="h-64 w-full object-cover sm:h-80"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === activeIndex ? "border-accent-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`${i + 1}-ci şəklə bax`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
